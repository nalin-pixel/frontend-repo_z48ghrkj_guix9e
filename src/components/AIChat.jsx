import React, { useEffect, useState } from 'react'

export default function AIChat({ totalClasses, attended, requiredPercent, setRequiredPercent }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me: "How many can I skip?", "How many to reach 80%?", or "Set required to 75".' },
  ])
  const [input, setInput] = useState('')

  const currentPercent = totalClasses > 0 ? (attended / totalClasses) * 100 : 0
  const p1 = (v) => (Math.round(v * 10) / 10).toFixed(1)

  function canSkip(att, total, req) {
    if (req <= 0) return att
    const v = att / (req / 100) - total
    return Math.max(Math.floor(v), 0)
  }

  function needToReach(att, total, req) {
    if (req <= 0) return 0
    const target = (req * total) / 100
    const v = target - att
    return Math.max(Math.ceil(v), 0)
  }

  function replyTo(q) {
    const text = q.toLowerCase().replace(/\?/g, ' ').trim()

    // set/change required like: set required to 80, change required 70%, set 65%
    const set1 = text.match(/(set|change|update)\s*(required|requirement|target|goal)?\s*(to)?\s*(\d{1,3})%?/)
    if (set1) {
      const t = Math.max(0, Math.min(100, Number(set1[4])))
      setRequiredPercent(t)
      return `Okay, I set your required percentage to ${t}%.`
    }
    const set2 = text.match(/(\d{1,3})%?\s*(required|target|goal)/)
    if (set2) {
      const t = Math.max(0, Math.min(100, Number(set2[1])))
      setRequiredPercent(t)
      return `Got it, updated required to ${t}%.`
    }

    // can I skip
    if (/\bskip\b/.test(text)) {
      const n = canSkip(attended, totalClasses, requiredPercent)
      return `You can skip up to ${n} class${n === 1 ? '' : 'es'} and still stay at or above ${requiredPercent}%.`
    }

    // reach X%
    const reach = text.match(/reach\s*(\d{1,3})%?/)
    if (reach) {
      const t = Math.max(0, Math.min(100, Number(reach[1])))
      const need = needToReach(attended, totalClasses, t)
      return `To reach ${t}%, you need to attend ${need} more class${need === 1 ? '' : 'es'}.`
    }

    // how many do I need
    if (text.includes('need') || /how many.*(attend|get|reach)/.test(text)) {
      const need = needToReach(attended, totalClasses, requiredPercent)
      return `You need ${need} more class${need === 1 ? '' : 'es'} to reach ${requiredPercent}%.`
    }

    if (text.includes('percent') || text.includes('percentage') || text.includes('status') || text.includes('current')) {
      return `You're currently at ${p1(currentPercent)}%. Required is ${requiredPercent}%. Attended ${attended}/${totalClasses}.`
    }

    return 'Try: "How many can I skip?", "How many to reach 80%?", or "Set required to 75".'
  }

  function send() {
    const trimmed = input.trim()
    if (!trimmed) return
    const user = { role: 'user', content: trimmed }
    const bot = { role: 'assistant', content: replyTo(trimmed) }
    setMessages((m) => [...m, user, bot])
    setInput('')
  }

  useEffect(() => {
    const el = document.getElementById('chat-scroll')
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-6 grid grid-rows-[1fr_auto] h-[420px]">
      <div id="chat-scroll" className="overflow-y-auto space-y-3 pr-1">
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
