const { ConversationModel } = require("../models/conversation");
const fs = require("fs");
const path = require("path");
class NamespaceSocketHandler {
  #io;
  constructor(io) {
    this.#io = io;
  }
  initConnection() {
    this.#io.on("connection", async (socket) => {
      // Helper function to emit namespaces
      const emitNamespaces = async () => {
        try {
          const namespaces = await ConversationModel.find(
            {},
            { title: 1, endpoint: 1, rooms: 1 }
          ).sort({ _id: -1 });
          socket.emit("namespacesList", namespaces);
        } catch (error) {
          console.error("Error fetching namespaces:", error);
          socket.emit("namespacesList", []);
        }
      };

      // Emit namespaces on connection
      await emitNamespaces();

      // Handle explicit request for namespaces
      socket.on("requestNamespaces", async () => {
        await emitNamespaces();
      });

      // Root-socket event to fetch rooms for a namespace
      socket.on("getRooms", async (endpoint) => {
        try {
          const ns = await ConversationModel.findOne(
            { endpoint },
            { rooms: 1, _id: 0 }
          );
          const rooms = ns?.rooms || [];
          socket.emit("roomsList", { endpoint, rooms });
        } catch (error) {
          console.error(
            `Error fetching rooms for namespace ${endpoint}:`,
            error
          );
          socket.emit("roomsList", { endpoint, rooms: [] });
        }
      });

      // Socket event to fetch room details
      socket.on("getRoomDetails", async ({ endpoint, roomName }) => {
        try {
          const { UserModel } = require("../models/users");

          // First, try to find the namespace and room
          const ns = await ConversationModel.findOne({ endpoint });
          if (!ns) {
            socket.emit("roomDetails", null);
            return;
          }

          const room = ns.rooms.find(
            (r) => r.name.toLowerCase() === roomName.toLowerCase()
          );
          if (!room) {
            socket.emit("roomDetails", null);
            return;
          }

          // Process messages and populate sender information
          const messages = [];
          for (const msg of room.messages || []) {
            if (!msg || !msg.message || !msg.message.trim()) continue;

            let senderData = null;

            // Try to get sender information
            if (msg.sender) {
              try {
                const sender = await UserModel.findById(msg.sender).lean();
                if (sender) {
                  senderData = {
                    _id: sender._id,
                    username: sender.username,
                    first_name: sender.first_name,
                    last_name: sender.last_name,
                    mobile: sender.mobile,
                  };
                } else {
                  // Sender not found, but preserve the ID
                  senderData = {
                    _id: msg.sender,
                  };
                }
              } catch (err) {
                // If lookup fails, preserve the sender ID
                console.error("Error looking up sender:", err);
                senderData = {
                  _id: msg.sender,
                };
              }
            }

            messages.push({
              message: msg.message,
              DateTime: msg.DateTime,
              sender: senderData,
            });
          }

          socket.emit("roomDetails", {
            name: room.name,
            description: room.description,
            image: room.image,
            messages: messages,
          });
        } catch (error) {
          console.error("❌ Error fetching room details:", error);
          socket.emit("roomDetails", null);
        }
      });

      // Track which room the socket is currently viewing (for online count updates)
      let currentSocketRoom = null;

      // Track all rooms the socket has joined (can be multiple rooms in same namespace)
      const joinedRooms = new Set();

      // Handle joining a room
      socket.on("joinRoom", ({ endpoint, roomName }) => {
        try {
          const roomId = `${endpoint}/${roomName.toLowerCase()}`;

          // Join the room (don't leave previous rooms - users can be in multiple rooms)
          // This allows users to receive messages from all rooms in the namespace
          socket.join(roomId);
          joinedRooms.add(roomId);

          // Track the currently active room (the one they're viewing)
          // But they can still be in multiple rooms for receiving messages
          currentSocketRoom = roomId;

          // Get count of sockets in this room and emit to all in the room
          const room = this.#io.sockets.adapter.rooms.get(roomId);
          const onlineCount = room ? room.size : 0;

          // Emit count to all sockets in this room
          this.#io.to(roomId).emit("roomOnlineCount", {
            endpoint,
            roomName: roomName.toLowerCase(),
            count: onlineCount,
          });
        } catch (error) {
          console.error("Error joining room:", error);
        }
      });

      // Handle leaving a room
      socket.on("leaveRoom", ({ endpoint, roomName }) => {
        try {
          const roomId = `${endpoint}/${roomName.toLowerCase()}`;
          socket.leave(roomId);
          joinedRooms.delete(roomId);

          if (currentSocketRoom === roomId) {
            currentSocketRoom = null;
          }

          // Get updated count and emit to remaining members
          const room = this.#io.sockets.adapter.rooms.get(roomId);
          const onlineCount = room ? room.size : 0;

          this.#io.to(roomId).emit("roomOnlineCount", {
            endpoint,
            roomName: roomName.toLowerCase(),
            count: onlineCount,
          });
        } catch (error) {
          console.error("Error leaving room:", error);
        }
      });

      // Handle sending messages
      socket.on(
        "sendMessage",
        async ({ endpoint, roomName, message, username, userId }) => {
          try {
            if (!message || !message.trim()) {
              return;
            }

            // Validate userId is provided (required for message sender)
            if (!userId) {
              socket.emit("messageError", {
                error: "User ID is required to send messages",
              });
              return;
            }

            const trimmedMessage = message.trim();

            // Find the namespace and room
            const ns = await ConversationModel.findOne({ endpoint });
            if (!ns) {
              socket.emit("messageError", { error: "Namespace not found" });
              return;
            }

            const room = ns.rooms.find(
              (r) => r.name.toLowerCase() === roomName.toLowerCase()
            );
            if (!room) {
              socket.emit("messageError", { error: "Room not found" });
              return;
            }

            // Create message object
            // Note: userId should be the MongoDB ObjectId of the user
            // Convert userId to ObjectId if it's provided and is a string
            let senderId = null;
            if (userId) {
              try {
                const mongoose = require("mongoose");
                // Convert to ObjectId if it's a string, otherwise use as-is (already ObjectId)
                senderId =
                  typeof userId === "string"
                    ? new mongoose.Types.ObjectId(userId)
                    : userId;
              } catch (error) {
                console.error("Invalid userId format:", userId, error);
                senderId = null;
              }
            }

            const newMessage = {
              sender: senderId,
              message: trimmedMessage,
              DateTime: new Date(),
            };

            // Add message to room in database
            await ConversationModel.updateOne(
              {
                endpoint,
                "rooms.name": { $regex: new RegExp(`^${roomName}$`, "i") },
              },
              { $push: { "rooms.$.messages": newMessage } }
            );

            // Prepare message data for broadcasting
            // Ensure sender._id is a string for consistent comparison on client
            const messageData = {
              username: username || "Unknown",
              message: trimmedMessage,
              DateTime: newMessage.DateTime,
              sender: senderId ? { _id: senderId.toString() } : null,
            };

            // Broadcast message to all users in the room
            const roomId = `${endpoint}/${roomName.toLowerCase()}`;
            this.#io.to(roomId).emit("newMessage", {
              endpoint,
              roomName: roomName.toLowerCase(),
              ...messageData,
            });
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("messageError", { error: "Failed to send message" });
          }
        }
      );

      // Handle file uploads
      socket.on(
        "uploadFile",
        async ({
          endpoint,
          roomName,
          filename,
          fileType,
          fileSize,
          fileData,
          username,
          userId,
        }) => {
          try {
            // Validate userId is provided
            if (!userId) {
              socket.emit("fileUploadError", {
                error: "User ID is required to upload files",
              });
              return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (fileSize > maxSize) {
              socket.emit("fileUploadError", {
                error: "File size must be less than 10MB",
              });
              return;
            }

            // Find the namespace and room
            const ns = await ConversationModel.findOne({ endpoint });
            if (!ns) {
              socket.emit("fileUploadError", { error: "Namespace not found" });
              return;
            }

            const room = ns.rooms.find(
              (r) => r.name.toLowerCase() === roomName.toLowerCase()
            );
            if (!room) {
              socket.emit("fileUploadError", { error: "Room not found" });
              return;
            }

            // Create upload directory structure
            const date = new Date();
            const year = date.getFullYear().toString();
            const month = date.getMonth().toString();
            const day = date.getDate().toString();
            const uploadDir = path.join(
              __dirname,
              "..",
              "..",
              "public",
              "uploads",
              "chat",
              year,
              month,
              day
            );

            // Ensure directory exists
            fs.mkdirSync(uploadDir, { recursive: true });

            // Generate unique filename
            const ext = path.extname(filename);
            const fileName = `${Date.now()}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            // Create file upload path (for database storage)
            const fileUploadPath = path.join(
              "uploads",
              "chat",
              year,
              month,
              day,
              fileName
            );

            // Decode and save file
            const buffer = Buffer.from(fileData, "base64");
            fs.writeFileSync(filePath, buffer);

            // Convert userId to ObjectId if needed
            let senderId = null;
            if (userId) {
              try {
                const mongoose = require("mongoose");
                senderId =
                  typeof userId === "string"
                    ? new mongoose.Types.ObjectId(userId)
                    : userId;
              } catch (error) {
                console.error("Invalid userId format:", userId, error);
                senderId = null;
              }
            }

            // Create file message
            const fileMessage = `FILE:${fileUploadPath}|FILENAME:${filename}|TYPE:${fileType}|SIZE:${fileSize}`;
            const newMessage = {
              sender: senderId,
              message: fileMessage,
              DateTime: new Date(),
            };

            // Add message to room in database
            await ConversationModel.updateOne(
              {
                endpoint,
                "rooms.name": { $regex: new RegExp(`^${roomName}$`, "i") },
              },
              { $push: { "rooms.$.messages": newMessage } }
            );

            // Prepare message data for broadcasting
            const messageData = {
              username: username || "Unknown",
              message: fileMessage,
              DateTime: newMessage.DateTime,
              sender: senderId ? { _id: senderId.toString() } : null,
              fileInfo: {
                filename: filename,
                fileType: fileType,
                fileSize: fileSize,
                filePath: fileUploadPath,
              },
            };

            // Broadcast message to all users in the room
            const roomId = `${endpoint}/${roomName.toLowerCase()}`;
            this.#io.to(roomId).emit("newMessage", {
              endpoint,
              roomName: roomName.toLowerCase(),
              ...messageData,
            });
          } catch (error) {
            console.error("Error uploading file:", error);
            socket.emit("fileUploadError", { error: "Failed to upload file" });
          }
        }
      );

      // Handle disconnect - leave all rooms
      socket.on("disconnect", () => {
        if (currentSocketRoom) {
          const room = this.#io.sockets.adapter.rooms.get(currentSocketRoom);
          const onlineCount = room ? room.size - 1 : 0;

          // Extract endpoint and roomName from currentSocketRoom
          const [endpoint, ...roomNameParts] = currentSocketRoom.split("/");
          const roomName = roomNameParts.join("/");

          // Emit updated count to remaining members
          this.#io.to(currentSocketRoom).emit("roomOnlineCount", {
            endpoint,
            roomName,
            count: onlineCount,
          });
        }
      });
    });
  }
}
module.exports = { NamespaceSocketHandler };
