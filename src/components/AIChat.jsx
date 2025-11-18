import React, { useState } from 'react'

export default function AIChat({ totalClasses, attended, requiredPercent, setRequiredPercent }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything about your attendance. Try: "How many classes can I skip?"' },
  ])
  const [input, setInput] = useState('')

  const currentPercent = totalClasses > 0 ? (attended / totalClasses) * 100 : 0

  function calcCanSkip(att, total, req) {
    const v = att / (req / 100 || 1) - total
    return Math.floor(Math.max(v, 0))
  }

  function calcNeedToAttend(att, total, req) {
    const v = (req * total) / 100 - att
    return Math.ceil(Math.max(v, 0))
  }

  function replyTo(q) {
    const text = q.toLowerCase()

    // detect intent
    if (text.includes('skip')) {
      const n = calcCanSkip(attended, totalClasses, requiredPercent)
      return `You can skip up to ${n} class${n === 1 ? '' : 'es'} and still stay at or above ${requiredPercent}%.`
    }

    if (text.match(/reach\s*(\d+)%/)) {
      const m = text.match(/reach\s*(\d+)%/)
      const target = Number(m[1])
      const need = calcNeedToAttend(attended, totalClasses, target)
      return `To reach ${target}%, you need to attend ${need} more class${need === 1 ? '' : 'es'}.`
    }

    if (text.match(/set|change|required/)) {
      const m = text.match(/(\d+)%/)
      if (m) {
        const target = Number(m[1])
        setRequiredPercent(target)
        return `Okay, I set your required percentage to ${target}%. All insights updated.`
      }
      return 'Tell me the percentage you want, e.g., "Set required to 80%".'
    }

    if (text.includes('percent') || text.includes('percentage')) {
      return `You're currently at ${(Math.round(currentPercent * 10) / 10).toFixed(1)}%. Required is ${requiredPercent}%.`
    }

    if (text.includes('need')) {
      const need = calcNeedToAttend(attended, totalClasses, requiredPercent)
      return `You need ${need} more class${need === 1 ? '' : 'es'} to reach ${requiredPercent}%.`
    }

    return 'I can help with skipping capacity, required percentage, and progress. Try asking: "How many classes can I skip?"'
  }

  function send() {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg = { role: 'user', content: trimmed }
    const botMsg = { role: 'assistant', content: replyTo(trimmed) }
    setMessages((m) => [...m, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-6 grid grid-rows-[1fr_auto] h-[420px]">
      <div className="overflow-y-auto space-y-3 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
              m.role === 'assistant'
                ? 'bg-slate-900/60 border border-white/10 text-sky-100'
                : 'bg-sky-500/20 border border-sky-500/40 text-white ml-auto'
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about skips, goals, required %..."
          className="flex-1 rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-sky-500/60"
        />
        <button
          onClick={send}
          className="px-4 py-3 rounded-xl bg-sky-500/80 hover:bg-sky-500 text-white font-medium shadow-lg shadow-sky-500/20"
        >
          Send
        </button>
      </div>
    </div>
  )
}
