import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type VesselStatus = 'docking' | 'loading' | 'unloading' | 'departing' | 'anchored' | 'incoming'

export interface Vessel {
  id: string
  name: string
  flag: string
  type: string
  status: VesselStatus
  berth: string
  eta: string
  progress: number
  containers: number
  x: number
  y: number
}

const INITIAL_VESSELS: Vessel[] = [
  { id:'V001', name:'MSC Aurora',       flag:'🇵🇦', type:'Container', status:'loading',   berth:'B-01', eta:'--:--', progress:62, containers:1840, x:22, y:38 },
  { id:'V002', name:'Maersk Horizon',   flag:'🇩🇰', type:'Container', status:'unloading', berth:'B-02', eta:'--:--', progress:45, containers:2210, x:28, y:55 },
  { id:'V003', name:'Ever Golden',      flag:'🇹🇼', type:'Container', status:'docking',   berth:'B-03', eta:'14:30', progress:10, containers:3200, x:52, y:30 },
  { id:'V004', name:'CMA Titan',        flag:'🇫🇷', type:'Tanker',    status:'anchored',  berth:'B-04', eta:'18:45', progress:0,  containers:0,    x:70, y:62 },
  { id:'V005', name:'COSCO Shanghai',   flag:'🇨🇳', type:'Container', status:'departing', berth:'B-05', eta:'--:--', progress:98, containers:1975, x:42, y:68 },
  { id:'V006', name:'Pacific Warrior',  flag:'🇯🇵', type:'Bulk',      status:'incoming',  berth:'--',   eta:'22:10', progress:0,  containers:0,    x:85, y:25 },
  { id:'V007', name:'Nordic Star',      flag:'🇳🇴', type:'RoRo',      status:'loading',   berth:'B-07', eta:'--:--', progress:78, containers:420,  x:35, y:45 },
  { id:'V008', name:'Atlantic Bridge',  flag:'🇧🇸', type:'Container', status:'unloading', berth:'B-08', eta:'--:--', progress:30, containers:1560, x:18, y:60 },
]

interface VesselState {
  list: Vessel[]
}

const initialState: VesselState = { list: INITIAL_VESSELS }

const vesselSlice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    updateVessel(state, action: PayloadAction<Partial<Vessel> & { id: string }>) {
      const idx = state.list.findIndex(v => v.id === action.payload.id)
      if (idx !== -1) Object.assign(state.list[idx], action.payload)
    },
    tickVessels(state) {
      state.list.forEach(v => {
        if (v.status === 'loading' || v.status === 'unloading') {
          v.progress = Math.min(100, v.progress + Math.random() * 0.8)
          if (v.progress >= 100) v.status = 'departing'
        }
        // Drift position slightly for animation
        v.x = Math.max(5, Math.min(92, v.x + (Math.random() - 0.5) * 0.3))
        v.y = Math.max(5, Math.min(88, v.y + (Math.random() - 0.5) * 0.3))
      })
    },
  },
})

export const { updateVessel, tickVessels } = vesselSlice.actions
export default vesselSlice.reducer
