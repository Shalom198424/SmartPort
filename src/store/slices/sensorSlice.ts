import { createSlice } from '@reduxjs/toolkit'

export type SensorStatus = 'online' | 'warning' | 'offline'
export type SensorType   = 'temperature' | 'humidity' | 'pressure' | 'motion' | 'weight' | 'gas'

export interface Sensor {
  id: string
  name: string
  type: SensorType
  status: SensorStatus
  location: string
  value: number
  unit: string
  threshold: number
  lastUpdate: string
}

const LOCATIONS = ['Berth A','Berth B','Berth C','Warehouse 1','Warehouse 2','Gate North','Gate South','Yard East','Yard West','Control Tower']

function mkSensor(i: number): Sensor {
  const types: SensorType[] = ['temperature','humidity','pressure','motion','weight','gas']
  const type = types[i % types.length]
  const units: Record<SensorType,string> = {
    temperature:'°C', humidity:'%', pressure:'hPa', motion:'detected', weight:'T', gas:'ppm',
  }
  const values: Record<SensorType,[number,number]> = {
    temperature:[18,42], humidity:[30,90], pressure:[1000,1025], motion:[0,1], weight:[0,80], gas:[0,50],
  }
  const [lo,hi] = values[type]
  const val = parseFloat((lo + Math.random()*(hi-lo)).toFixed(1))
  const thr = parseFloat((lo + (hi-lo)*0.8).toFixed(1))
  return {
    id: `SEN-${String(i+1).padStart(3,'0')}`,
    name: `${type.charAt(0).toUpperCase()+type.slice(1)} Sensor ${i+1}`,
    type,
    status: val > thr ? 'warning' : (Math.random() < 0.025 ? 'offline' : 'online'),
    location: LOCATIONS[i % LOCATIONS.length],
    value: val,
    unit: units[type],
    threshold: thr,
    lastUpdate: new Date().toISOString(),
  }
}

interface SensorState { list: Sensor[] }
const initialState: SensorState = {
  list: Array.from({length:24}, (_,i) => mkSensor(i)),
}

const sensorSlice = createSlice({
  name: 'sensors',
  initialState,
  reducers: {
    tickSensors(state) {
      state.list.forEach(s => {
        const types: SensorType[] = ['temperature','humidity','pressure','motion','weight','gas']
        const ranges: Record<SensorType,[number,number]> = {
          temperature:[18,42], humidity:[30,90], pressure:[1000,1025], motion:[0,1], weight:[0,80], gas:[0,50],
        }
        const [lo,hi] = ranges[s.type]
        s.value = parseFloat(Math.max(lo, Math.min(hi, s.value + (Math.random()-0.5)*2)).toFixed(1))
        s.status = s.value > s.threshold ? 'warning' : (Math.random() < 0.01 ? 'offline' : 'online')
        s.lastUpdate = new Date().toISOString()
      })
    },
  },
})

export const { tickSensors } = sensorSlice.actions
export default sensorSlice.reducer
