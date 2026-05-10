import React from 'react'
import { useAppSelector } from '../store/hooks'
import { Sensor } from '../store/slices/sensorSlice'
import { Thermometer, Droplets, Gauge, Zap, Weight, Wind } from 'lucide-react'
import clsx from 'clsx'

const TYPE_ICON: Record<string, React.ReactNode> = {
  temperature: <Thermometer size={13} />,
  humidity:    <Droplets size={13} />,
  pressure:    <Gauge size={13} />,
  motion:      <Zap size={13} />,
  weight:      <Weight size={13} />,
  gas:         <Wind size={13} />,
}

const TYPE_COLOR: Record<string, string> = {
  temperature: '#ef4444',
  humidity:    '#0ea5e9',
  pressure:    '#8b5cf6',
  motion:      '#f59e0b',
  weight:      '#10b981',
  gas:         '#06b6d4',
}

const STATUS_STYLE: Record<string, string> = {
  online:  'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  warning: 'text-amber-400  border-amber-400/30  bg-amber-400/10',
  offline: 'text-red-400    border-red-400/30    bg-red-400/10',
}

function SensorCard({ s }: { s: Sensor }) {
  const color   = TYPE_COLOR[s.type]
  const pct     = Math.min(100, Math.round((s.value / s.threshold) * 100))
  const barColor = s.status === 'warning' ? '#f59e0b' : s.status === 'offline' ? '#ef4444' : color

  return (
    <div className={clsx('glass-card p-3 flex flex-col gap-2 transition-all')}
      style={{ borderLeftColor: color, borderLeftWidth: 2 }}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5" style={{ color }}>
          {TYPE_ICON[s.type]}
          <span className="label-caps text-[9px]" style={{ color }}>{s.type}</span>
        </div>
        <span className={clsx('text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border', STATUS_STYLE[s.status])}>
          {s.status.toUpperCase()}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-end justify-between">
        <span className="font-mono text-lg font-medium text-[#dee3e9] leading-none">
          {s.type === 'motion' ? (s.value > 0.5 ? 'YES' : 'NO') : s.value}
        </span>
        <span className="text-[10px] text-[#88929b] font-mono">{s.unit}</span>
      </div>

      {/* Threshold bar */}
      {s.type !== 'motion' && (
        <div>
          <div className="h-1 bg-white/10 rounded-full">
            <div className="h-1 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, pct)}%`, backgroundColor: barColor }} />
          </div>
          <div className="flex justify-between text-[9px] text-[#3e4850] font-mono mt-0.5">
            <span>0</span>
            <span>thr {s.threshold}{s.unit}</span>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="text-[9px] text-[#88929b] font-mono truncate">{s.location}</div>
    </div>
  )
}

export default function SensorPanel() {
  const sensors = useAppSelector(s => s.sensors.list)
  const online  = sensors.filter(s => s.status === 'online').length
  const warning = sensors.filter(s => s.status === 'warning').length
  const offline = sensors.filter(s => s.status === 'offline').length

  return (
    <div className="glass-card flex flex-col h-full accent-cyan">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">IoT Sensor Network</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Real-time Telemetry</div>
        </div>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="text-emerald-400">● {online} online</span>
          <span className="text-amber-400">⚠ {warning} warn</span>
          <span className="text-red-400">✕ {offline} off</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {sensors.map(s => <SensorCard key={s.id} s={s} />)}
        </div>
      </div>
    </div>
  )
}
