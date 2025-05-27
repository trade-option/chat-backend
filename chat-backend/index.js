const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const db = require("./config/database"); // เชื่อมต่อฐานข้อมูล
const apiRoutes = require("./routes/api"); // นำเข้า API Routes
const ChatMessage = require("./models/ChatMessage"); // นำเข้าโมเดลแชท

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// เสิร์ฟ static files
app.use(express.static(path.join(__dirname, "../public")));

// หน้าแชทผู้ใช้
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/chat.html"));
});

// หน้าแชทแอดมิน
app.get("/admin-chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin-chat.html"));
});

// ใช้ API
app.use("/api", apiRoutes);

// WebSocket (Socket.io)
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  // 🟢 ผู้ใช้หรือแอดมินเข้าห้อง
  socket.on("joinRoom", async (roomID) => {
    socket.join(roomID);
    console.log(`🟡 Socket ${socket.id} joined room: ${roomID}`);

    try {
      const chatHistory = await ChatMessage.find({ roomID }).sort({ timestamp: 1 });
      socket.emit("chatHistory", chatHistory);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  });

  // 🟢 รับข้อความจากผู้ใช้หรือแอดมิน
  socket.on("sendMessage", async (data) => {
    const { roomID, username, message } = data;
    if (!roomID || !username || !message) return;

    try {
        const newMessage = new ChatMessage({ roomID, username, message });
        await newMessage.save();

        io.to(roomID).emit("receiveMessage", data);
        io.emit("newMessage"); // 🔥 แจ้ง `admin-dashboard.html` ว่ามีผู้ใช้ใหม่ทักหาแอดมิน
    } catch (error) {
        console.error("❌ Error saving message:", error);
    }
});

  // 🟢 รับรูปภาพ
  socket.on("sendImage", async (data) => {
    const { roomID, username, imageUrl } = data;
    if (!roomID || !username || !imageUrl) return;

    try {
      const newImage = new ChatMessage({ roomID, username, imageUrl });
      await newImage.save();

      io.to(roomID).emit("receiveImage", data);
    } catch (error) {
      console.error("❌ Error saving image:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin-dashboard.html"));
});

// เริ่มเซิร์ฟเวอร์
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

