import React from 'react'
import { Ship, Package, Cog, Truck, Activity } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import clsx from 'clsx'

interface KpiCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub: string
  accent: string
  glowClass: string
  trend?: string
}

function KpiCard({ icon, label, value, sub, accent, glowClass, trend }: KpiCardProps) {
  return (
    <div className={clsx('glass-card p-4 flex flex-col gap-2 flex-1 min-w-[160px]', accent)}>
      <div className="flex items-start justify-between">
        <div className="label-caps">{label}</div>
        <div className={clsx('p-1.5 rounded', glowClass)} style={{ background:'rgba(255,255,255,0.06)' }}>
          {icon}
        </div>
      </div>
      <div className="data-display text-[#dee3e9]">{value}</div>
      <div className="text-[11px] text-[#88929b] font-mono">{sub}</div>
      {trend && <div className="text-[10px] text-emerald-400 font-mono">{trend}</div>}
    </div>
  )
}

export default function KpiRow() {
  const vessels    = useAppSelector(s => s.vessels.list)
  const containers = useAppSelector(s => s.containers.list)
  const cranes     = useAppSelector(s => s.cranes.list)
  const trucks     = useAppSelector(s => s.trucks.list)
  const sensors    = useAppSelector(s => s.sensors.list)

  const activeVessels  = vessels.filter(v => v.status !== 'incoming').length
  const inTransit      = containers.filter(c => c.status === 'in-transit' || c.status === 'loading' || c.status === 'unloading').length
  const activeCranes   = cranes.filter(c => c.status === 'active').length
  const dockTrucks     = trucks.filter(t => t.status !== 'departing').length
  const onlineSensors  = sensors.filter(s => s.status === 'online').length

  return (
    <div className="flex gap-3 flex-wrap px-5 py-3">
      <KpiCard
        icon={<Ship size={15} className="text-[#0ea5e9]" />}
        label="Active Vessels"
        value={activeVessels}
        sub={`${vessels.length} total fleet`}
        accent="accent-blue"
        glowClass="glow-blue"
        trend="↑ 2 vs yesterday"
      />
      <KpiCard
        icon={<Package size={15} className="text-amber-400" />}
        label="Containers in Transit"
        value={`${inTransit}`}
        sub={`${containers.length} total tracked`}
        accent="accent-amber"
        glowClass="glow-amber"
        trend="↑ 8% throughput"
      />
      <KpiCard
        icon={<Cog size={15} className="text-emerald-400" />}
        label="Crane Operations"
        value={`${activeCranes}/${cranes.length}`}
        sub={`${cranes.filter(c=>c.status==='maintenance').length} in maintenance`}
        accent="accent-emerald"
        glowClass="glow-emerald"
      />
      <KpiCard
        icon={<Truck size={15} className="text-purple-400" />}
        label="Trucks on Dock"
        value={dockTrucks}
        sub={`${trucks.filter(t=>t.status==='queued').length} in queue`}
        accent="accent-purple"
        glowClass="glow-purple"
      />
      <KpiCard
        icon={<Activity size={15} className="text-cyan-400" />}
        label="Active Sensors"
        value={`${onlineSensors}/${sensors.length}`}
        sub={`${sensors.filter(s=>s.status==='warning').length} warnings`}
        accent="accent-cyan"
        glowClass="glow-cyan"
        trend={onlineSensors === sensors.length ? '● All nominal' : `⚠ ${sensors.length - onlineSensors} offline`}
      />
    </div>
  )
}
