import React from 'react'
import { useAppSelector } from '../store/hooks'
import { Crane } from '../store/slices/craneSlice'
import clsx from 'clsx'

const STATUS_STYLE: Record<string, string> = {
  active:      'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  idle:        'text-[#88929b]  bg-white/5        border-white/10',
  maintenance: 'text-red-400    bg-red-400/10     border-red-400/30',
}

const TYPE_BADGE: Record<string, string> = {
  STS: 'text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/30',
  RTG: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  MHC: 'text-cyan-400  bg-cyan-400/10  border-cyan-400/30',
}

function UtilBar({ value, status }: { value: number; status: string }) {
  const color = status === 'active' ? '#10b981' : status === 'maintenance' ? '#ef4444' : '#3e4850'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full min-w-[60px]">
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-[10px] w-8 text-right" style={{ color }}>{Math.round(value)}%</span>
    </div>
  )
}

function CraneRow({ c }: { c: Crane }) {
  return (
    <tr className="border-b hover:bg-white/[0.025] transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <td className="px-3 py-2.5 font-mono text-[11px] text-emerald-400">{c.id}</td>
      <td className="px-3 py-2.5">
        <div className="text-[12px] text-[#dee3e9] font-semibold">{c.name}</div>
        <div className="mt-0.5">
          <span className={clsx('text-[9px] font-mono px-1.5 py-0.5 rounded border', TYPE_BADGE[c.type])}>
            {c.type}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <span className={clsx('text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border', STATUS_STYLE[c.status])}>
          {c.status.toUpperCase()}
        </span>
      </td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9]">{c.berth}</td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9]">
        {c.status === 'active' ? `${c.movesPerHour} /hr` : '—'}
      </td>
      <td className="px-3 py-2.5 min-w-[130px]">
        <UtilBar value={c.utilization} status={c.status} />
      </td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9] text-right">{c.containersToday}</td>
    </tr>
  )
}

export default function CranePanel() {
  const cranes = useAppSelector(s => s.cranes.list)
  const active = cranes.filter(c => c.status === 'active').length
  const totalMoves = cranes.reduce((a, c) => a + c.containersToday, 0)

  return (
    <div className="glass-card flex flex-col h-full accent-emerald">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">Crane Fleet</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Equipment Status</div>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="text-emerald-400">● {active}/{cranes.length} active</span>
          <span className="text-[#88929b]">{totalMoves.toLocaleString()} moves today</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0" style={{ background: '#1b2024' }}>
              {['ID', 'Crane', 'Status', 'Berth', 'Moves/hr', 'Utilization', 'Today'].map(h => (
                <th key={h} className="label-caps text-left px-3 py-2 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cranes.map(c => <CraneRow key={c.id} c={c} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
