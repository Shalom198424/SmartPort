import React from 'react'
import { useAppSelector } from '../store/hooks'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, AreaChart, Area,
} from 'recharts'

/* ── Crane Utilization ── */
export function CraneUtilizationChart() {
  const cranes = useAppSelector(s => s.cranes.list)
  const data = cranes.map(c => ({ name: c.name.replace('Crane ','').replace(' ',''), util: Math.round(c.utilization), status: c.status }))

  return (
    <div className="glass-card flex flex-col h-full accent-emerald">
      <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div className="label-caps">Crane Utilization</div>
        <div className="text-white text-sm font-semibold font-headline mt-0.5">Live % per unit</div>
      </div>
      <div className="flex-1 p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top:4, right:8, left:-20, bottom:4 }} barSize={12}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fontSize:9, fill:'#88929b', fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0,100]} tick={{ fontSize:9, fill:'#88929b', fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background:'#1b2024', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'4px', fontSize:11 }}
              itemStyle={{ color:'#dee3e9' }}
              labelStyle={{ color:'#88929b' }}
              formatter={(v: any) => [`${v}%`, 'Utilization']}
            />
            <Bar dataKey="util" radius={[2,2,0,0]}>
              {data.map((d, i) => (
                <Cell key={i}
                  fill={d.status === 'active' ? '#10b981' : d.status === 'maintenance' ? '#ef4444' : '#3e4850'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex gap-3 px-4 pb-3 text-[10px] font-mono">
        {[['#10b981','Active'],['#ef4444','Maintenance'],['#3e4850','Idle']].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1" style={{ color: c }}>
            <span className="w-2 h-2 rounded-sm" style={{ background: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Container Throughput ── */
export function ThroughputChart() {
  const raw = useAppSelector(s => s.containers.throughput)
  const now = new Date()
  const data = raw.map((v, i) => {
    const d = new Date(now); d.setHours(now.getHours() - 23 + i)
    return { hour: d.getHours().toString().padStart(2,'0') + 'h', value: v }
  })

  return (
    <div className="glass-card flex flex-col h-full accent-blue">
      <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div className="label-caps">Container Throughput</div>
        <div className="text-white text-sm font-semibold font-headline mt-0.5">24-hour window (TEU/hr)</div>
      </div>
      <div className="flex-1 p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4, right:8, left:-20, bottom:4 }}>
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="hour" tick={{ fontSize:9, fill:'#88929b', fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} interval={3} />
            <YAxis domain={[60,320]} tick={{ fontSize:9, fill:'#88929b', fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background:'#1b2024', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'4px', fontSize:11 }}
              itemStyle={{ color:'#0ea5e9' }}
              labelStyle={{ color:'#88929b' }}
              formatter={(v: any) => [`${v} TEU/hr`, 'Throughput']}
            />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2}
              fill="url(#blueGrad)" dot={false} activeDot={{ r:3, fill:'#0ea5e9' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ── Truck Queue Timeline ── */
export function TruckQueueChart() {
  const raw = useAppSelector(s => s.trucks.queueLength)
  const now = new Date()
  const data = raw.map((v, i) => {
    const d = new Date(now); d.setHours(now.getHours() - 23 + i)
    return { hour: d.getHours().toString().padStart(2,'0') + 'h', queue: v }
  })

  return (
    <div className="glass-card flex flex-col h-full accent-purple">
      <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor:'rgba(255,255,255,0.06)' }}>
        <div className="label-caps">Truck Queue</div>
        <div className="text-white text-sm font-semibold font-headline mt-0.5">Gate queue depth (24h)</div>
      </div>
      <div className="flex-1 p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4, right:8, left:-20, bottom:4 }}>
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="hour" tick={{ fontSize:9, fill:'#88929b', fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} interval={3} />
            <YAxis domain={[0,30]} tick={{ fontSize:9, fill:'#88929b', fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background:'#1b2024', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'4px', fontSize:11 }}
              itemStyle={{ color:'#8b5cf6' }}
              labelStyle={{ color:'#88929b' }}
              formatter={(v: any) => [`${v} trucks`, 'Queue']}
            />
            <Area type="monotone" dataKey="queue" stroke="#8b5cf6" strokeWidth={2}
              fill="url(#purpleGrad)" dot={false} activeDot={{ r:3, fill:'#8b5cf6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
