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
 * "12.09.2026, 14:32"
 */
export function formatAbsoluteTime (date) {
  return date.toLocaleDateString('de', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) + ', ' + date.toLocaleTimeString('de', {
    hour: '2-digit', minute: '2-digit'
  })
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
  return formatAbsoluteTime(date)
}

/**
 * Display text for a sync state, in the vocabulary the UI already
 * teaches (the button is called "Hochladen"). States the consequence
 * for the user, not the storage location. Not variant-specific,
 * hence not in the per-variant strings module.
 */
export function syncLabel (state, lastUpload) {
  switch (state) {
    case SYNC_UNSYNCED:
      if (lastUpload) {
        return 'Geändert seit dem letzten Hochladen'
      }
      return 'Noch nicht hochgeladen'
    case SYNC_SYNCED:
      // Completeness is the whole message; when the upload happened
      // adds nothing once everything is safe.
      return 'Alle Änderungen hochgeladen'
    default:
      // Device-only is a deliberate choice, not a deficiency.
      return 'Lokales Turnier – wird nicht hochgeladen'
  }
}

/**
 * Hover text carrying the upload time the label deliberately omits.
 * Empty when nothing was ever uploaded (nothing to hover).
 */
export function syncTitle (lastUpload, now = new Date()) {
  if (!lastUpload) {
    return ''
  }
  const relative = formatSyncTime(lastUpload, now)
  if (relative === formatAbsoluteTime(lastUpload)) {
    return 'Zuletzt hochgeladen: ' + relative
  }
  return 'Zuletzt hochgeladen: ' + relative +
    ' (' + formatAbsoluteTime(lastUpload) + ')'
}
