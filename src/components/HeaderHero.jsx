import React from 'react'
import Spline from '@splinetool/react-spline'
import { motion } from 'framer-motion'

export default function HeaderHero() {
  return (
    <div className="relative w-full h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 shadow-2xl">
      <Spline scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode" style={{ width: '100%', height: '100%' }} />

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/0 to-slate-900/60" />
      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(59,130,246,0.25),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(59,130,246,0.35)]">
            Smart Attendance Tracker
          </h1>
          <p className="text-sky-200/80 text-sm sm:text-base mt-1">
            Futuristic, interactive, and delightfully smooth — track, plan, and stay on target.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-sky-200/70">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live sync enabled
        </div>
      </motion.div>
    </div>
  )
}
