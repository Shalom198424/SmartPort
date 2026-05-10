import React from 'react'
import { useAppSelector } from '../store/hooks'
import { Container } from '../store/slices/containerSlice'
import clsx from 'clsx'

const STATUS_STYLE: Record<string, string> = {
  'in-transit': 'text-amber-400  bg-amber-400/10  border-amber-400/30',
  loading:      'text-[#0ea5e9]  bg-[#0ea5e9]/10  border-[#0ea5e9]/30',
  unloading:    'text-cyan-400   bg-cyan-400/10   border-cyan-400/30',
  stored:       'text-[#88929b]  bg-white/5       border-white/10',
  ready:        'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
}

function ContainerRow({ c }: { c: Container }) {
  return (
    <tr className="border-b hover:bg-white/[0.025] transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <td className="px-3 py-2 font-mono text-[10px] text-amber-400">{c.id}</td>
      <td className="px-3 py-2">
        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[#dee3e9]">
          {c.type}
        </span>
      </td>
      <td className="px-3 py-2">
        <span className={clsx('text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border', STATUS_STYLE[c.status])}>
          {c.status.replace('-', ' ').toUpperCase()}
        </span>
      </td>
      <td className="px-3 py-2 text-[11px] text-[#88929b] font-mono">{c.origin}</td>
      <td className="px-3 py-2 text-[11px] text-[#88929b] font-mono">{c.destination}</td>
      <td className="px-3 py-2 font-mono text-[11px] text-[#dee3e9]">{c.weight}T</td>
      <td className="px-3 py-2 font-mono text-[10px] text-[#0ea5e9]">{c.vessel}</td>
      <td className="px-3 py-2 font-mono text-[10px] text-[#dee3e9]">{c.berth}</td>
    </tr>
  )
}

export default function ContainerPanel() {
  const containers = useAppSelector(s => s.containers.list)
  const inTransit  = containers.filter(c => c.status === 'in-transit').length

  return (
    <div className="glass-card flex flex-col h-full accent-amber">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">Container Manifest</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Cargo Tracking</div>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="text-amber-400">◆ {inTransit} in transit</span>
          <span className="text-[#88929b]">{containers.length} tracked</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0" style={{ background: '#1b2024' }}>
              {['ID', 'Type', 'Status', 'Origin', 'Destination', 'Weight', 'Vessel', 'Berth'].map(h => (
                <th key={h} className="label-caps text-left px-3 py-2 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {containers.map(c => <ContainerRow key={c.id} c={c} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
