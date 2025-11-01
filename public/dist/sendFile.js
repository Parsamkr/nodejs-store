// File upload functionality for chat
function initializeFileUpload() {
  // Create file input if it doesn't exist
  let fileInput = document.getElementById("chat-file-input");
  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "chat-file-input";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
  }

  // Find or create file upload button
  const inputContainer = document.querySelector(".input-container");
  if (!inputContainer) return;

  let fileButton = document.getElementById("sendFileButton");
  if (!fileButton) {
    fileButton = document.createElement("button");
    fileButton.id = "sendFileButton";
    fileButton.className = "file-button";
    fileButton.title = "Send File";
    fileButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // Insert before sendButton
    const sendButton = inputContainer.querySelector("#sendButton");
    inputContainer.insertBefore(fileButton, sendButton);
  }

  // Handle file selection
  fileButton.addEventListener("click", () => {
    // Check if user is in a room
    if (!window.currentNamespace || !window.currentRoom) {
      alert("Please select a room to send files");
      return;
    }
    fileInput.click();
  });

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      fileInput.value = "";
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target.result;
      const base64Data = fileData.split(",")[1]; // Remove data:mime;base64, prefix

      // Send file to server via socket
      if (window.socket && window.socket.emit) {
        window.socket.emit("uploadFile", {
          endpoint: window.currentNamespace,
          roomName: window.currentRoom,
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileData: base64Data,
          username: window.chatUsername,
          userId: window.chatUserId,
        });
      }
    };
    reader.readAsDataURL(file);

    // Clear input
    fileInput.value = "";
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeFileUpload);
} else {
  initializeFileUpload();
}

// Expose initializeFileUpload globally so it can be called from script.js
window.initializeFileUpload = initializeFileUpload;
