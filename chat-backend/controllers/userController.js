const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
