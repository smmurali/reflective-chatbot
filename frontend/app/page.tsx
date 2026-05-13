"use client"

import { useState } from "react"

export default function Home() {

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])

  async function sendMessage() {

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input
    }

    setMessages((prev) => [...prev, userMessage])

    setInput("")

    try {

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input
        })
      })

      const data = await response.json()

      const botMessage = {
        role: "assistant",
        content: data.response
      }

      setMessages((prev) => [...prev, botMessage])

    } catch (error) {

      const botMessage = {
        role: "assistant",
        content: "Backend not connected yet."
      }

      setMessages((prev) => [...prev, botMessage])
    }
  }

  return (
    <main className="h-screen flex flex-col bg-zinc-950 text-white">

      <div className="border-b border-zinc-800 p-4">
        <h1 className="text-2xl font-bold">
          Reflective
        </h1>

        <p className="text-zinc-400">
          OCD Pattern Reflection Assistant
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((message, index) => (

          <div
            key={index}
            className={`max-w-xl p-4 rounded-2xl ${
              message.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-zinc-800"
            }`}
          >

            <p>{message.content}</p>

          </div>
        ))}

      </div>

      <div className="border-t border-zinc-800 p-4 flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your thoughts..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-3"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-6 rounded-xl"
        >
          Send
        </button>

      </div>

    </main>
  )
}