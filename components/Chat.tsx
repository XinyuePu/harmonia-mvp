import React, { useState, useRef, useEffect } from "react"; // ✅ 添加 useEffect
import { useRouter } from "next/router";
import styles from "./Chat.module.css"; // 确保路径正确
import translations from "../i18n"; // 语言文件路径

// ✅ 定义 Message 类型
type Message = {
  role: "user" | "bot";
  content: string;
};

const Chat: React.FC = () => {
  const router = useRouter();
  const locale: keyof typeof translations = (router.locale as keyof typeof translations) || "en";
  const t = translations[locale] ?? translations["en"];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null); // ✅ 绑定聊天框

  // ✅ 监听 messages 变化，自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ 发送消息
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev: Message[]) => [...prev, newMessage]);

    setInput(""); // 清空输入框

    try {
      const res = await fetch(`/api/chat`, {  // 直接用相对路径
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessages((prev: Message[]) => [...prev, { role: "bot", content: data.response }]);
      } else {
        setMessages((prev: Message[]) => [...prev, { role: "bot", content: "Error: " + data.response }]);
      }
    } catch (error) {
      setMessages((prev: Message[]) => [...prev, { role: "bot", content: "Error: No response from AI." }]);
    }
  };

  // ✅ 监听 Enter 发送消息
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // ✅ 语言切换
  const switchLanguage = (lang: keyof typeof translations) => {
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <div className={styles.container}>
      {/* ✅ 欢迎信息 */}
      <div className={styles.welcomeContainer}>
        <h1>✨ {t.welcome} ✨</h1>
        <p>{t.description}</p >
      </div>

      {/* ✅ 语言切换按钮 */}
      <div className={styles.languageSwitcher}>
        <button onClick={() => switchLanguage("en")}>English</button>
        <button onClick={() => switchLanguage("zh")}>中文</button>
      </div>

      {/* ✅ 聊天框（加了 ref={chatContainerRef}） */}
      <div className={styles.chatContainer} ref={chatContainerRef}>
        <div className={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.role === "user" ? styles.userMessage : styles.botMessage}>
              <strong>{msg.role === "user" ? "You" : "HarmoniaAI"}:</strong> {msg.content}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 输入框 */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={t.inputPlaceholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>{t.send}</button>
      </div>
    </div>
  );
};

export default Chat;