"use client"

import { useState } from "react"

export default function AIPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim()) return

    const userMsg = { role: "user", text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: input,
          stream: false
        })
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data?.response || "AI tidak menjawab"
        }
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ AI offline (cek Ollama)"
        }
      ])
    }

    setLoading(false)
  }

  return (
    <div className="h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-zinc-950 border-r border-yellow-500 p-5">
        <h1 className="text-yellow-400 text-xl font-bold mb-6">
          ITS AI
        </h1>

        <div className="space-y-3 text-sm text-gray-400">
          <div>🤖 Chat AI</div>
          <div>🧠 Memory (soon)</div>
          <div>⚙️ Settings</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-yellow-500 bg-zinc-950">
          <h2 className="text-yellow-400 font-bold">
            AI Assistant Dashboard
          </h2>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap
                ${
                  m.role === "user"
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-900 border border-yellow-500"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm">
              AI sedang berpikir...
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="p-4 border-t border-yellow-500 bg-zinc-950 flex gap-2">

          <input
            className="flex-1 p-3 bg-zinc-900 border border-yellow-500 rounded-xl outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya AI..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-yellow-500 text-black px-6 rounded-xl font-bold"
          >
            Kirim
          </button>

        </div>

      </div>
    </div>
  )
}