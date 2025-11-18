import React from 'react'

function StatInput({ label, value, onChange, suffix = '', min = 0 }) {
  return (
    <div className="group relative flex-1">
      <label className="block text-xs text-sky-200/70 mb-1 pl-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-xl bg-slate-800/70 border border-white/10 px-4 py-3 pr-10 text-white placeholder-sky-200/40 outline-none focus:ring-2 focus:ring-sky-500/60 transition shadow-inner"
        />
        {suffix && (
          <span className="absolute inset-y-0 right-3 flex items-center text-sky-200/60 text-sm">{suffix}</span>
        )}
      </div>
    </div>
  )
}

export default function StatsBar({
  classesPerDay,
  setClassesPerDay,
  totalClasses,
  setTotalClasses,
  attended,
  setAttended,
  requiredPercent,
  setRequiredPercent,
}) {
  const currentPercent = totalClasses > 0 ? Math.round((attended / totalClasses) * 1000) / 10 : 0

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatInput label="Classes / Day" value={classesPerDay} onChange={setClassesPerDay} min={0} />
      <StatInput label="Total Classes" value={totalClasses} onChange={setTotalClasses} min={0} />
      <StatInput label="Attended" value={attended} onChange={setAttended} min={0} />
      <div className="group relative flex-1">
        <label className="block text-xs text-sky-200/70 mb-1 pl-1">Current %</label>
        <div className="rounded-xl bg-slate-800/70 border border-white/10 px-4 py-3 text-white shadow-inner">
          {currentPercent}%
        </div>
      </div>
      <StatInput label="Required %" value={requiredPercent} onChange={setRequiredPercent} min={0} suffix="%" />
    </div>
  )
}
