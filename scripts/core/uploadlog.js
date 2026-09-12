/**
 * Remember when each server-linked tournament was last uploaded.
 *
 * Kept outside the tournament state on purpose: recording an upload
 * must not dirty the state, or every upload would immediately flag
 * "changes not uploaded" again. Times are keyed by serverlink, which
 * is globally unique across variants, so one shared storage key
 * serves all of them.
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

  recordUpload (serverlink, date = new Date()) {
    this.uploads[serverlink] = date.toISOString()
    this.write()
    this.emit('update')
  }

  lastUpload (serverlink) {
    const stored = this.uploads[serverlink]
    if (!stored) {
      return undefined
    }
    const date = new Date(stored)
    return isNaN(date.getTime()) ? undefined : date
  }
}

export default UploadLog
