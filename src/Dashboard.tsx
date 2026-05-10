import React, { useState } from 'react'
import Navbar       from './components/Navbar'
import Sidebar, { TabId } from './components/Sidebar'
import KpiRow       from './components/KpiRow'
import PortMap      from './components/PortMap'
import ActivityFeed from './components/ActivityFeed'
import VesselTable  from './components/VesselTable'
import ContainerPanel from './components/ContainerPanel'
import CranePanel   from './components/CranePanel'
import TruckPanel   from './components/TruckPanel'
import SensorPanel  from './components/SensorPanel'
import { CraneUtilizationChart, ThroughputChart, TruckQueueChart } from './components/Charts'
import { useSimulator } from './hooks/useSimulator'
import { useAppSelector } from './store/hooks'

/* ── Overview: the primary multi-panel view ── */
function OverviewTab() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Main row: Port Map + Activity Feed */}
      <div className="flex gap-3 flex-1 min-h-0" style={{ minHeight: '380px' }}>
        <div className="flex-1 min-w-0">
          <PortMap />
        </div>
        <div className="w-[320px] flex-shrink-0">
          <ActivityFeed />
        </div>
      </div>

      {/* Bottom charts row */}
      <div className="flex gap-3" style={{ height: '200px' }}>
        <div className="flex-1 min-w-0">
          <CraneUtilizationChart />
        </div>
        <div className="flex-1 min-w-0">
          <ThroughputChart />
        </div>
        <div className="flex-1 min-w-0">
          <TruckQueueChart />
        </div>
      </div>
    </div>
  )
}

/* ── Map-only tab ── */
function MapTab() {
  return (
    <div className="flex gap-3 h-full">
      <div className="flex-1 min-w-0"><PortMap /></div>
      <div className="w-[300px] flex-shrink-0"><ActivityFeed /></div>
    </div>
  )
}

const TAB_COMPONENTS: Record<TabId, React.ReactNode> = {
  overview:   <OverviewTab />,
  map:        <MapTab />,
  vessels:    <VesselTable />,
  containers: <ContainerPanel />,
  cranes:     <CranePanel />,
  trucks:     <TruckPanel />,
  sensors:    <SensorPanel />,
}

const TAB_TITLES: Record<TabId, string> = {
  overview:   'Operations Overview',
  map:        'Port Map',
  vessels:    'Fleet Registry',
  containers: 'Container Manifest',
  cranes:     'Crane Fleet',
  trucks:     'Truck Operations',
  sensors:    'IoT Sensor Network',
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  // Kick off the real-time simulator
  useSimulator(true)

  const criticalAlerts = useAppSelector(s =>
    s.activity.events.filter(e => e.severity === 'critical').length
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar active={activeTab} onChange={setActiveTab} alerts={criticalAlerts} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tab header */}
          <div className="px-5 pt-3 pb-0 flex items-center gap-3 flex-shrink-0">
            <h1 className="font-headline text-white font-semibold text-base">
              {TAB_TITLES[activeTab]}
            </h1>
            <div className="flex-1 h-px bg-white/[0.05]" />
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              SIMULATING LIVE
            </div>
          </div>

          {/* KPI row only on overview */}
          {activeTab === 'overview' && <KpiRow />}

          {/* Main content */}
          <div className="flex-1 min-h-0 overflow-auto px-5 pb-5 pt-3">
            {TAB_COMPONENTS[activeTab]}
          </div>
        </main>
      </div>
    </div>
  )
}
