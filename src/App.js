import React from "react";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <Chat user="user1" /> {/* 🔹 เปลี่ยนค่า user เป็นไอดีของผู้ใช้ที่ล็อกอิน */}
    </div>
  );
}

export default App;
