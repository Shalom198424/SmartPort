import React, { useEffect, useState } from 'react'
import { Anchor, Bell, ChevronDown, Wifi } from 'lucide-react'
import { useAppSelector } from '../store/hooks'

export default function Navbar() {
  const [time, setTime] = useState(new Date())
  const events = useAppSelector(s => s.activity.events)
  const critical = events.filter(e => e.severity === 'critical').length

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b"
      style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(15,20,24,0.95)', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:50 }}>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[#0ea5e9]">
          <Anchor size={20} strokeWidth={2.5} />
          <span className="font-headline font-semibold text-white text-lg tracking-tight">SmartPort</span>
          <span className="text-[#0ea5e9] font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border border-[#0ea5e9]/30 bg-[#0ea5e9]/10">OS v2.4</span>
        </div>

        {/* Ticker */}
        <div className="hidden lg:block overflow-hidden w-72 ml-6">
          <div className="ticker-track flex gap-10 text-[11px] text-[#88929b] font-mono">
            {['MSC Aurora → LOADING 62%','Maersk Horizon → UNLOADING 45%','Ever Golden → DOCKING','STS Crane 4 → MAINTENANCE','Gas Sensor 3 → WARNING'].map((t,i) => (
              <span key={i} className="whitespace-nowrap">◆ {t}</span>
            ))}
            {['MSC Aurora → LOADING 62%','Maersk Horizon → UNLOADING 45%','Ever Golden → DOCKING','STS Crane 4 → MAINTENANCE','Gas Sensor 3 → WARNING'].map((t,i) => (
              <span key={`d${i}`} className="whitespace-nowrap">◆ {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot inline-block" />
          OPERATIONAL
        </div>

        {/* Clock */}
        <div className="hidden md:flex flex-col items-end">
          <span className="font-mono text-sm text-white">{fmt(time)}</span>
          <span className="font-mono text-[10px] text-[#88929b]">{fmtDate(time)}</span>
        </div>

        {/* Connectivity */}
        <div className="flex items-center gap-1 text-cyan-400 text-xs">
          <Wifi size={14} />
          <span className="font-mono hidden sm:inline">LIVE</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded glass-card hover:border-white/20 transition-all">
          <Bell size={16} className="text-[#dee3e9]" />
          {critical > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{critical}</span>
          )}
        </button>

        {/* User */}
        <button className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center text-white text-xs font-bold">OP</div>
          <span className="hidden sm:block text-sm text-[#dee3e9]">Operator</span>
          <ChevronDown size={14} className="text-[#88929b]" />
        </button>
      </div>
    </header>
  )
}
