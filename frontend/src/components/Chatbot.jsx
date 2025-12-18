import React, { useState } from "react";
import axios from "axios";
import "../style/Chatbot.css";

export default function Chatbot({ context }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Chào bạn! Mình là trợ lý WeHome 😊 Bạn muốn tìm sản phẩm gì hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
        history: newMsgs,
        context: context || {},
      });

      // 🟦 Thêm câu trả lời GPT
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);

      // 🟩 Nếu backend trả về danh sách sản phẩm → hiển thị thêm
      if (res.data.products && res.data.products.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "products",
            products: res.data.products,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Xin lỗi bạn, mình đang lỗi nhẹ. Bạn thử lại giúp mình nhé 🥲",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Nút bật chatbot
  if (!open)
    return (
      <button className="chatbot-toggle" onClick={() => setOpen(true)}>
        💬 Hỏi WeHome
      </button>
    );

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span>Trợ lý WeHome</span>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="chatbot-body">
        {messages.map((m, i) => {
          // ================================================
          // 🔥 Nếu là danh sách sản phẩm → render card
          // ================================================
          if (m.type === "products") {
            return (
              <div key={i} className="product-list">
                {m.products.map((p) => (
                  <a href={p.slug} className="product-card" key={p.id}>
                    <img src={p.image} alt={p.name} />
                    <div className="info">
                      <div className="name">{p.name}</div>
                      <div className="price">
                        {p.price.toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            );
          }

          // ================================================
          // 🔥 Nếu là tin nhắn bình thường
          // ================================================
          return (
            <div
              key={i}
              className={`chatbot-msg ${
                m.role === "user" ? "user" : "assistant"
              }`}
            >
              {m.content}
            </div>
          );
        })}

        {loading && (
          <div className="chatbot-msg assistant">Đang soạn trả lời...</div>
        )}
      </div>

      <div className="chatbot-input">
        <textarea
          value={input}
          rows={2}
          placeholder="Nhập câu hỏi của bạn..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
}
