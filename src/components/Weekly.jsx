import React, { useMemo } from 'react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Weekly({ classesPerDay, weeklyState, toggleAttendance, weekPrefix }) {
  const layout = useMemo(() => days.map((d) => d), [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {layout.map((day) => (
        <div key={day} className="rounded-2xl bg-slate-800/60 border border-white/10 p-5 shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">{day}</h3>
            <span className="text-xs text-sky-200/70">{classesPerDay} classes</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: classesPerDay }).map((_, i) => {
              const key = `${weekPrefix || 'default'}:${day}-${i}`
              const checked = weeklyState[key] || false
              return (
                <label
                  key={key}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition cursor-pointer select-none ${
                    checked
                      ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                      : 'bg-slate-900/40 border-white/10 text-sky-200/80 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-emerald-400 w-4 h-4"
                    checked={checked}
                    onChange={(e) => toggleAttendance(key, e.target.checked)}
                  />
                  Class {i + 1}
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
