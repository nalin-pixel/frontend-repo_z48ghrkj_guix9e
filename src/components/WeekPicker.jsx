import React, { useMemo } from 'react'

function toISODate(d) {
  const tz = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  return tz.toISOString().slice(0, 10)
}

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay() || 7 // Sun=0 -> 7
  if (day !== 1) d.setDate(d.getDate() - (day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export default function WeekPicker({ weekStartISO, onChange }) {
  const monday = useMemo(() => new Date(weekStartISO), [weekStartISO])
  const saturday = useMemo(() => addDays(monday, 5), [monday])

  return (
    <div className="flex items-center gap-3 text-sm">
      <label className="text-sky-200/80">Week:</label>
      <input
        type="date"
        value={weekStartISO}
        onChange={(e) => {
          const picked = e.target.value ? new Date(e.target.value) : new Date()
          const mon = getMonday(picked)
          onChange(toISODate(mon))
        }}
        className="rounded-xl bg-slate-900/60 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500/60"
      />
      <span className="text-sky-200/70">
        {monday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        {' '}–{' '}
        {saturday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </span>
    </div>
  )
}
