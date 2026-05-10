import React from 'react'
import { Ship, Package, Cog, Truck, Activity, LayoutDashboard, Map, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

export type TabId = 'overview' | 'vessels' | 'containers' | 'cranes' | 'trucks' | 'sensors' | 'map'

interface NavItem {
  id: TabId
  label: string
  icon: React.ReactNode
  accent: string
}

const NAV_ITEMS: NavItem[] = [
  { id:'overview',   label:'Overview',    icon:<LayoutDashboard size={16}/>, accent:'text-[#0ea5e9]'  },
  { id:'map',        label:'Port Map',    icon:<Map size={16}/>,             accent:'text-cyan-400'   },
  { id:'vessels',    label:'Vessels',     icon:<Ship size={16}/>,            accent:'text-[#0ea5e9]'  },
  { id:'containers', label:'Containers',  icon:<Package size={16}/>,         accent:'text-amber-400'  },
  { id:'cranes',     label:'Cranes',      icon:<Cog size={16}/>,             accent:'text-emerald-400'},
  { id:'trucks',     label:'Trucks',      icon:<Truck size={16}/>,           accent:'text-purple-400' },
  { id:'sensors',    label:'Sensors',     icon:<Activity size={16}/>,        accent:'text-cyan-400'   },
]

interface SidebarProps {
  active: TabId
  onChange: (id: TabId) => void
  alerts: number
}

export default function Sidebar({ active, onChange, alerts }: SidebarProps) {
  return (
    <aside className="w-[60px] xl:w-[200px] flex flex-col flex-shrink-0 border-r"
      style={{ borderColor:'rgba(255,255,255,0.06)', background:'rgba(11,15,22,0.9)' }}>

      {/* Nav items */}
      <nav className="flex-1 py-3 flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left w-full group',
                isActive
                  ? 'bg-white/10 border border-white/10'
                  : 'hover:bg-white/[0.04] border border-transparent'
              )}
            >
              <span className={clsx('flex-shrink-0 transition-colors', isActive ? item.accent : 'text-[#88929b] group-hover:text-[#dee3e9]')}>
                {item.icon}
              </span>
              <span className={clsx(
                'hidden xl:block text-[12px] font-medium transition-colors whitespace-nowrap',
                isActive ? 'text-white' : 'text-[#88929b] group-hover:text-[#dee3e9]'
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="hidden xl:block ml-auto w-1 h-4 rounded-full" style={{ backgroundColor: item.accent.replace('text-','') === 'text-[#0ea5e9]' ? '#0ea5e9' : undefined }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Alerts badge */}
      {alerts > 0 && (
        <div className="mx-2 mb-3 px-3 py-2.5 rounded glass-card border-red-500/30 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
          <span className="hidden xl:block text-[11px] text-red-400 font-mono">{alerts} alert{alerts > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Bottom version */}
      <div className="hidden xl:flex px-4 pb-3 text-[9px] text-[#3e4850] font-mono">
        SmartPort OS v2.4.1
      </div>
    </aside>
  )
}
