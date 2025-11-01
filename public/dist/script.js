// Room switching functionality - Namespace dropdown + Room sidebar
document.addEventListener("DOMContentLoaded", () => {
  const namespaceButton = document.getElementById("namespace-button");
  const namespaceDropdown = document.getElementById("namespace-dropdown");
  const currentNamespaceSpan = document.getElementById("current-namespace");
  const roomsList = document.getElementById("rooms-list");
  const chatRoomTitle = document.getElementById("chat-room-title");
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");

  let currentNamespace = null;
  let currentRoom = null;
  let currentOnlineCount = 0;

  // Store messages per namespace-room combination (dynamic)
  const roomMessages = {};

  // Store unread message counts per namespace-room combination
  const unreadCounts = {};

  // User info
  let username = null;
  let userId = null;
  let accessToken = null;
  let mobile = null;
  const API_BASE_URL = "http://localhost:5000";

  // Helper functions for file messages
  function formatFileSize(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  function getFileIcon(fileType) {
    if (!fileType) return "📄";
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.startsWith("video/")) return "🎥";
    if (fileType.startsWith("audio/")) return "🎵";
    if (fileType.includes("pdf")) return "📕";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "📊";
    if (fileType.includes("zip") || fileType.includes("rar")) return "📦";
    return "📄";
  }

  // Cookie helper functions
  function setCookie(name, value, days = 30) {
    if (!value) {
      deleteCookie(name);
      return;
    }
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    // Encode value to handle special characters in JWT tokens
    const encodedValue = encodeURIComponent(value);
    // Set cookie with path=/ to make it accessible site-wide
    document.cookie = `${name}=${encodedValue};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = c.substring(nameEQ.length, c.length);
        const decodedValue = decodeURIComponent(value);
        return decodedValue;
      }
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Check if user is already logged in (check cookie first, then localStorage as fallback)
  async function checkAuth() {
    // Wait a bit to ensure DOM is ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    const tokenCookie = getCookie("accessToken");

    if (tokenCookie) {
      accessToken = tokenCookie;
      // Fetch user profile using token from cookie
      try {
        const profileResponse = await fetch(
          `${API_BASE_URL}/admin/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const profileData = await profileResponse.json();

        if (profileResponse.ok && profileData.statusCode === 200) {
          const user = profileData.data.user;
          userId = user._id;
          username = user.username || user.first_name || user.mobile || "User";
          mobile = user.mobile;
          // Expose to window for location sharing
          window.chatUsername = username;
          window.chatUserId = userId;

          // Update localStorage with user info (without token, token stays in cookie)
          localStorage.setItem(
            "chatUser",
            JSON.stringify({
              username,
              userId,
              mobile,
            })
          );

          // Hide login modal and show chat
          hideLoginModal();
          initializeChat();
          return;
        } else {
          // Token invalid or expired, clear cookie and localStorage
          deleteCookie("accessToken");
          localStorage.removeItem("chatUser");
        }
      } catch (error) {
        // Token invalid, clear cookie and localStorage
        deleteCookie("accessToken");
        localStorage.removeItem("chatUser");
      }
    }

    // Fallback to localStorage (for backward compatibility)
    const savedUser = localStorage.getItem("chatUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        username = userData.username;
        userId = userData.userId;
        // Expose to window for location sharing
        window.chatUsername = username;
        window.chatUserId = userId;
        accessToken = userData.accessToken;
        mobile = userData.mobile;

        if (accessToken) {
          // Save token to cookie
          setCookie("accessToken", accessToken);
          // Hide login modal and show chat
          hideLoginModal();
          initializeChat();
          return;
        }
      } catch (e) {
        localStorage.removeItem("chatUser");
      }
    }

    // No valid auth found, show login
    showLoginModal();
  }

  // Check authentication on page load (must be async)
  (async () => {
    await checkAuth();
  })();

  // Login modal functions
  function showLoginModal() {
    const loginModal = document.getElementById("login-modal");
    const chatContainer = document.getElementById("chat-container");
    if (loginModal) loginModal.style.display = "flex";
    if (chatContainer) chatContainer.style.display = "none";
    // Reset forms
    document.getElementById("login-form").style.display = "block";
    document.getElementById("otp-form").style.display = "none";
    document.getElementById("login-mobile").value = "";
    document.getElementById("login-otp").value = "";
    hideErrors();
  }

  function hideLoginModal() {
    const loginModal = document.getElementById("login-modal");
    const chatContainer = document.getElementById("chat-container");
    if (loginModal) loginModal.style.display = "none";
    if (chatContainer) chatContainer.style.display = "flex";
  }

  function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    }
  }

  function hideErrors() {
    document.getElementById("login-error").style.display = "none";
    document.getElementById("otp-error").style.display = "none";
  }

  // Handle mobile form (Send OTP)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideErrors();
      const mobileInput = document.getElementById("login-mobile");
      const mobileValue = mobileInput.value.trim();

      if (!mobileValue) {
        showError("login-error", "Please enter your mobile number");
        return;
      }

      const sendOtpBtn = document.getElementById("send-otp-btn");
      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = "Sending...";

      try {
        const response = await fetch(`${API_BASE_URL}/user/get-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile: mobileValue }),
        });

        const data = await response.json();

        if (response.ok && data.statusCode === 200) {
          mobile = mobileValue;
          // Show OTP form
          document.getElementById("login-form").style.display = "none";
          document.getElementById("otp-form").style.display = "block";
          // Show OTP code in dev mode
          if (data.data && data.data.code) {
            document.getElementById(
              "otp-hint"
            ).textContent = `Dev Mode - OTP: ${data.data.code}`;
            document.getElementById("otp-hint").style.display = "block";
          }
        } else {
          showError("login-error", data.message || "Failed to send OTP");
        }
      } catch (error) {
        showError("login-error", "Network error. Please try again.");
      } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = "Send OTP";
      }
    });
  }

  // Handle OTP form (Verify OTP)
  const otpForm = document.getElementById("otp-form");
  if (otpForm) {
    otpForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideErrors();
      const otpInput = document.getElementById("login-otp");
      const otpValue = otpInput.value.trim();

      if (!otpValue || !mobile) {
        showError("otp-error", "Please enter OTP code");
        return;
      }

      const verifyOtpBtn = document.getElementById("verify-otp-btn");
      verifyOtpBtn.disabled = true;
      verifyOtpBtn.textContent = "Verifying...";

      try {
        const response = await fetch(`${API_BASE_URL}/user/check-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, code: otpValue }),
        });

        const data = await response.json();

        if (response.ok && data.statusCode === 200) {
          accessToken = data.data.accessToken;

          // Fetch user profile to get user info
          const profileResponse = await fetch(
            `${API_BASE_URL}/admin/users/profile`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const profileData = await profileResponse.json();

          if (profileResponse.ok && profileData.statusCode === 200) {
            const user = profileData.data.user;
            userId = user._id;
            username =
              user.username || user.first_name || user.mobile || "User";
            // Expose to window for location sharing
            window.chatUsername = username;
            window.chatUserId = userId;

            // Save accessToken to cookie (persists across refreshes)
            setCookie("accessToken", accessToken, 30); // 30 days expiry

            // Save user info to localStorage (without token, token is in cookie)
            localStorage.setItem(
              "chatUser",
              JSON.stringify({
                username,
                userId,
                mobile,
              })
            );

            // Hide modal and initialize chat
            hideLoginModal();
            initializeChat();
          } else {
            showError("otp-error", "Failed to get user profile");
          }
        } else {
          showError("otp-error", data.message || "Invalid OTP code");
        }
      } catch (error) {
        showError("otp-error", "Network error. Please try again.");
      } finally {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = "Verify OTP";
      }
    });
  }

  // Back button
  const backToMobileBtn = document.getElementById("back-to-mobile");
  if (backToMobileBtn) {
    backToMobileBtn.addEventListener("click", () => {
      document.getElementById("login-form").style.display = "block";
      document.getElementById("otp-form").style.display = "none";
      document.getElementById("login-otp").value = "";
      hideErrors();
    });
  }

  // Initialize chat after login
  function initializeChat() {
    // Update profile name
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && username) {
      userNameElement.textContent = username;
    }

    // Load namespaces if they were received before login
    if (
      typeof window.loadNamespaces === "function" &&
      window.pendingNamespaces
    ) {
      window.loadNamespaces(window.pendingNamespaces);
      window.pendingNamespaces = null;
    } else if (
      window.namespacesData &&
      typeof window.loadNamespaces === "function"
    ) {
      // If namespaces were already received, load them now
      window.loadNamespaces(window.namespacesData);
    } else if (window.socket && window.socket.connected) {
      // If socket is connected but namespaces not received, request them
      if (typeof window.requestNamespaces === "function") {
        window.requestNamespaces();
      }
    }

    // Toggle namespace dropdown
    const namespaceSelector = document.querySelector(".namespace-selector");
    namespaceButton.addEventListener("click", () => {
      namespaceDropdown.classList.toggle("show");
      if (namespaceSelector) {
        namespaceSelector.classList.toggle("active");
      }
    });

    // Handle namespace selection (delegated for dynamic items from socket)
    // Note: The event handler is also set up in socket.js, but we keep this as a fallback
    // The socket.js handler is the primary one that handles rooms properly

    // Switch namespace and update rooms
    function switchNamespace(
      namespaceEndpoint,
      namespaceTitle,
      namespaceRooms
    ) {
      currentNamespace = namespaceEndpoint;
      // Expose to window for location sharing
      window.currentNamespace = currentNamespace;

      // Update namespace button
      if (currentNamespaceSpan) {
        currentNamespaceSpan.textContent = namespaceTitle;
      }

      // Update active namespace
      document.querySelectorAll(".namespace-item").forEach((item) => {
        if (item.getAttribute("data-namespace") === namespaceEndpoint) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

      // Render rooms for this namespace
      const rooms = namespaceRooms || [];
      if (rooms.length > 0) {
        renderRooms(
          rooms.map((room) => ({
            name: room.name,
            description: room.description || "",
            image: room.image || "",
          }))
        );

        // Join ALL rooms in this namespace to receive real-time messages
        // This ensures users get messages even when not actively viewing that room
        if (window.socket && typeof window.socket.emit === "function") {
          rooms.forEach((room) => {
            window.socket.emit("joinRoom", {
              endpoint: namespaceEndpoint,
              roomName: room.name.toLowerCase(),
            });
          });
        }

        // Request rooms to ensure we have the latest data
        if (window.socket && typeof window.socket.emit === "function") {
          window.socket.emit("getRooms", namespaceEndpoint);
        }
        // Switch to first room
        switchRoom(namespaceEndpoint, rooms[0].name.toLowerCase());
      } else {
        renderRooms([]);
        currentRoom = null;
        window.currentRoom = null;
        messagesDiv.innerHTML = "";
        // Disable messaging when no room is available
        toggleMessaging();
        // Request rooms from server
        if (window.socket && typeof window.socket.emit === "function") {
          window.socket.emit("getRooms", namespaceEndpoint);
        }
      }
    }
    // Expose for socket script to trigger initial selection
    window.switchNamespace = switchNamespace;

    // If there's a pending first namespace, select it now that switchNamespace is available
    if (
      window.pendingFirstNamespace &&
      typeof window.switchNamespace === "function"
    ) {
      window.switchNamespace(
        window.pendingFirstNamespace.endpoint,
        window.pendingFirstNamespace.title,
        window.pendingFirstNamespace.rooms || []
      );
      window.pendingFirstNamespace = null;
    }

    // Render rooms in sidebar
    function renderRooms(rooms) {
      if (!roomsList) {
        console.error("roomsList element not found");
        return;
      }

      roomsList.innerHTML = "";

      if (!Array.isArray(rooms) || rooms.length === 0) {
        return;
      }

      rooms.forEach((room) => {
        if (!room || !room.name) {
          return;
        }

        const li = document.createElement("li");
        li.className = "room-item";
        li.setAttribute("data-room", room.name.toLowerCase());
        li.innerHTML = `
      <div class="room-image">
      <img src="${room.image || ""}" alt="${
          room.name
        }" onerror="this.style.display='none'">
      </div>
      <div class="room-content">
          <div class="room-name">${room.name}</div>
          ${
            room.description
              ? `<div class="room-description">${room.description}</div>`
              : ""
          }
        </div>
        <span class="room-badge" style="display: none; visibility: hidden;">0</span>
      `;

        li.addEventListener("click", () => {
          switchRoom(currentNamespace, room.name.toLowerCase());
        });

        roomsList.appendChild(li);
      });
    }
    // Expose for socket script to render rooms dynamically
    window.renderRooms = renderRooms;

    // Update badge count for a specific room
    function updateRoomBadge(namespace, roomName, count) {
      // Always try to update the badge if the namespace matches
      // Even if no namespace is currently selected, we should update for the correct namespace
      // Only skip if we're viewing a DIFFERENT namespace (those rooms aren't visible)
      if (currentNamespace && currentNamespace !== namespace) {
        return; // Don't update badge if it's for a different namespace (different rooms visible)
      }

      // If we're in the same namespace OR no namespace is selected, try to update the badge
      const normalizedRoomName = roomName ? roomName.toLowerCase() : roomName;

      const roomItem = document.querySelector(
        `.room-item[data-room="${normalizedRoomName}"]`
      );
      if (roomItem) {
        const badge = roomItem.querySelector(".room-badge");
        if (badge) {
          if (count > 0) {
            badge.textContent = count > 99 ? "99+" : count.toString();
            badge.style.display = "flex";
            badge.style.visibility = "visible";
            badge.style.opacity = "1";
          } else {
            badge.textContent = "0";
            badge.style.display = "none";
            badge.style.visibility = "hidden";
            badge.style.opacity = "0";
          }
        }
      }
    }

    // Switch room
    function switchRoom(namespace, room) {
      // Note: We DON'T leave previous rooms when switching
      // This allows users to receive messages from all rooms in the namespace
      // Users stay joined to all rooms so they can see unread badges

      currentNamespace = namespace;
      // Normalize room name for consistency
      const normalizedRoom = room ? room.toLowerCase() : room;
      currentRoom = normalizedRoom;
      // Expose to window for location sharing
      window.currentNamespace = currentNamespace;
      window.currentRoom = currentRoom;

      // Clear unread count for the room being switched to
      if (!unreadCounts[namespace]) {
        unreadCounts[namespace] = {};
      }
      unreadCounts[namespace][normalizedRoom] = 0;
      updateRoomBadge(namespace, normalizedRoom, 0);

      // Update title (use original room name for display)
      if (chatRoomTitle) {
        chatRoomTitle.textContent =
          room.charAt(0).toUpperCase() + room.slice(1);
      }

      // Update active state in rooms list (use normalized room name)
      document.querySelectorAll(".rooms-list .room-item").forEach((item) => {
        const itemRoom = item.getAttribute("data-room");
        if (itemRoom === normalizedRoom) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });

      // Join the new room
      if (window.socket && typeof window.socket.emit === "function") {
        window.socket.emit("joinRoom", {
          endpoint: namespace,
          roomName: normalizedRoom,
        });

        // ALWAYS request room details from server when switching to a room
        // This ensures we get all messages from the database, including ones sent while we weren't in the room
        window.socket.emit("getRoomDetails", {
          endpoint: namespace,
          roomName: normalizedRoom,
        });

        // Clear messages div while loading - renderMessages will be called after room details load
        if (messagesDiv) {
          messagesDiv.innerHTML = "";
        }
      }

      // Enable messaging now that a room is selected
      toggleMessaging();
    }

    // Display room details in chat header
    function displayRoomDetails(roomDetails) {
      if (!roomDetails) return;

      const chatRoomTitle = document.getElementById("chat-room-title");
      const chatHeader = document.querySelector(".chat-header");

      if (chatRoomTitle) {
        chatRoomTitle.innerHTML = `
        <div class="room-header-content">
          <div class="room-header-image">
            <img src="${roomDetails.image}" alt="${roomDetails.name}">
          </div>
          <div class="room-header-info">
            <div class="room-header-name">${roomDetails.name}</div>
            ${
              roomDetails.description
                ? `<div class="room-header-description">${roomDetails.description}</div>`
                : ""
            }
          </div>
          <div class="room-header-online">
            <span class="online-indicator"></span>
            <span class="online-count">${currentOnlineCount} online</span>
          </div>
        </div>
      `;
      }

      // Load messages if available
      if (roomDetails.messages && roomDetails.messages.length > 0) {
        // Store messages in roomMessages (replace, but preserve existing if possible)
        if (!roomMessages[currentNamespace]) {
          roomMessages[currentNamespace] = {};
        }

        // Check if we already have messages for this room (use normalized room name)
        const normalizedCurrentRoom = currentRoom
          ? currentRoom.toLowerCase()
          : currentRoom;
        const existingMessages =
          roomMessages[currentNamespace][normalizedCurrentRoom] || [];
        const existingMessageMap = new Map();
        // Create a map of existing messages by content and datetime for quick lookup
        existingMessages.forEach((msg, index) => {
          const key = `${msg.message}_${msg.username}`;
          existingMessageMap.set(key, msg);
        });

        // Process new messages from database
        const processedMessages = roomDetails.messages
          .filter((msg) => msg && msg.message) // Filter out invalid messages
          .map((msg) => {
            let displayName = "Unknown";
            let messageType = "received";

            // Check if message is from current user by comparing sender._id with userId
            if (msg.sender && msg.sender._id) {
              // Convert both to strings for comparison (in case one is ObjectId and other is string)
              const senderId = msg.sender._id.toString();
              const currentUserId = userId ? userId.toString() : null;

              // Determine if this is a sent message
              if (currentUserId && senderId === currentUserId) {
                messageType = "sent";
                displayName = username || "You";
              } else {
                // Received message from another user
                // Try username first
                if (msg.sender.username) {
                  displayName = msg.sender.username;
                }
                // Then try first_name and last_name
                else if (msg.sender.first_name || msg.sender.last_name) {
                  displayName = `${msg.sender.first_name || ""} ${
                    msg.sender.last_name || ""
                  }`.trim();
                }
                // Fallback to mobile number if available
                else if (msg.sender.mobile) {
                  displayName = msg.sender.mobile;
                }
                // Last resort: try to preserve from existing messages
                else {
                  // Try to match by message content and sender ID
                  for (const [
                    mapKey,
                    existingMsg,
                  ] of existingMessageMap.entries()) {
                    if (
                      existingMsg.message === msg.message &&
                      existingMsg.username !== "Unknown"
                    ) {
                      displayName = existingMsg.username;
                      break;
                    }
                  }
                }
              }
            } else if (msg.sender && typeof msg.sender === "string") {
              // Handle case where sender is just an ID string
              const senderId = msg.sender.toString();
              const currentUserId = userId ? userId.toString() : null;
              if (currentUserId && senderId === currentUserId) {
                messageType = "sent";
                displayName = username || "You";
              } else {
                // Try to preserve sender info from existing messages
                for (const [
                  mapKey,
                  existingMsg,
                ] of existingMessageMap.entries()) {
                  if (
                    existingMsg.message === msg.message &&
                    existingMsg.username !== "Unknown"
                  ) {
                    displayName = existingMsg.username;
                    break;
                  }
                }
              }
            } else if (msg.sender) {
              // Sender exists but no _id - might be malformed, try to use what we have
              if (msg.sender.username) {
                displayName = msg.sender.username;
              } else if (msg.sender.mobile) {
                displayName = msg.sender.mobile;
              } else {
                // Try to preserve from existing messages
                for (const [
                  mapKey,
                  existingMsg,
                ] of existingMessageMap.entries()) {
                  if (
                    existingMsg.message === msg.message &&
                    existingMsg.username !== "Unknown"
                  ) {
                    displayName = existingMsg.username;
                    if (existingMsg.type === "sent") {
                      messageType = "sent";
                    }
                    break;
                  }
                }
              }
            } else {
              // No sender data - try to preserve from existing messages
              for (const [
                mapKey,
                existingMsg,
              ] of existingMessageMap.entries()) {
                if (
                  existingMsg.message === msg.message &&
                  existingMsg.username !== "Unknown"
                ) {
                  displayName = existingMsg.username;
                  // Also preserve type if it was "sent"
                  if (existingMsg.type === "sent") {
                    messageType = "sent";
                  }
                  break;
                }
              }
            }

            return {
              username: displayName,
              message: msg.message || "",
              type: messageType,
            };
          })
          .filter((msg) => msg.message); // Filter out messages with empty content

        // Replace with processed messages (use normalized room name)
        roomMessages[currentNamespace][normalizedCurrentRoom] =
          processedMessages;
        renderMessages();
        // Clear unread count when loading room details (user is viewing the room)
        // We always clear because displayRoomDetails is only called when viewing a room
        if (currentNamespace && normalizedCurrentRoom) {
          if (!unreadCounts[currentNamespace]) {
            unreadCounts[currentNamespace] = {};
          }
          unreadCounts[currentNamespace][normalizedCurrentRoom] = 0;
          updateRoomBadge(currentNamespace, normalizedCurrentRoom, 0);
        }
      } else {
        // If no messages, initialize empty array and render
        if (!roomMessages[currentNamespace]) {
          roomMessages[currentNamespace] = {};
        }
        const normalizedCurrentRoom = currentRoom
          ? currentRoom.toLowerCase()
          : currentRoom;
        roomMessages[currentNamespace][normalizedCurrentRoom] = [];
        renderMessages();
      }
    }
    // Update online count display
    function updateOnlineCount(count) {
      currentOnlineCount = count;
      const onlineCountElement = document.querySelector(".online-count");
      if (onlineCountElement) {
        onlineCountElement.textContent = `${count} online`;
      } else {
        // If element doesn't exist, update the room header
        const chatRoomTitle = document.getElementById("chat-room-title");
        if (
          chatRoomTitle &&
          chatRoomTitle.querySelector(".room-header-content")
        ) {
          const existingContent = chatRoomTitle.innerHTML;
          // Update the count in the existing HTML
          chatRoomTitle.innerHTML = existingContent.replace(
            /<span class="online-count">.*?<\/span>/,
            `<span class="online-count">${count} online</span>`
          );
        }
      }
    }
    // Expose for socket script to display room details
    window.displayRoomDetails = displayRoomDetails;
    // Expose for updating online count
    window.updateOnlineCount = updateOnlineCount;
    // Expose for socket script to switch room after initial rooms load
    window.switchRoom = switchRoom;
    // Expose addMessage for socket script to add incoming messages
    window.addMessage = addMessage;
    // Expose updateRoomBadge for external use if needed
    window.updateRoomBadge = updateRoomBadge;

    // Render messages for current room
    function renderMessages() {
      if (!messagesDiv) return;

      messagesDiv.innerHTML = "";
      // Use normalized room name (currentRoom is already normalized)
      const normalizedRoom = currentRoom
        ? currentRoom.toLowerCase()
        : currentRoom;
      const messages = roomMessages[currentNamespace]?.[normalizedRoom] || [];
      messages.forEach(({ username, message, type }) => {
        // Only render, don't add to array (already in roomMessages)
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;

        // Check if message is a location message
        const trimmedMessage = message.trim();
        if (trimmedMessage.startsWith("LOCATION:")) {
          // Extract coordinates
          const coords = trimmedMessage.replace("LOCATION:", "").split(",");
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);

          if (!isNaN(lat) && !isNaN(lng)) {
            // Create Google Maps embed URL (no API key needed for embed)
            const mapsEmbedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=15`;
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

            messageDiv.innerHTML = `
              <div class="location-message">
                <strong>${username}:</strong> 📍 My Location
                <div class="location-map">
                  <iframe 
                    width="100%" 
                    height="300" 
                    style="border:0; border-radius: 8px; margin-top: 8px;" 
                    loading="lazy" 
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="${mapsEmbedUrl}">
                  </iframe>
                  <a href="${mapsUrl}" target="_blank" class="map-link" style="display: block; margin-top: 8px; color: #667eea; text-decoration: none; font-size: 14px;">
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            `;
          } else {
            // Fallback if coordinates are invalid
            messageDiv.innerHTML = `<strong>${username}:</strong> ${trimmedMessage}`;
          }
        } else if (trimmedMessage.startsWith("FILE:")) {
          // File message
          const fileMatch = trimmedMessage.match(
            /FILE:(.+?)\|FILENAME:(.+?)\|TYPE:(.+?)\|SIZE:(.+)/
          );
          if (fileMatch) {
            const [, filePath, filename, fileType, fileSize] = fileMatch;
            const isImage = fileType.startsWith("image/");
            const formattedSize = formatFileSize(fileSize);

            messageDiv.innerHTML = `
              <div class="file-message">
                <strong>${username}:</strong> 📎 ${filename}
                <div class="file-preview" style="margin-top: 8px; max-width: 400px;">
                  ${
                    isImage
                      ? `<img src="/${filePath}" alt="${filename}" style="max-width: 100%; border-radius: 8px; cursor: pointer;" onclick="window.open('/${filePath}', '_blank')">`
                      : ""
                  }
                  <div style="margin-top: 8px; padding: 8px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">${getFileIcon(
                      fileType
                    )}</span>
                    <span>${filename}</span>
                    <span style="margin-left: auto; color: #666;">${formattedSize}</span>
                  </div>
                  <a href="/${filePath}" download="${filename}" style="display: inline-block; margin-top: 8px; color: #667eea; text-decoration: none; font-size: 14px;">
                    Download File →
                  </a>
                </div>
              </div>
            `;
          } else {
            messageDiv.innerHTML = `<strong>${username}:</strong> ${trimmedMessage}`;
          }
        } else {
          // Regular message
          messageDiv.innerHTML = `<strong>${username}:</strong> ${trimmedMessage}`;
        }

        messagesDiv.appendChild(messageDiv);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Add message to current room's data and render
    function addMessage(username, message, type, roomNamespace, roomName) {
      // Validate message before adding
      if (
        !message ||
        message === undefined ||
        message === null ||
        message.trim() === ""
      ) {
        return; // Don't add invalid messages
      }

      if (!username) {
        username = "Unknown";
      }

      // Use provided room info or current room
      const targetNamespace = roomNamespace || currentNamespace;
      const targetRoom = roomName || currentRoom;

      // Normalize room names for consistency (always use lowercase)
      const normalizedTargetRoom = targetRoom ? targetRoom.toLowerCase() : null;
      const normalizedCurrentRoom = currentRoom
        ? currentRoom.toLowerCase()
        : null;

      // Add to room's message history (use normalized room name for consistency)
      if (!roomMessages[targetNamespace]) {
        roomMessages[targetNamespace] = {};
      }
      if (!roomMessages[targetNamespace][normalizedTargetRoom]) {
        roomMessages[targetNamespace][normalizedTargetRoom] = [];
      }
      roomMessages[targetNamespace][normalizedTargetRoom].push({
        username,
        message: message.trim(),
        type,
      });

      // Check if this message is for the currently active room
      // Be careful with comparison - handle null/undefined cases
      const isCurrentRoom =
        targetNamespace &&
        currentNamespace &&
        targetNamespace === currentNamespace &&
        normalizedTargetRoom &&
        normalizedCurrentRoom &&
        normalizedTargetRoom === normalizedCurrentRoom;

      if (isCurrentRoom) {
        // This is the current room - render the message immediately
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;

        // Check if message is a location message
        const trimmedMessage = message.trim();
        if (trimmedMessage.startsWith("LOCATION:")) {
          // Extract coordinates
          const coords = trimmedMessage.replace("LOCATION:", "").split(",");
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);

          if (!isNaN(lat) && !isNaN(lng)) {
            // Create Google Maps embed URL (no API key needed for embed)
            const mapsEmbedUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=15`;
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

            messageDiv.innerHTML = `
              <div class="location-message">
                <strong>${username}:</strong> 📍 My Location
                <div class="location-map">
                  <iframe 
                    width="100%" 
                    height="300" 
                    style="border:0; border-radius: 8px; margin-top: 8px;" 
                    loading="lazy" 
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="${mapsEmbedUrl}">
                  </iframe>
                  <a href="${mapsUrl}" target="_blank" class="map-link" style="display: block; margin-top: 8px; color: #667eea; text-decoration: none; font-size: 14px;">
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            `;
          } else {
            // Fallback if coordinates are invalid
            messageDiv.innerHTML = `<strong>${username}:</strong> ${trimmedMessage}`;
          }
        } else if (trimmedMessage.startsWith("FILE:")) {
          // File message
          const fileMatch = trimmedMessage.match(
            /FILE:(.+?)\|FILENAME:(.+?)\|TYPE:(.+?)\|SIZE:(.+)/
          );
          if (fileMatch) {
            const [, filePath, filename, fileType, fileSize] = fileMatch;
            const isImage = fileType.startsWith("image/");
            const formattedSize = formatFileSize(fileSize);

            messageDiv.innerHTML = `
              <div class="file-message">
                <strong>${username}:</strong> 📎 ${filename}
                <div class="file-preview" style="margin-top: 8px; max-width: 400px;">
                  ${
                    isImage
                      ? `<img src="/${filePath}" alt="${filename}" style="max-width: 100%; border-radius: 8px; cursor: pointer;" onclick="window.open('/${filePath}', '_blank')">`
                      : ""
                  }
                  <div style="margin-top: 8px; padding: 8px; background: rgba(102, 126, 234, 0.1); border-radius: 8px; font-size: 12px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">${getFileIcon(
                      fileType
                    )}</span>
                    <span>${filename}</span>
                    <span style="margin-left: auto; color: #666;">${formattedSize}</span>
                  </div>
                  <a href="/${filePath}" download="${filename}" style="display: inline-block; margin-top: 8px; color: #667eea; text-decoration: none; font-size: 14px;">
                    Download File →
                  </a>
                </div>
              </div>
            `;
          } else {
            messageDiv.innerHTML = `<strong>${username}:</strong> ${trimmedMessage}`;
          }
        } else {
          // Regular message
          messageDiv.innerHTML = `<strong>${username}:</strong> ${trimmedMessage}`;
        }

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Don't increment unread count for current room
      } else if (targetNamespace && normalizedTargetRoom) {
        // Message is for a different room (or no room selected) - increment unread count
        if (!unreadCounts[targetNamespace]) {
          unreadCounts[targetNamespace] = {};
        }
        if (
          unreadCounts[targetNamespace][normalizedTargetRoom] === undefined ||
          unreadCounts[targetNamespace][normalizedTargetRoom] === null
        ) {
          unreadCounts[targetNamespace][normalizedTargetRoom] = 0;
        }
        // Only increment if it's a received message (not your own sent message)
        if (type === "received") {
          unreadCounts[targetNamespace][normalizedTargetRoom]++;
          const newCount = unreadCounts[targetNamespace][normalizedTargetRoom];
          updateRoomBadge(targetNamespace, normalizedTargetRoom, newCount);
        }
      }
    }

    // Toggle messaging (enable/disable input and send button based on room selection)
    function toggleMessaging() {
      const isEnabled = currentRoom !== null && currentNamespace !== null;

      if (messageInput) {
        messageInput.disabled = !isEnabled;
        messageInput.placeholder = isEnabled
          ? "Type a message..."
          : "Select a room to start messaging...";
      }

      if (sendButton) {
        sendButton.disabled = !isEnabled;
      }

      const locationButton = document.getElementById("sendLocationButton");
      if (locationButton) {
        locationButton.disabled = !isEnabled;
      }

      const fileButton = document.getElementById("sendFileButton");
      if (fileButton) {
        fileButton.disabled = !isEnabled;
      }
    }

    // Initialization is driven by socket: first namespace will be selected there

    // Send message
    function sendMessage() {
      const message = messageInput.value.trim();
      if (!message || !currentNamespace || !currentRoom) {
        return;
      }

      // Send message via socket
      if (window.socket && typeof window.socket.emit === "function") {
        window.socket.emit("sendMessage", {
          endpoint: currentNamespace,
          roomName: currentRoom,
          message: message,
          username: username,
          userId: userId,
        });

        // Clear input immediately for better UX
        messageInput.value = "";

        // Optionally show optimistic update (message will be confirmed when received from server)
        // addMessage(username, message, "sent");
      }
    }

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    // Initially disable messaging until a room is selected
    toggleMessaging();

    // Setup location button event listener
    if (typeof window.setupLocationButton === "function") {
      window.setupLocationButton();
    }

    // Setup file upload button event listener
    if (typeof window.initializeFileUpload === "function") {
      window.initializeFileUpload();
    }
  } // End of initializeChat function
});
