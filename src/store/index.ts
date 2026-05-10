import { configureStore } from '@reduxjs/toolkit'
import vesselReducer    from './slices/vesselSlice'
import containerReducer from './slices/containerSlice'
import craneReducer     from './slices/craneSlice'
import truckReducer     from './slices/truckSlice'
import sensorReducer    from './slices/sensorSlice'
import activityReducer  from './slices/activitySlice'

export const store = configureStore({
  reducer: {
    vessels:    vesselReducer,
    containers: containerReducer,
    cranes:     craneReducer,
    trucks:     truckReducer,
    sensors:    sensorReducer,
    activity:   activityReducer,
  },
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
