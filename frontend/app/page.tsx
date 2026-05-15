"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I’m Reflective ✨\n\nI’m here to help you slow spiraling thoughts, recognize OCD feedback loops, and gently redirect attention without reinforcing compulsions.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.response,
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
    <main className="min-h-screen bg-gradient-to-b from-[#0f1f17] via-[#13271d] to-[#09110c] text-white flex flex-col relative overflow-hidden">

      {/* Floating Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-10 left-10 text-white/20 text-2xl animate-pulse">
          ✦
        </div>

        <div className="absolute top-24 right-20 text-white/10 text-xl animate-pulse">
          ✧
        </div>

        <div className="absolute top-40 left-1/3 text-white/10 text-lg animate-pulse">
          ⋆
        </div>

        <div className="absolute bottom-24 right-1/4 text-white/20 text-xl animate-pulse">
          ✦
        </div>

        <div className="absolute bottom-40 left-20 text-white/10 text-sm animate-pulse">
          ✧
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/10 bg-white/5 backdrop-blur-md px-6 py-5 flex items-center justify-between">

        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Reflective ✨
          </h1>

          <p className="text-green-200/70 mt-2 text-sm md:text-base">
            Gentle OCD Pattern Reflection Assistant
          </p>
        </div>

        <div className="text-4xl">
          🌙
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">

        <div className="w-full max-w-5xl h-[82vh] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[90%] md:max-w-[75%] rounded-3xl px-5 py-4 whitespace-pre-wrap text-sm md:text-base leading-relaxed shadow-lg ${
                  msg.role === "user"
                    ? "ml-auto bg-green-400 text-black"
                    : "bg-white/10 border border-white/10 text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}

          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 bg-black/20 p-4 md:p-5">

            <div className="flex gap-3 items-center">

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="What thoughts are looping right now?"
                className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-green-400 transition-all"
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
      {/* Footer Disclaimer */}

<footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md px-6 py-4 text-center">

  <p className="text-xs md:text-sm text-green-100/60 leading-relaxed max-w-4xl mx-auto">

    Reflective is an ERP-informed behavioral awareness and reflection tool designed to help users recognize reassurance-seeking and repetitive thought cycles. 

    Reflective is <span className="font-semibold">NOT</span> intended to diagnose OCD or replace therapy, counseling, psychiatric treatment, or medical care.

    This project was developed with consideration of ethical counseling principles inspired by the ACA Code of Ethics, including beneficence, nonmaleficence, autonomy, and minimizing reinforcement of compulsive reassurance loops.

  </p>

</footer>

    </main>
  );
}