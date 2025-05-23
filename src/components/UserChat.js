import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const UserChat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      user: user || "unknown",
      timestamp: serverTimestamp()
    });

    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <h2>แชทกับแอดมิน</h2>
      <div className="chat-box">
        {messages.map((msg) => (
          <p key={msg.id} className={msg.user === "admin" ? "admin-msg" : "user-msg"}>
            <strong>{msg.user === "admin" ? "แอดมิน" : "คุณ"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="พิมพ์ข้อความ..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>ส่ง</button>
    </div>
  );
};

export default UserChat;
