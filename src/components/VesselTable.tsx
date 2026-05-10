import React from 'react'
import { useAppSelector } from '../store/hooks'
import { Vessel } from '../store/slices/vesselSlice'
import clsx from 'clsx'

const STATUS_COLORS: Record<string, string> = {
  loading:   'text-[#0ea5e9]  bg-[#0ea5e9]/10  border-[#0ea5e9]/30',
  unloading: 'text-amber-400  bg-amber-400/10  border-amber-400/30',
  docking:   'text-purple-400 bg-purple-400/10 border-purple-400/30',
  departing: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  anchored:  'text-[#88929b] bg-white/5 border-white/10',
  incoming:  'text-cyan-400  bg-cyan-400/10  border-cyan-400/30',
}

function VesselRow({ v }: { v: Vessel }) {
  return (
    <tr className="border-b hover:bg-white/[0.025] transition-colors group"
      style={{ borderColor:'rgba(255,255,255,0.05)' }}>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#0ea5e9]">{v.id}</td>
      <td className="px-3 py-2.5">
        <div className="text-[12px] text-[#dee3e9] font-semibold font-headline">{v.flag} {v.name}</div>
        <div className="text-[10px] text-[#88929b]">{v.type}</div>
      </td>
      <td className="px-3 py-2.5">
        <span className={clsx('text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border', STATUS_COLORS[v.status])}>
          {v.status.toUpperCase()}
        </span>
      </td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9]">{v.berth}</td>
      <td className="px-3 py-2.5 font-mono text-[11px] text-[#dee3e9]">{v.containers.toLocaleString()} TEU</td>
      <td className="px-3 py-2.5">
        {v.progress > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/10 rounded-full w-20">
              <div className="h-1 rounded-full" style={{ width:`${v.progress}%`, backgroundColor: '#0ea5e9' }} />
            </div>
            <span className="font-mono text-[10px] text-[#88929b]">{v.progress.toFixed(0)}%</span>
          </div>
        ) : <span className="text-[#3e4850] text-[10px]">—</span>}
      </td>
    </tr>
  )
}

export default function VesselTable() {
  const vessels = useAppSelector(s => s.vessels.list)

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">Fleet Registry</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Active Vessels</div>
        </div>
        <span className="label-caps text-[#0ea5e9]">{vessels.length} vessels</span>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0" style={{ background:'#1b2024' }}>
              {['ID','Vessel','Status','Berth','Capacity','Progress'].map(h => (
                <th key={h} className="label-caps text-left px-3 py-2 border-b"
                  style={{ borderColor:'rgba(255,255,255,0.06)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vessels.map(v => <VesselRow key={v.id} v={v} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
