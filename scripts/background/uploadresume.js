/**
 * Resume auto-uploading after a page reload.
 *
 * State.clear() deliberately switches autouploadState off, and the
 * tab options are not part of the save format -- so reloading a
 * server-linked tournament always lands with auto-upload disabled,
 * even when it was uploading happily before the reload.
 *
 * Blindly persisting the flag would defeat the clear() rule (an
 * imported foreign save state must never clobber the server copy).
 * Instead, once the boot-time state load has produced a serverlink,
 * ask the server for its latest state id: when it is exactly the id
 * this browser recorded for its last upload (or download), every
 * change since was made here, and auto-uploading may safely resume.
 * When the ids differ, someone else uploaded meanwhile -- leave the
 * flag off and let the user decide.
 *
 * Runs once per pageload. When the browser is offline at boot, the
 * check is deferred until the window's 'online' event; when no valid
 * API token exists yet, until the server's 'login' event.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import State from '../ui/state.js'
import Server from '../ui/server.js'
import UploadLog from '../ui/uploadlog.js'
import Listener from '../core/listener.js'
import Online from './online.js'

const UploadResume = {}
let done = false
let waitingForOnline = false

function attempt () {
  if (done) {
    return
  }
  const serverlink = State.serverlink.get()
  if (!serverlink) {
    // the state loads after DOM-ready; the serverlink listener below
    // re-runs this attempt once it appears
    return
  }
  if (!Online()) {
    if (!waitingForOnline) {
      waitingForOnline = true
      window.addEventListener('online', function () {
        waitingForOnline = false
        attempt()
      }, { once: true })
    }
    return
  }
  if (State.tabOptions.autouploadState.get()) {
    // already uploading (e.g. a tournament freshly downloaded from
    // the server) -- nothing to resume
    done = true
    return
  }
  const stateId = UploadLog.lastUploadStateId(serverlink)
  if (!stateId) {
    // never uploaded from here, or recorded before state-id tracking
    // existed: we cannot prove the server copy is ours, stay off
    done = true
    return
  }
  const message = Server.message('t/' + serverlink + '/state/latest')
  if (!message) {
    // no (valid) API token yet; the 'login' listener below retries
    return
  }
  done = true
  message.onreceive = function (emitter, event, data) {
    if (data && data.id !== undefined && data.id !== null &&
        String(data.id) === stateId &&
        State.serverlink.get() === serverlink) {
      // the server's latest state is our own upload: all changes
      // since were derived locally, so keep them flowing
      State.tabOptions.autouploadState.set(true)
    }
  }
  message.send()
}

Listener.bind(State.serverlink, 'update', attempt)
if (Server) {
  Listener.bind(Server, 'login', attempt)
}
attempt()

export default UploadResume
