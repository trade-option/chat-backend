const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  roomID: { type: String, required: true }, // ใช้ roomID เพื่อแยกห้องแชท
  username: { type: String, required: true },
  message: { type: String },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
