import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { createSocketConnection } from "./utils/socket";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Chat = () => {
  const { targetUserId } = useParams();
  const loggedUser = useSelector((store) => store.user.user);
  const userId = loggedUser?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);     // ✅ NEW
  const [error, setError] = useState(null);          // ✅ NEW
  const [isTyping, setIsTyping] = useState(false);   // ✅ NEW

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ─── Fetch chat history ──────────────────────────────────────────────────
  useEffect(() => {
    if (!userId || !targetUserId) return;
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        setMessages(res.data.messages || []);
        setTargetUser(res.data.targetUser || null);
      } catch (err) {
        console.error("Failed to load chat history", err);
        setError("Could not load messages. Please try again.");
      } finally {
        setLoading(false); // ✅ always clears spinner
      }
    };
    fetchHistory();
  }, [userId, targetUserId]);

  // ─── Socket connection ───────────────────────────────────────────────────
  useEffect(() => {
    if (!userId || !targetUserId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, targetUserId });

    // ✅ Only fires for the OTHER user (socket.to on backend excludes sender)
    socket.on("messageReceived", ({ senderId, text, firstName, lastName, createdAt }) => {
      setMessages((prev) => [...prev, { senderId, text, firstName, lastName, createdAt }]);
      setIsTyping(false);
    });

    // ✅ Typing indicators
    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStoppedTyping", () => setIsTyping(false));

    return () => socket.disconnect();
  }, [userId, targetUserId]);

  // ─── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ─── Send message ─────────────────────────────────────────────────────────
  const sendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      senderId: userId,
      receiverId: targetUserId,
      text: trimmed,
      firstName: loggedUser?.firstName,
      lastName: loggedUser?.lastName,
    });

    // Optimistic update — backend will NOT echo back to us now
    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        text: trimmed,
        firstName: loggedUser?.firstName,
        lastName: loggedUser?.lastName,
        createdAt: new Date().toISOString(), // ✅ timestamp on optimistic msg
      },
    ]);

    setNewMessage("");
    clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit("stoppedTyping", { senderId: userId, receiverId: targetUserId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ✅ Typing indicator with debounce
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!socketRef.current) return;
    socketRef.current.emit("typing", { senderId: userId, receiverId: targetUserId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stoppedTyping", { senderId: userId, receiverId: targetUserId });
    }, 1500);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-600 m-5 h-[80vh] flex flex-col rounded-lg overflow-hidden shadow-xl">

      {/* Header */}
      <div className="p-4 border-b border-gray-600 bg-base-300 flex items-center gap-3">
        {targetUser?.photoUrl && (
          <img src={targetUser.photoUrl} alt="avatar"
            className="w-10 h-10 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-xl font-bold">
            {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Chat"}
          </h1>
          {isTyping && (
            <p className="text-xs text-gray-400 animate-pulse">typing…</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-1 bg-base-200">

        {/* ✅ Loading */}
        {loading && (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-md text-gray-400" />
          </div>
        )}

        {/* ✅ Error */}
        {!loading && error && (
          <p className="text-center text-error mt-10">{error}</p>
        )}

        {/* Empty */}
        {!loading && !error && messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No messages yet. Say hello! 👋</p>
        )}

        {/* Message list */}
        {!loading && messages.map((msg, index) => {
          const isMine = msg.senderId === userId;
          return (
            <div key={index} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
              <div className="chat-header text-xs opacity-60 mb-1">
                {isMine
                  ? "You"
                  : `${msg.firstName || ""} ${msg.lastName || ""}`.trim() || "User"}
                {/* ✅ Timestamp */}
                {msg.createdAt && (
                  <time className="ml-2 opacity-50">{formatTime(msg.createdAt)}</time>
                )}
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          );
        })}

        {/* ✅ Typing bubble */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble flex gap-1 items-center px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
b
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-600 bg-base-300 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message…"
          value={newMessage}
          onChange={handleInputChange}   // ✅ was: e => setNewMessage(e.target.value)
          onKeyDown={handleKeyDown}
          className="input input-bordered flex-1"
        />
        <button onClick={sendMessage} className="btn btn-primary" disabled={!newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;