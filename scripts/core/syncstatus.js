/**
 * Derive a tournament's server-sync state and format it for display.
 *
 * Pure functions — persistence lives in uploadlog.js, DOM wiring in
 * ui/timemachinecommitview.js.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

export const SYNC_LOCAL = 'local'
export const SYNC_UNSYNCED = 'unsynced'
export const SYNC_SYNCED = 'synced'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const RELATIVE_LIMIT = 12 * HOUR

/**
 * @param serverlink the tournament's server id, or falsy if unlinked
 * @param lastUpload Date of the last successful upload, or undefined
 * @param lastSave Date of the newest local save
 * @return one of SYNC_LOCAL, SYNC_UNSYNCED, SYNC_SYNCED
 */
export function syncState ({ serverlink, lastUpload, lastSave }) {
  if (!serverlink) {
    return SYNC_LOCAL
  }
  if (!lastUpload || (lastSave && lastSave.getTime() > lastUpload.getTime())) {
    return SYNC_UNSYNCED
  }
  return SYNC_SYNCED
}

/**
 * "vor 2 Minuten" while recent, "12.09.2026, 14:32" from 12 hours on.
 */
export function formatSyncTime (date, now = new Date()) {
  const age = now.getTime() - date.getTime()
  if (age < RELATIVE_LIMIT) {
    if (age < MINUTE) {
      return 'gerade eben'
    }
    if (age < HOUR) {
      const minutes = Math.floor(age / MINUTE)
      return minutes === 1 ? 'vor 1 Minute' : 'vor ' + minutes + ' Minuten'
    }
    const hours = Math.floor(age / HOUR)
    return hours === 1 ? 'vor 1 Stunde' : 'vor ' + hours + ' Stunden'
  }
  return date.toLocaleDateString('de', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) + ', ' + date.toLocaleTimeString('de', {
    hour: '2-digit', minute: '2-digit'
  })
}

/**
 * Display text for a sync state. Not variant-specific, hence not in
 * the per-variant strings module.
 */
export function syncLabel (state, lastUpload, now) {
  switch (state) {
    case SYNC_UNSYNCED:
      return 'Änderungen nicht hochgeladen'
    case SYNC_SYNCED:
      return 'Hochgeladen ' + formatSyncTime(lastUpload, now)
    default:
      return 'Nur auf diesem Gerät'
  }
}
