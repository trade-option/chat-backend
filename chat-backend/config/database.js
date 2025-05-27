const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/chat-app"; // เปลี่ยนเป็น URI ของคุณถ้าใช้ MongoDB Atlas

// เชื่อมต่อกับ MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Database connection error:", err));

module.exports = mongoose;
