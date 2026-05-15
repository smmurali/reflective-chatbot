"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Reflective ✨\n\nI’m here to help you slow spiraling thoughts, recognize OCD feedback loops, and gently redirect attention without reinforcing compulsions.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: message },
    ];

    setMessages(updatedMessages);

    const currentMessage = message;
    setMessage("");

    try {
      const response = await fetch(
        "https://reflective-chatbot-1vge.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentMessage,
          }),
        }
      );

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Something went wrong connecting to Reflective’s server.",
        },
      ]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1f16] to-[#07110c] text-white flex flex-col">
      <div className="border-b border-green-900/40 backdrop-blur-md bg-black/10">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Reflective ✨
            </h1>
            <p className="text-green-100/70 mt-2 text-lg">
              Gentle OCD Pattern Reflection Assistant
            </p>
          </div>

          <div className="text-4xl opacity-80">
            🌙
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl flex flex-col rounded-3xl border border-green-900/40 bg-black/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[65vh]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-6 py-5 text-lg leading-relaxed ${
                  msg.role === "user"
                    ? "ml-auto bg-green-400 text-black"
                    : "bg-white/10 border border-white/10 text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="border-t border-green-900/40 p-5 bg-black/20">
            <div className="flex gap-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="What thoughts are looping right now?"
                className="flex-1 rounded-2xl bg-white/5 border border-green-400/30 px-5 py-4 outline-none text-lg placeholder:text-white/40 focus:border-green-300"
              />

              <button
                onClick={sendMessage}
                className="px-8 py-4 rounded-2xl bg-green-400 text-black font-semibold text-lg hover:scale-105 transition"
              >
                Send ✨
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-6 pb-10 text-sm text-white/50 leading-relaxed text-center">
        Reflective is an ERP-informed behavioral awareness and reflection tool
        designed to help users recognize reassurance-seeking and repetitive
        thought cycles. Reflective is NOT intended to diagnose OCD or replace
        therapy, counseling, psychiatric treatment, or medical care. This
        project was developed with consideration of ethical counseling
        principles inspired by the ACA Code of Ethics, including beneficence,
        nonmaleficence, autonomy, and minimizing reinforcement of compulsive
        reassurance loops.
      </footer>
    </main>
  );
}