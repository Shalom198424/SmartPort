import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ActivityType = 'vessel' | 'crane' | 'truck' | 'container' | 'sensor' | 'alert'

export interface ActivityEvent {
  id: string
  type: ActivityType
  message: string
  detail?: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
}

const SEED_EVENTS: ActivityEvent[] = [
  { id:'a1', type:'vessel',    message:'MSC Aurora – Loading commenced',      detail:'B-01 | 1,840 TEU',  timestamp: timeAgo(2),  severity:'info' },
  { id:'a2', type:'crane',     message:'STS Crane 4 – Maintenance alert',     detail:'Hydraulic pressure', timestamp: timeAgo(5),  severity:'warning' },
  { id:'a3', type:'vessel',    message:'Ever Golden – Docking in progress',   detail:'ETA Berth B-03',    timestamp: timeAgo(8),  severity:'info' },
  { id:'a4', type:'container', message:'CONT-0012 – Overweight detected',     detail:'32.4 T / limit 30T',timestamp: timeAgo(11), severity:'critical' },
  { id:'a5', type:'truck',     message:'TR007 – Gate clearance granted',      detail:'Gate North',         timestamp: timeAgo(14), severity:'info' },
  { id:'a6', type:'sensor',    message:'Gas Sensor 3 – Threshold exceeded',   detail:'45 ppm (limit 40)',  timestamp: timeAgo(18), severity:'warning' },
  { id:'a7', type:'vessel',    message:'COSCO Shanghai – Departure approved', detail:'Final clearance',    timestamp: timeAgo(22), severity:'info' },
  { id:'a8', type:'truck',     message:'TR003 – Queue position updated',      detail:'Position 2 of 7',   timestamp: timeAgo(26), severity:'info' },
]

function timeAgo(min: number) {
  const d = new Date(); d.setMinutes(d.getMinutes()-min)
  return d.toISOString()
}

let counter = 100
const AUTO_MESSAGES: Omit<ActivityEvent,'id'|'timestamp'>[] = [
  { type:'vessel',    message:'Vessel position updated',            detail:'GPS beacon received',     severity:'info' },
  { type:'crane',     message:'RTG Beta – Cycle completed',         detail:'Container relocated',     severity:'info' },
  { type:'truck',     message:'TR009 – Arrived at gate',            detail:'Gate South',              severity:'info' },
  { type:'container', message:'CONT-0018 – Status: In Transit',     detail:'Stacked on COSCO ship',  severity:'info' },
  { type:'sensor',    message:'Temperature Sensor 2 – Normal',      detail:'22.3°C',                 severity:'info' },
  { type:'alert',     message:'Wind speed alert: 35 knots',         detail:'Crane ops may be suspended', severity:'warning' },
  { type:'vessel',    message:'Pacific Warrior – ETA updated',      detail:'22:10 → 23:45',          severity:'warning' },
  { type:'crane',     message:'MHC Dock 1 – Productivity peak',     detail:'18 moves/hr achieved',   severity:'info' },
]

interface ActivityState { events: ActivityEvent[] }
const initialState: ActivityState = { events: SEED_EVENTS }

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<Omit<ActivityEvent,'id'|'timestamp'>>) {
      const ev: ActivityEvent = { ...action.payload, id: `a${++counter}`, timestamp: new Date().toISOString() }
      state.events.unshift(ev)
      if (state.events.length > 80) state.events.pop()
    },
    autoTick(state) {
      const tmpl = AUTO_MESSAGES[Math.floor(Math.random() * AUTO_MESSAGES.length)]
      const ev: ActivityEvent = { ...tmpl, id: `a${++counter}`, timestamp: new Date().toISOString() }
      state.events.unshift(ev)
      if (state.events.length > 80) state.events.pop()
    },
  },
})

export const { addEvent, autoTick } = activitySlice.actions
export default activitySlice.reducer
