/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import UploadLog from '../uploadlog.js'

function fakeStorage () {
  const data = {}
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value) },
    data
  }
}

test('UploadLog stores and returns upload times per serverlink', () => {
  const storage = fakeStorage()
  const log = new UploadLog(storage)

  expect(log.lastUpload('abc123')).toBe(undefined)

  const when = new Date('2026-09-12T14:32:00')
  log.recordUpload('abc123', when)
  expect(log.lastUpload('abc123').getTime()).toBe(when.getTime())
  expect(log.lastUpload('other')).toBe(undefined)

  // persisted: a new instance over the same storage sees it
  const second = new UploadLog(storage)
  expect(second.lastUpload('abc123').getTime()).toBe(when.getTime())
})

test('UploadLog emits update on record', () => {
  const log = new UploadLog(fakeStorage())
  let events = 0
  // minimal Listener shape: emitter bookkeeping + the event handler
  log.registerListener({ emitters: [], onupdate: () => { events++ } })
  log.recordUpload('abc123', new Date())
  expect(events).toBe(1)
})

test('UploadLog survives corrupt storage content', () => {
  const storage = fakeStorage()
  storage.setItem('tuvero-uploads', '{not json')
  const log = new UploadLog(storage)
  expect(log.lastUpload('abc123')).toBe(undefined)
  log.recordUpload('abc123', new Date('2026-09-12T14:32:00'))
  expect(log.lastUpload('abc123')).not.toBe(undefined)
})

test('UploadLog tolerates missing storage (file:// with disabled DOM storage)', () => {
  const log = new UploadLog(undefined)
  expect(log.lastUpload('abc123')).toBe(undefined)
  log.recordUpload('abc123', new Date())
  expect(log.lastUpload('abc123')).not.toBe(undefined) // in-memory fallback
})

test('UploadLog records the server-returned state id per serverlink', () => {
  const storage = fakeStorage()
  const log = new UploadLog(storage)

  expect(log.lastUploadStateId('abc123')).toBe(undefined)

  const when = new Date('2026-09-12T14:32:00')
  log.recordUpload('abc123', when, 4711)
  // state ids are opaque identifiers -- stored and compared as strings
  expect(log.lastUploadStateId('abc123')).toBe('4711')
  expect(log.lastUpload('abc123').getTime()).toBe(when.getTime())
  expect(log.lastUploadStateId('other')).toBe(undefined)

  // persisted: a new instance over the same storage sees it
  const second = new UploadLog(storage)
  expect(second.lastUploadStateId('abc123')).toBe('4711')
  expect(second.lastUpload('abc123').getTime()).toBe(when.getTime())
})

test('UploadLog without a state id clears a previously recorded one', () => {
  // A newer upload whose id we did not learn means the recorded id no
  // longer describes the server state -- it must not linger around.
  const log = new UploadLog(fakeStorage())
  log.recordUpload('abc123', new Date(), 4711)
  log.recordUpload('abc123', new Date())
  expect(log.lastUploadStateId('abc123')).toBe(undefined)
  expect(log.lastUpload('abc123')).not.toBe(undefined)
})

test('UploadLog reads legacy plain-ISO-string entries', () => {
  const storage = fakeStorage()
  storage.setItem('tuvero-uploads',
    JSON.stringify({ abc123: '2026-09-12T14:32:00' }))
  const log = new UploadLog(storage)
  expect(log.lastUpload('abc123').getTime())
    .toBe(new Date('2026-09-12T14:32:00').getTime())
  expect(log.lastUploadStateId('abc123')).toBe(undefined)
})
