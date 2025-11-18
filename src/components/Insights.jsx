import React, { useMemo } from 'react'

export default function Insights({ totalClasses, attended, requiredPercent }) {
  const currentPercent = totalClasses > 0 ? (attended / totalClasses) * 100 : 0

  const { canSkip, needToAttend } = useMemo(() => {
    const rp = Math.max(requiredPercent, 0)
    const skip = attended / (rp / 100 || 1) - totalClasses
    const need = (rp * totalClasses) / 100 - attended
    return {
      canSkip: Math.floor(Math.max(skip, 0)),
      needToAttend: Math.ceil(Math.max(need, 0)),
    }
  }, [attended, totalClasses, requiredPercent])

  const missed = Math.max(totalClasses - attended, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl bg-slate-800/60 border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">What this means for you</h3>
        {currentPercent >= requiredPercent ? (
          <div className="text-emerald-300">
            You're on track! You can skip up to <span className="font-semibold">{canSkip}</span> class{canSkip === 1 ? '' : 'es'} and still stay above {requiredPercent}%.
          </div>
        ) : (
          <div className="text-amber-300">
            You need to attend <span className="font-semibold">{needToAttend}</span> more class{needToAttend === 1 ? '' : 'es'} to reach {requiredPercent}%.
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
            <div className="text-xs text-sky-200/70">Total Attended</div>
            <div className="text-2xl font-semibold text-white">{attended}</div>
          </div>
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
            <div className="text-xs text-sky-200/70">Total Missed</div>
            <div className="text-2xl font-semibold text-white">{missed}</div>
          </div>
          <div className="rounded-xl bg-slate-900/40 border border-white/10 p-4">
            <div className="text-xs text-sky-200/70">Current %</div>
            <div className="text-2xl font-semibold text-white">{Math.round(currentPercent * 10) / 10}%</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-6">
        <h3 className="text-white font-semibold mb-4">Planner</h3>
        <ul className="space-y-3 text-sky-200/80 text-sm">
          <li>• If you attend the next 3 classes, your percentage will rise to {(() => {
            const next = totalClasses + 3
            const nextAtt = attended + 3
            const pct = next > 0 ? (nextAtt / next) * 100 : 0
            return (Math.round(pct * 10) / 10).toFixed(1)
          })()}%</li>
          <li>• Skipping the next class will set you to {(() => {
            const next = totalClasses + 1
            const pct = next > 0 ? (attended / next) * 100 : 0
            return (Math.round(pct * 10) / 10).toFixed(1)
          })()}%</li>
          <li>• To stay above {requiredPercent}%, try not to miss more than <span className="font-semibold">{canSkip}</span> upcoming class{canSkip === 1 ? '' : 'es'}.</li>
        </ul>
      </div>
    </div>
  )
}
