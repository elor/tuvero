/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import {
  SYNC_LOCAL, SYNC_UNSYNCED, SYNC_SYNCED,
  syncState, formatSyncTime, syncLabel
} from '../syncstatus.js'

const NOW = new Date('2026-09-12T14:32:00')

test('syncState', () => {
  // no serverlink: the tournament only exists on this device
  expect(syncState({ serverlink: undefined })).toBe(SYNC_LOCAL)
  expect(syncState({ serverlink: '' })).toBe(SYNC_LOCAL)

  // linked but never uploaded
  expect(syncState({
    serverlink: 'abc123',
    lastUpload: undefined,
    lastSave: new Date('2026-09-12T14:00:00')
  })).toBe(SYNC_UNSYNCED)

  // saved after the last upload: there are changes the server lacks
  expect(syncState({
    serverlink: 'abc123',
    lastUpload: new Date('2026-09-12T13:00:00'),
    lastSave: new Date('2026-09-12T14:00:00')
  })).toBe(SYNC_UNSYNCED)

  // uploaded after (or at) the last save
  expect(syncState({
    serverlink: 'abc123',
    lastUpload: new Date('2026-09-12T14:00:00'),
    lastSave: new Date('2026-09-12T14:00:00')
  })).toBe(SYNC_SYNCED)
  expect(syncState({
    serverlink: 'abc123',
    lastUpload: new Date('2026-09-12T14:05:00'),
    lastSave: new Date('2026-09-12T14:00:00')
  })).toBe(SYNC_SYNCED)
})

test('formatSyncTime: relative under 12 hours', () => {
  expect(formatSyncTime(new Date('2026-09-12T14:31:50'), NOW)).toBe('gerade eben')
  expect(formatSyncTime(new Date('2026-09-12T14:30:00'), NOW)).toBe('vor 2 Minuten')
  expect(formatSyncTime(new Date('2026-09-12T14:31:00'), NOW)).toBe('vor 1 Minute')
  expect(formatSyncTime(new Date('2026-09-12T12:32:00'), NOW)).toBe('vor 2 Stunden')
  expect(formatSyncTime(new Date('2026-09-12T13:32:00'), NOW)).toBe('vor 1 Stunde')
  // 11h59m is still relative
  expect(formatSyncTime(new Date('2026-09-12T02:33:00'), NOW)).toBe('vor 11 Stunden')
})

test('formatSyncTime: absolute from 12 hours on', () => {
  const formatted = formatSyncTime(new Date('2026-09-12T02:31:00'), NOW)
  expect(formatted).toContain('12.09.2026')
  expect(formatted).toContain('02:31')
})

test('syncLabel speaks the user\'s language (button says "Hochladen")', () => {
  // deliberate choice, and "hochgeladen" rather than "Upload"
  expect(syncLabel(SYNC_LOCAL)).toBe('Lokales Turnier – wird nicht hochgeladen')

  // linked but never uploaded vs. stale online copy
  expect(syncLabel(SYNC_UNSYNCED)).toBe('Noch nicht hochgeladen')
  expect(
    syncLabel(SYNC_UNSYNCED, new Date('2026-09-12T12:32:00'), NOW)
  ).toBe('Geändert seit dem letzten Hochladen (vor 2 Stunden)')

  // completeness is the message; the time is secondary context and
  // "gerade eben" adds nothing at all
  expect(
    syncLabel(SYNC_SYNCED, new Date('2026-09-12T14:31:55'), NOW)
  ).toBe('Alle Änderungen hochgeladen')
  expect(
    syncLabel(SYNC_SYNCED, new Date('2026-09-12T14:30:00'), NOW)
  ).toBe('Alle Änderungen hochgeladen (vor 2 Minuten)')
  expect(
    syncLabel(SYNC_SYNCED, new Date('2026-09-11T09:15:00'), NOW)
  ).toBe('Alle Änderungen hochgeladen (am 11.09.2026, 09:15)')
})
