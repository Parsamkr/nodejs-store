const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
  timeout: 20000,
});
// Expose socket to window for use in script.js
window.socket = socket;

// Handle connection errors
socket.on("connect_error", (error) => {
  const chatStatus = document.getElementById("chat-status");
  if (chatStatus) {
    chatStatus.textContent = "Connecting...";
  }
});

socket.on("disconnect", (reason) => {
  const chatStatus = document.getElementById("chat-status");
  if (chatStatus) {
    chatStatus.textContent = "Disconnected";
  }
  if (reason === "io server disconnect") {
    // Server disconnected the socket, manual reconnection needed
    socket.connect();
  }
});

// Function to load namespaces into the dropdown
function loadNamespaces(namespaces) {
  if (!namespaces || !Array.isArray(namespaces) || namespaces.length === 0) {
    return;
  }

  const dropdown = document.getElementById("namespace-dropdown");
  if (!dropdown) {
    // If dropdown doesn't exist yet (chat not initialized), store and wait
    window.pendingNamespaces = namespaces;
    return;
  }

  // Clear existing items
  dropdown.innerHTML = "";

  // Add all namespaces to dropdown
  namespaces.forEach((ns, index) => {
    if (!ns || !ns.endpoint || !ns.title) {
      return;
    }
    const item = document.createElement("div");
    item.classList.add("namespace-item");
    item.setAttribute("data-namespace", ns.endpoint);
    item.textContent = ns.title;
    dropdown.appendChild(item);
  });

  // Add click handler for namespace selection (use event delegation on the original dropdown)
  // Event delegation means the handler on the parent will work even when children are replaced
  // Check if handler was already added (persists even when innerHTML is cleared)
  if (!dropdown.dataset.handlerAdded) {
    dropdown.addEventListener("click", (e) => {
      const target = e.target.closest(".namespace-item");
      if (!target) return;

      const endpoint = target.getAttribute("data-namespace");
      const title = target.textContent;

      const namespaceData = window.namespacesData?.find(
        (ns) => ns.endpoint === endpoint
      );
      const rooms = namespaceData?.rooms || [];

      if (typeof window.switchNamespace === "function") {
        window.switchNamespace(endpoint, title, rooms);
      }

      // Always request rooms to ensure we have the latest data
      socket.emit("getRooms", endpoint);

      // Close dropdown
      dropdown.classList.remove("show");
      const selector = document.querySelector(".namespace-selector");
      if (selector) selector.classList.remove("active");
    });
    dropdown.dataset.handlerAdded = "true";
  }

  // Select the first namespace by default if switchNamespace is available
  // Use a small delay to ensure the function is available after initialization
  if (namespaces.length > 0) {
    const firstNs = namespaces[0];

    // Try to select immediately if available
    if (typeof window.switchNamespace === "function") {
      window.switchNamespace(
        firstNs.endpoint,
        firstNs.title,
        firstNs.rooms || []
      );
      // Always request rooms to ensure we have them
      socket.emit("getRooms", firstNs.endpoint);
    } else {
      // Store for later selection when switchNamespace becomes available
      window.pendingFirstNamespace = firstNs;

      // Also try after a short delay in case it becomes available soon
      setTimeout(() => {
        if (
          typeof window.switchNamespace === "function" &&
          window.pendingFirstNamespace
        ) {
          window.switchNamespace(
            window.pendingFirstNamespace.endpoint,
            window.pendingFirstNamespace.title,
            window.pendingFirstNamespace.rooms || []
          );
          socket.emit("getRooms", window.pendingFirstNamespace.endpoint);
          window.pendingFirstNamespace = null;
        }
      }, 100);
    }
  }
}

// Expose loadNamespaces function
window.loadNamespaces = loadNamespaces;

// Register event listeners outside connect callback to ensure they're always active
socket.on("namespacesList", (namespaces) => {
  // Validate namespaces data
  if (!namespaces || !Array.isArray(namespaces)) {
    console.error("Invalid namespaces data received:", namespaces);
    return;
  }

  // Store namespaces data globally
  window.namespacesData = namespaces;

  // Load namespaces into UI
  loadNamespaces(namespaces);
});

