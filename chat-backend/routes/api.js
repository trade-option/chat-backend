const express = require("express");
const userController = require("../controllers/userController");
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

// 📌 API ทดสอบ
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// 📌 ดึงข้อมูลผู้ใช้ทั้งหมด
router.get("/users", userController.getAllUsers);

// 📌 ✅ ดึงรายชื่อห้องแชททั้งหมด (roomID)
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await ChatMessage.aggregate([
      { $match: { roomID: { $ne: null } } },     // ป้องกัน null
      { $group: { _id: "$roomID" } },
      { $sort: { _id: 1 } }
    ]);

    const roomIDs = rooms.map(r => r._id);

    res.json(roomIDs); // ส่งออกเป็น array
  } catch (error) {
    console.error("❌ Error fetching rooms:", error);
    res.status(500).json({ error: "ไม่สามารถโหลดรายชื่อห้องได้" });
  }
});

module.exports = router;
