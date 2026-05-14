"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">

        <div className="p-8 border-b border-white/10">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
              🌙
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Reflective
              </h1>

              <p className="text-slate-300 mt-1 text-lg">
                ERP-Informed Reflection Assistant
              </p>
            </div>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-5">

          {messages.length === 0 && (

            <div className="text-slate-400 space-y-4">

              <p>
                Reflective helps identify reassurance loops and spiraling thought cycles.
              </p>

              <div className="bg-white/5 rounded-2xl p-4">
                “What if I contaminated someone?”
              </div>

              <div className="bg-white/5 rounded-2xl p-4">
                “Can you guarantee I’m okay?”
              </div>

              <div className="bg-white/5 rounded-2xl p-4">
                “Should I check one more time?”
              </div>

            </div>
          )}

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`rounded-2xl p-5 max-w-3xl ${
                msg.role === "user"
                  ? "bg-indigo-500 ml-auto"
                  : "bg-white/5 border border-white/10"
              }`}
            >

              <p className="leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>

              {msg.score !== undefined && msg.score > 0 && (

                <div className="mt-4 space-y-2">

                  <div className="text-sm text-indigo-300">
                    Reassurance Loop Intensity: {msg.score}
                  </div>

                  {msg.patterns?.map((pattern: string, i: number) => (

                    <div
                      key={i}
                      className="inline-block mr-2 mt-1 bg-indigo-500/20 border border-indigo-400/20 rounded-xl px-3 py-1 text-sm text-indigo-200"
                    >
                      {pattern}
                    </div>

                  ))}

                </div>
              )}

            </div>
          ))}

          {loading && (

            <div className="bg-white/5 rounded-2xl p-5 w-fit animate-pulse">
              Reflective is thinking...
            </div>

          )}

        </div>

        <div className="border-t border-white/10 p-6 flex gap-4">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-indigo-400 text-lg"
          />

          <button
            onClick={sendMessage}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all duration-200 font-semibold shadow-xl"
          >
            Send
          </button>

        </div>

        <div className="px-6 pb-6 text-xs text-slate-500 leading-relaxed">
          Reflective is an ERP-informed behavioral awareness tool inspired by OCD treatment principles. It is not a replacement for therapy, diagnosis, or medical care.
        </div>

      </div>

    </div>
  );
}