import React, { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PlusCircle } from "lucide-react";
import { FIREBASE_CONFIG } from "../config";

// 🔹 เชื่อม Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const storage = getStorage(app);

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "" && !image) return;
    let imageUrl = null;
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      user: user,
      timestamp: serverTimestamp(),
      image: imageUrl
    });
    setNewMessage("");
    setImage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-3">แชทระหว่างแอดมินกับผู้ใช้</h2>
      <div className="h-64 overflow-y-auto bg-white p-3 rounded-md">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-1 rounded-md ${msg.user === "admin" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}
          >
            <strong>{msg.user === "admin" ? "แอดมิน" : "ผู้ใช้"}</strong>: {msg.text}
            {msg.image && <img src={msg.image} alt="sent" className="mt-2 max-w-xs rounded-md" />}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder="พิมพ์ข้อความ..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-md">ส่ง</button>
        <button onClick={() => fileInputRef.current.click()} className="p-2 bg-gray-200 rounded-full">
          <PlusCircle className="w-6 h-6 text-blue-500" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Chat;
