import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../store/hooks'
import { tickVessels }    from '../store/slices/vesselSlice'
import { tickContainers } from '../store/slices/containerSlice'
import { tickCranes }     from '../store/slices/craneSlice'
import { tickTrucks }     from '../store/slices/truckSlice'
import { tickSensors }    from '../store/slices/sensorSlice'
import { autoTick }       from '../store/slices/activitySlice'

/**
 * useSimulator – dispatches coordinated tick actions on configurable intervals
 * to drive the real-time data simulation across all Redux slices.
 */
export function useSimulator(enabled = true) {
  const dispatch = useAppDispatch()
  const raf      = useRef<number | null>(null)
  const lastTick = useRef<Record<string, number>>({
    vessels:    0,
    cranes:     0,
    trucks:     0,
    sensors:    0,
    containers: 0,
    activity:   0,
  })

  useEffect(() => {
    if (!enabled) return

    const INTERVALS = {
      vessels:    3000,   // vessels move every 3 s
      cranes:     2000,   // cranes update every 2 s
      trucks:     4000,   // trucks every 4 s
      sensors:    1500,   // sensors every 1.5 s  (IoT feel)
      containers: 5000,   // containers every 5 s
      activity:   6000,   // new event every 6 s
    }

    function tick(now: number) {
      const l = lastTick.current
      if (now - l.vessels    >= INTERVALS.vessels)    { dispatch(tickVessels());    l.vessels    = now }
      if (now - l.cranes     >= INTERVALS.cranes)     { dispatch(tickCranes());     l.cranes     = now }
      if (now - l.trucks     >= INTERVALS.trucks)     { dispatch(tickTrucks());     l.trucks     = now }
      if (now - l.sensors    >= INTERVALS.sensors)    { dispatch(tickSensors());    l.sensors    = now }
      if (now - l.containers >= INTERVALS.containers) { dispatch(tickContainers()); l.containers = now }
      if (now - l.activity   >= INTERVALS.activity)   { dispatch(autoTick());       l.activity   = now }
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [dispatch, enabled])
}
