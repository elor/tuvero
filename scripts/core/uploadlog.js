/**
 * Remember when each server-linked tournament was last uploaded.
 *
 * Kept outside the tournament state on purpose: recording an upload
 * must not dirty the state, or every upload would immediately flag
 * "changes not uploaded" again. Times are keyed by serverlink, which
 * is globally unique across variants, so one shared storage key
 * serves all of them.
 *
 * Each entry stores the upload time plus, when known, the state id
 * the server assigned to the upload ({date, stateId}). Entries written
 * before the state id existed are plain ISO strings; both shapes are
 * read transparently.
 *
 * Emits 'update' after every recorded upload.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Emitter from './emitter.js'

const STORAGEKEY = 'tuvero-uploads'

class UploadLog extends Emitter {
  /**
   * @param storage a Storage-like object (getItem/setItem), e.g.
   *          window.localStorage. Falls back to in-memory when
   *          unavailable (file:// with DOM storage disabled).
   */
  constructor (storage) {
    super()
    this.storage = storage
    this.uploads = this.read()
  }

  read () {
    try {
      const stored = this.storage && this.storage.getItem(STORAGEKEY)
      const parsed = stored && JSON.parse(stored)
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    } catch (error) {
      console.error('UploadLog: discarding unreadable storage content')
      console.error(error)
    }
    return {}
  }

  write () {
    if (!this.storage) {
      return
    }
    try {
      this.storage.setItem(STORAGEKEY, JSON.stringify(this.uploads))
    } catch (error) {
      console.error('UploadLog: cannot persist upload times')
      console.error(error)
    }
  }

  /**
   * @param serverlink the tournament's server id
   * @param date Date of the upload, defaults to now
   * @param stateId the state id the server assigned to this upload,
   *          if known. Omitting it clears any previously recorded id:
   *          an upload with an unknown id means the recorded id no
   *          longer describes the server's latest state.
   */
  recordUpload (serverlink, date = new Date(), stateId = undefined) {
    const entry = { date: date.toISOString() }
    if (stateId !== undefined && stateId !== null) {
      entry.stateId = String(stateId)
    }
    this.uploads[serverlink] = entry
    this.write()
    this.emit('update')
  }

  lastUpload (serverlink) {
    const stored = this.uploads[serverlink]
    // legacy entries are plain ISO strings, current ones {date, stateId}
    const iso = typeof stored === 'string' ? stored : stored && stored.date
    if (!iso) {
      return undefined
    }
    const date = new Date(iso)
    return isNaN(date.getTime()) ? undefined : date
  }

  /**
   * The state id the server assigned to the last recorded upload, as
   * a string, or undefined when unknown (never uploaded, or recorded
   * by a version that predates state-id tracking).
   */
  lastUploadStateId (serverlink) {
    const stored = this.uploads[serverlink]
    if (stored && typeof stored === 'object' && stored.stateId) {
      return stored.stateId
    }
    return undefined
  }
}

export default UploadLog
