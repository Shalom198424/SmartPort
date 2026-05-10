import { createSlice } from '@reduxjs/toolkit'

export type CraneStatus = 'active' | 'idle' | 'maintenance'

export interface Crane {
  id: string
  name: string
  type: 'STS' | 'RTG' | 'MHC'
  status: CraneStatus
  berth: string
  movesPerHour: number
  utilization: number  // 0-100
  containersToday: number
  hoursActive: number
}

const INITIAL_CRANES: Crane[] = [
  { id:'CR01', name:'STS Crane 1', type:'STS', status:'active',      berth:'B-01', movesPerHour:28, utilization:92, containersToday:186, hoursActive:7 },
  { id:'CR02', name:'STS Crane 2', type:'STS', status:'active',      berth:'B-02', movesPerHour:31, utilization:88, containersToday:204, hoursActive:8 },
  { id:'CR03', name:'STS Crane 3', type:'STS', status:'active',      berth:'B-03', movesPerHour:24, utilization:76, containersToday:152, hoursActive:6 },
  { id:'CR04', name:'STS Crane 4', type:'STS', status:'maintenance', berth:'B-04', movesPerHour:0,  utilization:0,  containersToday:48,  hoursActive:2 },
  { id:'CR05', name:'RTG Alpha',   type:'RTG', status:'active',      berth:'Yard', movesPerHour:18, utilization:82, containersToday:128, hoursActive:8 },
  { id:'CR06', name:'RTG Beta',    type:'RTG', status:'active',      berth:'Yard', movesPerHour:20, utilization:85, containersToday:140, hoursActive:8 },
  { id:'CR07', name:'RTG Gamma',   type:'RTG', status:'idle',        berth:'Yard', movesPerHour:0,  utilization:0,  containersToday:60,  hoursActive:3 },
  { id:'CR08', name:'MHC Dock 1',  type:'MHC', status:'active',      berth:'B-07', movesPerHour:15, utilization:70, containersToday:96,  hoursActive:7 },
  { id:'CR09', name:'MHC Dock 2',  type:'MHC', status:'active',      berth:'B-08', movesPerHour:16, utilization:74, containersToday:104, hoursActive:7 },
  { id:'CR10', name:'MHC Dock 3',  type:'MHC', status:'idle',        berth:'B-05', movesPerHour:0,  utilization:0,  containersToday:72,  hoursActive:4 },
]

interface CraneState { list: Crane[] }
const initialState: CraneState = { list: INITIAL_CRANES }

const craneSlice = createSlice({
  name: 'cranes',
  initialState,
  reducers: {
    tickCranes(state) {
      state.list.forEach(c => {
        if (c.status === 'active') {
          c.utilization   = Math.max(60, Math.min(100, c.utilization + (Math.random()-0.5)*4))
          c.movesPerHour  = Math.max(10, Math.min(40, c.movesPerHour + Math.floor((Math.random()-0.5)*3)))
          c.containersToday += Math.random() < 0.3 ? 1 : 0
        }
      })
    },
  },
})

export const { tickCranes } = craneSlice.actions
export default craneSlice.reducer
