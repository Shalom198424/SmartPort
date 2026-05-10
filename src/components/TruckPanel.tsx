import React from 'react'
import { useAppSelector } from '../store/hooks'
import { Truck } from '../store/slices/truckSlice'
import clsx from 'clsx'

const STATUS_STYLE: Record<string, string> = {
  loading:    'text-[#0ea5e9]   bg-[#0ea5e9]/10   border-[#0ea5e9]/30',
  'in-transit':'text-amber-400  bg-amber-400/10   border-amber-400/30',
  queued:     'text-purple-400  bg-purple-400/10  border-purple-400/30',
  unloading:  'text-cyan-400   bg-cyan-400/10    border-cyan-400/30',
  departing:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
}

function TruckRow({ t }: { t: Truck }) {
  return (
    <tr className="border-b hover:bg-white/[0.025] transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <td className="px-3 py-2.5 font-mono text-[11px] text-purple-400">{t.id}</td>
      <td className="px-3 py-2.5">
        <div className="text-[12px] text-[#dee3e9]">{t.plate}</div>
        <div className="text-[10px] text-[#88929b]">{t.driver}</div>
      </td>
      <td className="px-3 py-2.5">
        <span className={clsx('text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border', STATUS_STYLE[t.status])}>
          {t.status.replace('-', ' ').toUpperCase()}
        </span>
      </td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9]">{t.berth}</td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9] text-center">{t.containers}</td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#88929b]">{t.eta}</td>
      <td className="px-3 py-2.5 text-center">
        {t.queuePos
          ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-[10px] font-mono font-bold">{t.queuePos}</span>
          : <span className="text-[#3e4850] text-[10px] font-mono">—</span>
        }
      </td>
    </tr>
  )
}

export default function TruckPanel() {
  const trucks = useAppSelector(s => s.trucks.list)
  const queued = trucks.filter(t => t.status === 'queued').length
  const active = trucks.filter(t => t.status !== 'departing').length

  return (
    <div className="glass-card flex flex-col h-full accent-purple">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">Truck Operations</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Gate & Dock Management</div>
        </div>
        <div className="flex gap-3 text-[10px] font-mono">
          <span className="text-purple-400">● {active} on-dock</span>
          <span className="text-amber-400">⏳ {queued} queued</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0" style={{ background: '#1b2024' }}>
              {['Truck', 'Plate / Driver', 'Status', 'Berth', 'Cont.', 'ETA', 'Queue'].map(h => (
                <th key={h} className="label-caps text-left px-3 py-2 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trucks.map(t => <TruckRow key={t.id} t={t} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
