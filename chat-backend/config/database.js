const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://Na_1122:Na112211Ok@cluster0.9ylcsxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // เปลี่ยนเป็น URI ของคุณถ้าใช้ MongoDB Atlas

mongoose.set('strictQuery', false);

// เชื่อมต่อกับ MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Database connection error:", err));

module.exports = mongoose;
