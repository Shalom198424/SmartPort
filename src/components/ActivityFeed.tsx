import React from 'react'
import { useAppSelector } from '../store/hooks'
import { ActivityEvent } from '../store/slices/activitySlice'
import { Ship, Package, Cog, Truck, Activity, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

const TYPE_ICON: Record<string, React.ReactNode> = {
  vessel:    <Ship size={12} className="text-[#0ea5e9]" />,
  container: <Package size={12} className="text-amber-400" />,
  crane:     <Cog size={12} className="text-emerald-400" />,
  truck:     <Truck size={12} className="text-purple-400" />,
  sensor:    <Activity size={12} className="text-cyan-400" />,
  alert:     <AlertTriangle size={12} className="text-red-400" />,
}

const SEVERITY_DOT: Record<string, string> = {
  info:     'bg-[#0ea5e9]',
  warning:  'bg-amber-400',
  critical: 'bg-red-500',
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })
}

function EventRow({ e }: { e: ActivityEvent }) {
  return (
    <div className={clsx('flex gap-3 px-4 py-2.5 border-b hover:bg-white/[0.02] transition-colors fade-slide',
      'group')} style={{ borderColor:'rgba(255,255,255,0.05)' }}>
      {/* Severity dot */}
      <div className="flex flex-col items-center pt-0.5 gap-1">
        <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', SEVERITY_DOT[e.severity])} />
      </div>
      {/* Icon */}
      <div className="pt-0.5 flex-shrink-0">{TYPE_ICON[e.type]}</div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-[#dee3e9] leading-tight truncate">{e.message}</div>
        {e.detail && <div className="text-[10px] text-[#88929b] font-mono mt-0.5">{e.detail}</div>}
      </div>
      {/* Timestamp */}
      <div className="font-mono text-[10px] text-[#88929b] flex-shrink-0 pt-0.5">{fmtTime(e.timestamp)}</div>
    </div>
  )
}

export default function ActivityFeed() {
  const events = useAppSelector(s => s.activity.events)

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">Activity Feed</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Real-time Operations</div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
          LIVE
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-2 border-b flex-shrink-0" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        {['ALL','VESSEL','CRANE','TRUCK','SENSOR','ALERT'].map(f => (
          <button key={f} className="label-caps px-2 py-1 rounded text-[9px] hover:text-white hover:bg-white/10 transition-colors">
            {f}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {events.slice(0, 40).map(e => <EventRow key={e.id} e={e} />)}
      </div>
    </div>
  )
}
