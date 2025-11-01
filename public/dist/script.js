// Room switching functionality - Namespace dropdown + Room sidebar
document.addEventListener("DOMContentLoaded", () => {
  const namespaceButton = document.getElementById("namespace-button");
  const namespaceDropdown = document.getElementById("namespace-dropdown");
  const namespaceItems = document.querySelectorAll(".namespace-item");
  const currentNamespaceSpan = document.getElementById("current-namespace");
  const roomsList = document.getElementById("rooms-list");
  const chatRoomTitle = document.getElementById("chat-room-title");
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");

  let currentNamespace = "general";
  let currentRoom = "main";

  // Define rooms for each namespace
  const namespaces = {
    general: {
      icon: "🔵",
      name: "General",
      rooms: [
        { name: "Main", icon: "💬" },
        { name: "Announcements", icon: "📢" },
      ],
    },
    support: {
      icon: "🟢",
      name: "Support",
      rooms: [
        { name: "General", icon: "💬" },
        { name: "Bugs", icon: "🐛" },
      ],
    },
    tech: {
      icon: "💻",
      name: "Tech",
      rooms: [
        { name: "Discussions", icon: "💬" },
        { name: "Showcase", icon: "✨" },
      ],
    },
    random: {
      icon: "🎲",
      name: "Random",
      rooms: [
        { name: "Chill", icon: "😎" },
        { name: "Memes", icon: "😂" },
      ],
    },
  };

  // Store messages per namespace-room combination
  const roomMessages = {
    general: { main: [], announcements: [] },
    support: { general: [], bugs: [] },
    tech: { discussions: [], showcase: [] },
    random: { chill: [], memes: [] },
  };

  // Prompt for username
  const username = "Parsa";
  // prompt("Enter your username:") || `User${Math.floor(Math.random() * 1000)}`;

  // Update profile name
  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    userNameElement.textContent = username;
  }

  // Toggle namespace dropdown
  const namespaceSelector = document.querySelector(".namespace-selector");
  namespaceButton.addEventListener("click", () => {
    namespaceDropdown.classList.toggle("show");
    if (namespaceSelector) {
      namespaceSelector.classList.toggle("active");
    }
  });

  // Handle namespace selection
  namespaceItems.forEach((item) => {
    item.addEventListener("click", () => {
      const namespace = item.getAttribute("data-namespace");
      switchNamespace(namespace);
      namespaceDropdown.classList.remove("show");
      if (namespaceSelector) {
        namespaceSelector.classList.remove("active");
      }
    });
  });

  // Switch namespace and update rooms
  function switchNamespace(namespace) {
    currentNamespace = namespace;
    const namespaceData = namespaces[namespace];

    // Update namespace button
    if (currentNamespaceSpan) {
      currentNamespaceSpan.textContent = `${namespaceData.icon} ${namespaceData.name}`;
    }

    // Update active namespace
    namespaceItems.forEach((item) => {
      if (item.getAttribute("data-namespace") === namespace) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Render rooms for this namespace
    renderRooms(namespaceData.rooms);

    // Switch to first room of new namespace
    if (namespaceData.rooms.length > 0) {
      const roomName = namespaceData.rooms[0].name.toLowerCase();
      switchRoom(namespace, roomName);
    }
  }

  // Render rooms in sidebar
  function renderRooms(rooms) {
    roomsList.innerHTML = "";
    rooms.forEach((room) => {
      const li = document.createElement("li");
      li.className = "room-item";
      li.setAttribute("data-room", room.name.toLowerCase());
      li.innerHTML = `
        <span>${room.icon} ${room.name}</span>
        <span class="room-badge">0</span>
      `;

      li.addEventListener("click", () => {
        switchRoom(currentNamespace, room.name.toLowerCase());
      });

      roomsList.appendChild(li);
    });
  }

  // Switch room
  function switchRoom(namespace, room) {
    currentNamespace = namespace;
    currentRoom = room;

    // Update title
    if (chatRoomTitle) {
      chatRoomTitle.textContent = room.charAt(0).toUpperCase() + room.slice(1);
    }

    // Update active state in rooms list
    document.querySelectorAll(".rooms-list .room-item").forEach((item) => {
      if (item.getAttribute("data-room") === room) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Render messages for this room
    renderMessages();
  }

  // Render messages for current room
  function renderMessages() {
    if (!messagesDiv) return;

    messagesDiv.innerHTML = "";
    const messages = roomMessages[currentNamespace]?.[currentRoom] || [];
    messages.forEach(({ username, message, type }) => {
      addMessage(username, message, type);
    });
  }

  // Add message to current room's data and render
  function addMessage(username, message, type) {
    // Add to room's message history
    if (
      roomMessages[currentNamespace] &&
      roomMessages[currentNamespace][currentRoom]
    ) {
      roomMessages[currentNamespace][currentRoom].push({
        username,
        message,
        type,
      });
    }

    // Render in UI
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<strong>${username}:</strong> ${message}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Initialize with general namespace
  switchNamespace("general");

  // Send message
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(username, message, "sent");
      messageInput.value = "";
    }
  }

  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
