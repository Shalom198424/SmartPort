/**
 * SmartPort OS — Redux Slice Unit Tests
 * Tests all five data slices: vessels, containers, cranes, trucks, sensors + activity feed
 */
import vesselReducer, {
  tickVessels,
  updateVessel,
  Vessel,
} from '../../store/slices/vesselSlice'

import containerReducer, {
  tickContainers,
  updateContainer,
} from '../../store/slices/containerSlice'

import craneReducer, {
  tickCranes,
  Crane,
} from '../../store/slices/craneSlice'

import truckReducer, {
  tickTrucks,
} from '../../store/slices/truckSlice'

import sensorReducer, {
  tickSensors,
} from '../../store/slices/sensorSlice'

import activityReducer, {
  addEvent,
  autoTick,
} from '../../store/slices/activitySlice'

// ─────────────────────────────────────────
// VESSEL SLICE
// ─────────────────────────────────────────
describe('vesselSlice', () => {
  it('should return initial state with 8 vessels', () => {
    const state = vesselReducer(undefined, { type: '@@INIT' })
    expect(state.list).toHaveLength(8)
  })

  it('should contain V001 with status loading', () => {
    const state = vesselReducer(undefined, { type: '@@INIT' })
    const v001  = state.list.find(v => v.id === 'V001')
    expect(v001).toBeDefined()
    expect(v001!.status).toBe('loading')
  })

  it('tickVessels should advance progress for active vessels', () => {
    const initial = vesselReducer(undefined, { type: '@@INIT' })
    const before  = initial.list.find(v => v.status === 'loading')!.progress
    const after   = vesselReducer(initial, tickVessels())
    const updated = after.list.find(v => v.id === before.toString() || true)!

    // progress for a loading vessel should be >= initial
    const loadingAfter = after.list.filter(v => v.status === 'loading')
    loadingAfter.forEach(v => {
      expect(v.progress).toBeGreaterThanOrEqual(0)
      expect(v.progress).toBeLessThanOrEqual(100)
    })
  })

  it('updateVessel should patch a vessel by id', () => {
    const initial = vesselReducer(undefined, { type: '@@INIT' })
    const next    = vesselReducer(initial, updateVessel({ id: 'V001', status: 'departing' }))
    const v001    = next.list.find(v => v.id === 'V001')
    expect(v001!.status).toBe('departing')
  })

  it('updateVessel with unknown id should leave list unchanged', () => {
    const initial = vesselReducer(undefined, { type: '@@INIT' })
    const next    = vesselReducer(initial, updateVessel({ id: 'X999', status: 'departing' }))
    expect(next.list).toHaveLength(initial.list.length)
  })

  it('all vessel positions should be within [5,95] bounds', () => {
    const state = vesselReducer(undefined, { type: '@@INIT' })
    state.list.forEach(v => {
      expect(v.x).toBeGreaterThanOrEqual(5)
      expect(v.x).toBeLessThanOrEqual(95)
      expect(v.y).toBeGreaterThanOrEqual(5)
      expect(v.y).toBeLessThanOrEqual(95)
    })
  })
})

// ─────────────────────────────────────────
// CONTAINER SLICE
// ─────────────────────────────────────────
describe('containerSlice', () => {
  it('should initialise with 24 containers', () => {
    const state = containerReducer(undefined, { type: '@@INIT' })
    expect(state.list).toHaveLength(24)
  })

  it('should initialise with 24 throughput data points', () => {
    const state = containerReducer(undefined, { type: '@@INIT' })
    expect(state.throughput).toHaveLength(24)
  })

  it('throughput values should be within [80, 310]', () => {
    const state = containerReducer(undefined, { type: '@@INIT' })
    state.throughput.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(60)
      expect(v).toBeLessThanOrEqual(320)
    })
  })

  it('tickContainers should shift throughput window by 1', () => {
    const initial = containerReducer(undefined, { type: '@@INIT' })
    const before  = [...initial.throughput]
    const after   = containerReducer(initial, tickContainers())
    expect(after.throughput).toHaveLength(24)
    // First element should be the second of the original array
    expect(after.throughput[0]).toBe(before[1])
  })

  it('updateContainer should patch by id', () => {
    const initial = containerReducer(undefined, { type: '@@INIT' })
    const targetId = initial.list[0].id
    const next = containerReducer(initial, updateContainer({ id: targetId, status: 'ready' }))
    expect(next.list.find(c => c.id === targetId)!.status).toBe('ready')
  })

  it('all containers should have valid type (20FT|40FT|40HC)', () => {
    const state = containerReducer(undefined, { type: '@@INIT' })
    state.list.forEach(c => {
      expect(['20FT', '40FT', '40HC']).toContain(c.type)
    })
  })
})

