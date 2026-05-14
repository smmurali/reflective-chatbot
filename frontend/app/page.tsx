"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "https://reflective-chatbot-1vge.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse("Unable to connect right now.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
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
                OCD Pattern Reflection Assistant
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="rounded-2xl bg-black/20 border border-white/10 min-h-[300px] p-6 overflow-y-auto">
            {!response && (
              <div className="text-slate-400 leading-relaxed space-y-3">
                <p>
                  Try asking something reassurance-seeking like:
                </p>

                <div className="space-y-2 mt-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    “What if I offended someone?”
                  </div>

                  <div className="bg-white/5 rounded-xl p-3">
                    “Do you think I’m a bad person?”
                  </div>

                  <div className="bg-white/5 rounded-xl p-3">
                    “Should I keep checking this?”
                  </div>
                </div>
              </div>
            )}

            {response && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-5 leading-relaxed text-slate-100 whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thought..."
              className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-indigo-400 text-lg"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all duration-200 font-semibold shadow-xl"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}