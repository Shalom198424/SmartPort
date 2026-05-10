import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ContainerStatus = 'in-transit' | 'loading' | 'unloading' | 'stored' | 'ready'

export interface Container {
  id: string
  type: '20FT' | '40FT' | '40HC'
  status: ContainerStatus
  origin: string
  destination: string
  weight: number
  vessel: string
  berth: string
  eta?: string
}

const origins = ['Shanghai','Rotterdam','Singapore','Busan','Los Angeles','Hamburg','Dubai','Antwerp']
const destinations = ['Buenos Aires','São Paulo','Montevideo','Santiago','Lima','Bogotá','Caracas']

function genContainers(): Container[] {
  const list: Container[] = []
  const statuses: ContainerStatus[] = ['in-transit','loading','unloading','stored','ready']
  const types: Container['type'][] = ['20FT','40FT','40HC']
  for (let i = 1; i <= 24; i++) {
    list.push({
      id: `CONT-${String(i).padStart(4,'0')}`,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      origin: origins[Math.floor(Math.random() * origins.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      weight: Math.floor(5 + Math.random() * 25),
      vessel: `V00${Math.ceil(Math.random() * 8)}`,
      berth: `B-0${Math.ceil(Math.random() * 8)}`,
    })
  }
  return list
}

interface ContainerState {
  list: Container[]
  throughput: number[]   // 24-hour hourly throughput
}

const initialState: ContainerState = {
  list: genContainers(),
  throughput: [120,135,142,98,87,110,155,182,210,247,260,255,240,232,228,219,230,245,260,270,258,243,218,190],
}

const containerSlice = createSlice({
  name: 'containers',
  initialState,
  reducers: {
    tickContainers(state) {
      state.list.forEach(c => {
        if (c.status === 'loading' || c.status === 'unloading') {
          if (Math.random() < 0.03) c.status = 'stored'
        }
      })
      // Shift throughput window
      const last = state.throughput[state.throughput.length - 1]
      state.throughput.shift()
      state.throughput.push(Math.max(80, Math.min(310, last + Math.floor((Math.random()-0.5)*20))))
    },
    updateContainer(state, action: PayloadAction<Partial<Container> & { id: string }>) {
      const idx = state.list.findIndex(c => c.id === action.payload.id)
      if (idx !== -1) Object.assign(state.list[idx], action.payload)
    },
  },
})

export const { tickContainers, updateContainer } = containerSlice.actions
export default containerSlice.reducer
