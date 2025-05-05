const app = require("./app");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const prisma = require("./models/prismaClient");
const { createMessage } = require("./models/Message.model");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow frontend to connect
    methods: ["GET", "POST"],
  },
});

// Setup event listeners
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newMessage", async (messageData, callback) => {
    try {
      const newMessage = await createMessage(
        messageData.user_id,
        messageData.text,
        messageData.parent_id
      );

      const fullMessage = await prisma.message.findUnique({
        where: { id: newMessage.id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profile_imgs: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  profile_imgs: true,
                },
              },
            },
          },
        },
      });

      // After creating a message
      io.emit("newMessage", fullMessage);

      if (callback) {
        callback(fullMessage); // <- this lets the sender immediately see their message too
      }
    } catch (err) {
      console.error("Error saving new message", err);
    }
  });

  socket.on("likeMessage", ({ messageId, likeCount }) => {
    io.emit("likeUpdated", { messageId, likeCount });
  });

  socket.on("updateMessage", (updatedMessage) => {
    io.emit("messageUpdated", updatedMessage);
  });

  socket.on("deleteMessage", (messageId) => {
    io.emit("messageDeleted", messageId);
  });

  socket.on("addReply", (replyMessage) => {
    io.emit("replyAdded", replyMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Listen on port
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