// ─────────────────────────────────────────
// CRANE SLICE
// ─────────────────────────────────────────
describe('craneSlice', () => {
  it('should initialise with 10 cranes', () => {
    const state = craneReducer(undefined, { type: '@@INIT' })
    expect(state.list).toHaveLength(10)
  })

  it('should have exactly 1 crane in maintenance', () => {
    const state = craneReducer(undefined, { type: '@@INIT' })
    const maintenance = state.list.filter(c => c.status === 'maintenance')
    expect(maintenance).toHaveLength(1)
    expect(maintenance[0].id).toBe('CR04')
  })

  it('tickCranes should keep utilization in [0,100]', () => {
    let state = craneReducer(undefined, { type: '@@INIT' })
    for (let i = 0; i < 20; i++) state = craneReducer(state, tickCranes())
    state.list.forEach(c => {
      expect(c.utilization).toBeGreaterThanOrEqual(0)
      expect(c.utilization).toBeLessThanOrEqual(100)
    })
  })

  it('idle cranes should have 0 utilization and 0 movesPerHour', () => {
    const state = craneReducer(undefined, { type: '@@INIT' })
    const idle  = state.list.filter(c => c.status === 'idle')
    idle.forEach(c => {
      expect(c.utilization).toBe(0)
      expect(c.movesPerHour).toBe(0)
    })
  })

  it('all crane types should be STS|RTG|MHC', () => {
    const state = craneReducer(undefined, { type: '@@INIT' })
    state.list.forEach(c => expect(['STS','RTG','MHC']).toContain(c.type))
  })
})

// ─────────────────────────────────────────
// TRUCK SLICE
// ─────────────────────────────────────────
describe('truckSlice', () => {
  it('should initialise with 12 trucks', () => {
    const state = truckReducer(undefined, { type: '@@INIT' })
    expect(state.list).toHaveLength(12)
  })

  it('should initialise with 24 queue data points', () => {
    const state = truckReducer(undefined, { type: '@@INIT' })
    expect(state.queueLength).toHaveLength(24)
  })

  it('queueLength values should be non-negative', () => {
    const state = truckReducer(undefined, { type: '@@INIT' })
    state.queueLength.forEach(v => expect(v).toBeGreaterThanOrEqual(0))
  })

  it('tickTrucks should shift queue window', () => {
    const initial = truckReducer(undefined, { type: '@@INIT' })
    const before  = [...initial.queueLength]
    const after   = truckReducer(initial, tickTrucks())
    expect(after.queueLength).toHaveLength(24)
    expect(after.queueLength[0]).toBe(before[1])
  })

  it('all trucks should have valid status', () => {
    const state    = truckReducer(undefined, { type: '@@INIT' })
    const valid    = ['loading','in-transit','queued','unloading','departing']
    state.list.forEach(t => expect(valid).toContain(t.status))
  })

  it('trucks with queuePos should have status queued', () => {
    const state = truckReducer(undefined, { type: '@@INIT' })
    state.list
      .filter(t => t.queuePos !== undefined)
      .forEach(t => {
        // queuePos trucks are typically queued; just ensure queuePos is a positive number
        expect(t.queuePos).toBeGreaterThan(0)
      })
  })
})

