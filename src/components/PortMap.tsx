import React, { useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { Vessel } from '../store/slices/vesselSlice'
import clsx from 'clsx'

const STATUS_COLOR: Record<string, string> = {
  loading:   '#0ea5e9',
  unloading: '#f59e0b',
  docking:   '#8b5cf6',
  departing: '#10b981',
  anchored:  '#88929b',
  incoming:  '#06b6d4',
}

const STATUS_LABEL: Record<string, string> = {
  loading:'LOADING', unloading:'UNLOADING', docking:'DOCKING',
  departing:'DEPARTING', anchored:'ANCHORED', incoming:'INCOMING',
}

function VesselPin({ v, onClick, selected }: { v: Vessel; onClick: () => void; selected: boolean }) {
  const color = STATUS_COLOR[v.status]
  return (
    <g style={{ cursor:'pointer' }} onClick={onClick}>
      {/* Ping rings */}
      {selected && (
        <>
          <circle cx={v.x} cy={v.y} r="4" fill="none" stroke={color} strokeWidth="1" opacity="0.5">
            <animate attributeName="r" from="4" to="14" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      {/* Dot */}
      <circle cx={v.x} cy={v.y} r="3.5" fill={color} opacity="0.9" />
      <circle cx={v.x} cy={v.y} r="1.5" fill="white" opacity="0.8" />
      {/* Label */}
      <text x={v.x + 5} y={v.y - 4} fontSize="4.5" fill="white" opacity="0.85" fontFamily="JetBrains Mono, monospace">
        {v.id}
      </text>
    </g>
  )
}

export default function PortMap() {
  const vessels = useAppSelector(s => s.vessels.list)
  const cranes  = useAppSelector(s => s.cranes.list)
  const [selected, setSelected] = useState<Vessel | null>(null)

  // Berth positions (%) in the SVG viewBox 0-100
  const berths = [
    { id:'B-01', x:15, y:35, w:18, h:8 },
    { id:'B-02', x:15, y:50, w:18, h:8 },
    { id:'B-03', x:15, y:65, w:18, h:8 },
    { id:'B-04', x:40, y:25, w:18, h:8 },
    { id:'B-05', x:40, y:40, w:18, h:8 },
    { id:'B-07', x:60, y:50, w:18, h:8 },
    { id:'B-08', x:60, y:65, w:18, h:8 },
  ]

  return (
    <div className="glass-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div>
          <div className="label-caps">Port Map</div>
          <div className="text-white text-sm font-semibold font-headline mt-0.5">Live Terminal View</div>
        </div>
        <div className="flex gap-3 text-[10px] font-mono">
          {Object.entries(STATUS_COLOR).map(([k,c]) => (
            <span key={k} className="flex items-center gap-1" style={{ color: c }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: c }} />
              {STATUS_LABEL[k]}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #0c1a2e 0%, #060a10 100%)' }}
        >
          {/* Ocean grid */}
          {Array.from({length:10},(_,i) => (
            <line key={`h${i}`} x1="0" y1={i*10} x2="100" y2={i*10} stroke="#0ea5e9" strokeWidth="0.15" opacity="0.12" />
          ))}
          {Array.from({length:10},(_,i) => (
            <line key={`v${i}`} x1={i*10} y1="0" x2={i*10} y2="100" stroke="#0ea5e9" strokeWidth="0.15" opacity="0.12" />
          ))}

          {/* Land mass */}
          <rect x="0" y="0" width="8" height="100" fill="#1b2024" />
          <rect x="8" y="0" width="5" height="100" fill="#141b22" />

          {/* Berths */}
          {berths.map(b => (
            <g key={b.id}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h}
                fill="#1b2024" stroke="#0ea5e9" strokeWidth="0.3" opacity="0.8" rx="0.5" />
              <text x={b.x + b.w/2} y={b.y + b.h/2 + 1.5} fontSize="3" fill="#0ea5e9"
                textAnchor="middle" fontFamily="JetBrains Mono, monospace" opacity="0.9">{b.id}</text>
            </g>
          ))}

          {/* Crane indicators */}
          {cranes.filter(c => c.status === 'active').slice(0,6).map((c, i) => {
            const berth = berths[i % berths.length]
            return (
              <g key={c.id}>
                <line x1={berth.x + 3 + i*2} y1={berth.y} x2={berth.x + 3 + i*2} y2={berth.y - 5}
                  stroke="#10b981" strokeWidth="0.5" opacity="0.7" />
                <rect x={berth.x + 1 + i*2} y={berth.y - 6} width="4" height="2"
                  fill="#10b981" opacity="0.5" rx="0.2" />
              </g>
            )
          })}

          {/* Vessel pins */}
          {vessels.map(v => (
            <VesselPin key={v.id} v={v} selected={selected?.id === v.id} onClick={() => setSelected(prev => prev?.id === v.id ? null : v)} />
          ))}

          {/* Compass */}
          <g transform="translate(90,8)">
            <circle cx="0" cy="0" r="5" fill="rgba(0,0,0,0.4)" stroke="#88929b" strokeWidth="0.3" />
            <text x="0" y="-2.5" textAnchor="middle" fontSize="2.5" fill="#dee3e9" fontWeight="bold">N</text>
            <text x="0" y="4"   textAnchor="middle" fontSize="2" fill="#88929b">S</text>
            <text x="3.5" y="1" textAnchor="middle" fontSize="2" fill="#88929b">E</text>
            <text x="-3.5" y="1" textAnchor="middle" fontSize="2" fill="#88929b">W</text>
          </g>
        </svg>

        {/* Vessel detail popup */}
        {selected && (
          <div className="absolute bottom-3 left-3 glass-card p-3 w-56 fade-slide" style={{ borderColor: STATUS_COLOR[selected.status] + '55' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold" style={{ color: STATUS_COLOR[selected.status] }}>{selected.id}</span>
              <button onClick={() => setSelected(null)} className="text-[#88929b] hover:text-white text-xs">✕</button>
            </div>
            <div className="text-white text-sm font-semibold font-headline">{selected.flag} {selected.name}</div>
            <div className="mt-2 space-y-1">
              {[
                ['Type',   selected.type],
                ['Status', STATUS_LABEL[selected.status]],
                ['Berth',  selected.berth],
                ['TEU',    selected.containers.toLocaleString()],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-[#88929b]">{k}</span>
                  <span className="font-mono text-[#dee3e9]">{v}</span>
                </div>
              ))}
            </div>
            {selected.progress > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#88929b]">Progress</span>
                  <span className="font-mono text-[#dee3e9]">{selected.progress.toFixed(0)}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full transition-all duration-500"
                    style={{ width:`${selected.progress}%`, backgroundColor: STATUS_COLOR[selected.status] }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
