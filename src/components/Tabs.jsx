import React from 'react'

export default function Tabs({ active, onChange }) {
  const items = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'insights', label: 'Insights' },
    { key: 'chat', label: 'AI Chat' },
  ]
  return (
    <div className="inline-flex bg-slate-800/60 border border-white/10 rounded-xl p-1 overflow-hidden shadow">
      {items.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 rounded-lg text-sm transition relative ${
            active === t.key
              ? 'bg-sky-500/20 text-white border border-sky-500/40 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
              : 'text-sky-200/70 hover:text-white'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