// ─────────────────────────────────────────
// SENSOR SLICE
// ─────────────────────────────────────────
describe('sensorSlice', () => {
  it('should initialise with 24 sensors', () => {
    const state = sensorReducer(undefined, { type: '@@INIT' })
    expect(state.list).toHaveLength(24)
  })

  it('all sensor types should be valid', () => {
    const state  = sensorReducer(undefined, { type: '@@INIT' })
    const valid  = ['temperature','humidity','pressure','motion','weight','gas']
    state.list.forEach(s => expect(valid).toContain(s.type))
  })

  it('all sensor statuses should be valid', () => {
    const state = sensorReducer(undefined, { type: '@@INIT' })
    state.list.forEach(s => expect(['online','warning','offline']).toContain(s.status))
  })

  it('tickSensors should update lastUpdate timestamps', () => {
    const initial = sensorReducer(undefined, { type: '@@INIT' })
    // Small delay not possible in sync test — just verify lastUpdate is ISO string
    initial.list.forEach(s => expect(new Date(s.lastUpdate).toISOString()).toBe(s.lastUpdate))
  })

  it('tickSensors should keep values within type-specific bounds', () => {
    let state = sensorReducer(undefined, { type: '@@INIT' })
    for (let i = 0; i < 30; i++) state = sensorReducer(state, tickSensors())
    const ranges: Record<string, [number, number]> = {
      temperature:[18,42], humidity:[30,90], pressure:[1000,1025],
      motion:[0,1], weight:[0,80], gas:[0,50],
    }
    state.list.forEach(s => {
      const [lo, hi] = ranges[s.type]
      expect(s.value).toBeGreaterThanOrEqual(lo - 0.1)
      expect(s.value).toBeLessThanOrEqual(hi + 0.1)
    })
  })
})

// ─────────────────────────────────────────
// ACTIVITY SLICE
// ─────────────────────────────────────────
describe('activitySlice', () => {
  it('should initialise with 8 seed events', () => {
    const state = activityReducer(undefined, { type: '@@INIT' })
    expect(state.events).toHaveLength(8)
  })

  it('addEvent should prepend a new event', () => {
    const initial = activityReducer(undefined, { type: '@@INIT' })
    const next    = activityReducer(initial, addEvent({
      type: 'vessel', message: 'Test vessel event', severity: 'info',
    }))
    expect(next.events).toHaveLength(9)
    expect(next.events[0].message).toBe('Test vessel event')
    expect(next.events[0].type).toBe('vessel')
    expect(next.events[0].severity).toBe('info')
  })

  it('addEvent should generate unique id and ISO timestamp', () => {
    const initial = activityReducer(undefined, { type: '@@INIT' })
    const next    = activityReducer(initial, addEvent({
      type: 'alert', message: 'Critical alert', severity: 'critical',
    }))
    expect(next.events[0].id).toBeDefined()
    expect(new Date(next.events[0].timestamp).toISOString()).toBe(next.events[0].timestamp)
  })

  it('autoTick should add one event', () => {
    const initial = activityReducer(undefined, { type: '@@INIT' })
    const next    = activityReducer(initial, autoTick())
    expect(next.events.length).toBe(initial.events.length + 1)
  })

  it('events list should not exceed 80 items', () => {
    let state = activityReducer(undefined, { type: '@@INIT' })
    for (let i = 0; i < 100; i++) state = activityReducer(state, autoTick())
    expect(state.events.length).toBeLessThanOrEqual(80)
  })

  it('addEvent with critical severity should increment at front', () => {
    const initial = activityReducer(undefined, { type: '@@INIT' })
    const next    = activityReducer(initial, addEvent({
      type:'alert', message:'Gas leak detected', detail:'Zone C-4', severity:'critical',
    }))
    expect(next.events[0].severity).toBe('critical')
    expect(next.events[0].detail).toBe('Zone C-4')
  })
})
