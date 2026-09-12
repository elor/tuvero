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
