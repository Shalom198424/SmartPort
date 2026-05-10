import { createSlice } from '@reduxjs/toolkit'

export type TruckStatus = 'loading' | 'in-transit' | 'queued' | 'unloading' | 'departing'

export interface Truck {
  id: string
  plate: string
  driver: string
  status: TruckStatus
  berth: string
  containers: number
  eta: string
  queuePos?: number
}

function genTime(offsetMin: number) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + offsetMin)
  return now.toTimeString().slice(0, 5)
}

const DRIVERS = ['R. García','M. López','A. Díaz','C. Martínez','J. Rodríguez','F. Torres','E. Sánchez','L. Jiménez','P. Herrera','N. Castro','D. Flores','S. Morales']

const INITIAL_TRUCKS: Truck[] = Array.from({length:12}, (_,i) => ({
  id: `TR${String(i+1).padStart(3,'0')}`,
  plate: `ABC${100+i}`,
  driver: DRIVERS[i],
  status: (['loading','in-transit','queued','unloading','departing'] as TruckStatus[])[Math.floor(Math.random()*5)],
  berth: `B-0${Math.ceil(Math.random()*8)}`,
  containers: Math.ceil(Math.random()*2),
  eta: genTime(Math.floor(Math.random()*120 - 30)),
  queuePos: i < 5 ? i+1 : undefined,
}))

interface TruckState { list: Truck[]; queueLength: number[] }
const initialState: TruckState = {
  list: INITIAL_TRUCKS,
  queueLength: Array.from({length:24}, (_,i) => Math.max(0, Math.floor(8+Math.sin(i/3)*5 + Math.random()*4))),
}

const truckSlice = createSlice({
  name: 'trucks',
  initialState,
  reducers: {
    tickTrucks(state) {
      state.list.forEach(t => {
        if (t.status === 'loading' && Math.random() < 0.04)    t.status = 'departing'
        if (t.status === 'unloading' && Math.random() < 0.04)  t.status = 'departing'
        if (t.status === 'queued' && Math.random() < 0.05)     t.status = 'loading'
        if (t.status === 'in-transit' && Math.random() < 0.04) t.status = 'queued'
      })
      const last = state.queueLength[state.queueLength.length - 1]
      state.queueLength.shift()
      state.queueLength.push(Math.max(0, Math.min(25, last + Math.floor((Math.random()-0.5)*4))))
    },
  },
})

export const { tickTrucks } = truckSlice.actions
export default truckSlice.reducer