// Handle rooms returned on root socket
socket.on("roomsList", ({ endpoint, rooms }) => {
  if (!endpoint) {
    console.error("roomsList event missing endpoint");
    return;
  }

  // Validate rooms data
  const validRooms = Array.isArray(rooms) ? rooms : [];

  // Cache rooms in namespacesData for future clicks
  if (Array.isArray(window.namespacesData)) {
    const idx = window.namespacesData.findIndex((n) => n.endpoint === endpoint);
    if (idx > -1) {
      window.namespacesData[idx].rooms = validRooms;
    }
  }

  // If this namespace is currently selected, render its rooms
  const activeItem = document.querySelector(".namespace-item.active");
  const activeEndpoint = activeItem?.getAttribute("data-namespace");

  if (activeEndpoint === endpoint) {
    if (typeof window.renderRooms === "function") {
      window.renderRooms(
        validRooms.map((r) => ({
          name: r.name,
          description: r.description || "",
          image: r.image || "",
        }))
      );
      if (validRooms.length > 0 && typeof window.switchRoom === "function") {
        window.switchRoom(endpoint, validRooms[0].name.toLowerCase());
      }
    }
  }
});

// Handle room details
socket.on("roomDetails", (roomDetails) => {
  if (roomDetails && typeof window.displayRoomDetails === "function") {
    window.displayRoomDetails(roomDetails);
  }
});

// Handle room online count updates
socket.on("roomOnlineCount", ({ endpoint, roomName, count }) => {
  // Only update if this is the current room
  const activeItem = document.querySelector(".namespace-item.active");
  const activeEndpoint = activeItem?.getAttribute("data-namespace");
  const activeRoomItem = document.querySelector(".room-item.active");
  const activeRoom = activeRoomItem?.getAttribute("data-room");

  if (
    activeEndpoint === endpoint &&
    activeRoom === roomName &&
    typeof window.updateOnlineCount === "function"
  ) {
    window.updateOnlineCount(count);
  }
});

// Handle new messages
socket.on(
  "newMessage",
  ({ endpoint, roomName, username, message, DateTime, sender }) => {
    // Always add the message to the room's history (for proper unread count tracking)
    // The addMessage function will handle rendering and unread counts
    if (typeof window.addMessage === "function") {
      // Determine if message is from current user
      let messageType = "received";

      // Try to get userId from localStorage (set by script.js)
      try {
        const savedUser = localStorage.getItem("chatUser");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          const currentUserId = userData.userId;

          // Compare by userId if available (more reliable than username)
          if (sender && currentUserId) {
            // Handle different sender._id formats (ObjectId, string, or direct value)
            let senderId = null;
            if (sender._id) {
              // If _id is an object with toString, use that
              senderId =
                typeof sender._id === "object" && sender._id.toString
                  ? sender._id.toString()
                  : String(sender._id);
            } else if (typeof sender === "string") {
              senderId = sender;
            } else if (sender.id) {
              senderId = String(sender.id);
            }

            const currentId = String(currentUserId);

            if (senderId && currentId && senderId === currentId) {
              messageType = "sent";
            } else {
              messageType = "received";
            }
          } else {
            // Default to received if we can't determine
            messageType = "received";
          }
        }
      } catch (e) {
        console.error("Error checking message sender:", e);
        // Fallback to username comparison if userId not available
        const currentUsername =
          document.getElementById("user-name")?.textContent || "";
        if (username === currentUsername) {
          messageType = "sent";
        }
      }

      // Pass namespace and roomName so addMessage can track unread counts correctly
      // Normalize roomName to lowercase for consistency
      const normalizedRoomName = roomName ? roomName.toLowerCase() : roomName;

      window.addMessage(
        username,
        message,
        messageType,
        endpoint,
        normalizedRoomName
      );
    }
  }
);

// Handle message errors
socket.on("messageError", ({ error }) => {
  // Optionally show error to user
  alert(`Failed to send message: ${error}`);
});

// Handle file upload errors
socket.on("fileUploadError", ({ error }) => {
  alert(`Failed to upload file: ${error}`);
});

socket.on("connect", () => {
  const chatStatus = document.getElementById("chat-status");
  if (chatStatus) {
    chatStatus.textContent = "Ready";
  }
  // Request namespaces if chat is initialized and we don't have them yet
  // The server emits namespacesList automatically on connect, but if chat
  // was initialized before connection, we may need to request them again
  if (
    document.getElementById("namespace-dropdown") &&
    !window.namespacesData &&
    typeof window.requestNamespaces === "function"
  ) {
    // Small delay to let the automatic emission happen first
    setTimeout(() => {
      if (!window.namespacesData) {
        window.requestNamespaces();
      }
    }, 100);
  }
});

// Function to request namespaces from server (if needed)
window.requestNamespaces = function () {
  if (socket.connected) {
    socket.emit("requestNamespaces");
  }
};
