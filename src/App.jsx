import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import HeaderHero from './components/HeaderHero'
import StatsBar from './components/StatsBar'
import Tabs from './components/Tabs'
import Weekly from './components/Weekly'
import Insights from './components/Insights'
import AIChat from './components/AIChat'

const LS_KEY = 'smart-attendance-state-v1'

export default function App() {
  const [classesPerDay, setClassesPerDay] = useState(4)
  const [totalClasses, setTotalClasses] = useState(0)
  const [attended, setAttended] = useState(0)
  const [requiredPercent, setRequiredPercent] = useState(75)
  const [weeklyState, setWeeklyState] = useState({})
  const [activeTab, setActiveTab] = useState('weekly')

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        setClassesPerDay(s.classesPerDay ?? 4)
        setTotalClasses(s.totalClasses ?? 0)
        setAttended(s.attended ?? 0)
        setRequiredPercent(s.requiredPercent ?? 75)
        setWeeklyState(s.weeklyState ?? {})
        setActiveTab(s.activeTab ?? 'weekly')
      }
    } catch {}
  }, [])

  // persist to localStorage
  useEffect(() => {
    const state = {
      classesPerDay,
      totalClasses,
      attended,
      requiredPercent,
      weeklyState,
      activeTab,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  }, [classesPerDay, totalClasses, attended, requiredPercent, weeklyState, activeTab])

  // ensure invariants: attended <= total
  useEffect(() => {
    if (attended > totalClasses) setAttended(totalClasses)
  }, [totalClasses])

  const currentPercent = useMemo(() => (totalClasses > 0 ? (attended / totalClasses) * 100 : 0), [attended, totalClasses])

  function toggleAttendance(key, checked) {
    setWeeklyState((prev) => {
      const already = !!prev[key]
      // compute deltas
      let deltaTotal = 0
      let deltaAtt = 0

      if (!already && checked) {
        deltaTotal = 1
        deltaAtt = 1
      } else if (already && !checked) {
        deltaTotal = -1
        deltaAtt = -1
      } else if (!already && !checked) {
        // nothing
      } else if (already && checked) {
        // nothing
      }

      // update counters
      setTotalClasses((t) => Math.max(0, t + deltaTotal))
      setAttended((a) => Math.max(0, a + deltaAtt))

      return { ...prev, [key]: checked }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-sky-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
        <HeaderHero />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
          <StatsBar
            classesPerDay={classesPerDay}
            setClassesPerDay={setClassesPerDay}
            totalClasses={totalClasses}
            setTotalClasses={setTotalClasses}
            attended={attended}
            setAttended={setAttended}
            requiredPercent={requiredPercent}
            setRequiredPercent={setRequiredPercent}
          />

          <div className="flex items-center justify-between">
            <Tabs active={activeTab} onChange={setActiveTab} />
            <div className="text-sm text-sky-200/70">
              Current: <span className="text-white font-semibold">{Math.round(currentPercent * 10) / 10}%</span>
            </div>
          </div>

          {activeTab === 'weekly' && (
            <Weekly
              classesPerDay={classesPerDay}
              weeklyState={weeklyState}
              toggleAttendance={toggleAttendance}
            />
          )}

          {activeTab === 'insights' && (
            <Insights
              totalClasses={totalClasses}
              attended={attended}
              requiredPercent={requiredPercent}
            />
          )}

          {activeTab === 'chat' && (
            <AIChat
              totalClasses={totalClasses}
              attended={attended}
              requiredPercent={requiredPercent}
              setRequiredPercent={setRequiredPercent}
            />
          )}
        </motion.div>
      </div>

      {/* glow backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-20 h-[600px] w-[900px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(closest-side,rgba(56,189,248,0.35),transparent)]" />
      </div>
    </div>
  )
}
