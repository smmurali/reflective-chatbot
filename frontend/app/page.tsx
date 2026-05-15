"use client";

import { useState } from "react";
import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
});

export default function Home() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {

    if (!message.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ];

    setMessages(updatedMessages);
    setLoading(true);

    try {

      const response = await fetch(
        "https://reflective-chatbot-1vge.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            history: messages,
          }),
        }
      );

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.response,
        score: data.reassurance_score,
        patterns: data.patterns_detected,
      };

      setMessages([
        ...updatedMessages,
        botMessage
      ]);

      setMessage("");

    } catch (err) {

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Unable to connect right now.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
  <main className="min-h-screen bg-gradient-to-b from-[#0f1f17] via-[#13271d] to-[#09110c] text-white flex flex-col">

    {/* Header */}
    <div className="w-full border-b border-white/10 backdrop-blur-md bg-white/5 px-6 py-5 flex items-center justify-between">

      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Reflective ✨
        </h1>

        <p className="text-green-200/70 mt-1 text-sm md:text-base">
          Gentle OCD Pattern Reflection Assistant
        </p>
      </div>

      <div className="text-3xl">
        🌙
      </div>
    </div>

    {/* Stars Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 text-white/20 text-xl animate-pulse">✦</div>
      <div className="absolute top-20 right-20 text-white/20 text-sm animate-pulse">✧</div>
      <div className="absolute top-40 left-1/3 text-white/10 text-lg animate-pulse">⋆</div>
      <div className="absolute bottom-32 right-1/4 text-white/20 animate-pulse">✦</div>
    </div>

    {/* Chat Area */}
    <div className="flex-1 flex justify-center items-center px-4 py-6 relative z-10">

      <div className="w-full max-w-4xl h-[80vh] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-4 text-sm md:text-base leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "ml-auto bg-green-500 text-black"
                  : "bg-white/10 border border-white/10 text-white"
              }`}
            >
              {msg.content}
            </div>
          ))}

        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 md:p-5 bg-black/20">

          <div className="flex gap-3 items-center">

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What thoughts are looping right now?"
              className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-green-400 transition"
            />

            <button
              onClick={sendMessage}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Send ✨
            </button>

          </div>

        </div>

      </div>

    </div>

  </main>
}

