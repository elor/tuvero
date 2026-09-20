/**
 * store the state whenever a player name changes
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import State from '../ui/state.js'
import ListCollectorModel from '../ui/listcollectormodel.js'
import TeamModel from '../ui/teammodel.js'
import TournamentModel from '../tournament/tournamentmodel.js'
import StateSaver from '../ui/statesaver.js'
import Listener from '../core/listener.js'
import Server from '../ui/server.js'
import TimeMachine from '../timemachine/timemachine.js'
import UploadLog from '../ui/uploadlog.js'
import { syncState, SYNC_UNSYNCED } from '../core/syncstatus.js'
import upload from './upload.js'

/**
 * Is there anything the server does not have yet?
 *
 * Restoring a state fires the same change events as editing one, so
 * without this every reload of a tournament with teams in it sent
 * the unchanged state back to the server.
 *
 * @param serverlink
 *          the tournament's server id
 * @return true if the local state is ahead of the last upload
 */
function hasUnsentChanges (serverlink) {
  const commit = TimeMachine.commit.get()
  return syncState({
    serverlink,
    lastUpload: UploadLog.lastUpload(serverlink),
    lastSave: commit && commit.key ? new Date(commit.key.saveDate) : undefined
  }) === SYNC_UNSYNCED
}
let updatePending
const AutoSave = undefined
updatePending = undefined
function save () {
  if (updatePending === undefined) {
    updatePending = window.setTimeout(function () {
      updatePending = undefined
      if (StateSaver.canSave()) {
        if (!StateSaver.saveState()) {
          // TODO display as Toast!
          console.error('autosave failed')
        }
        // Linked tournaments always upload: being linked IS the
        // opt-in, and a tournament that silently stops syncing is
        // worse than an extra request. Guarded so upload() doesn't
        // toast about a missing login or link on every save, and so
        // a state the server already has stays where it is.
        const serverlink = State.serverlink.get()
        if (Server.logged_in.get() && serverlink &&
            hasUnsentChanges(serverlink)) {
          upload()
        }
      } else {
        console.warn('cannot autosave: No state loaded.')
      }
    }, 10)
  }
}

// save on player name change
Listener.bind(new ListCollectorModel(State.teams, TeamModel), 'update', save //
)

// save on team insertion/removal
Listener.bind(State.teams, 'resize', save)

// save on tournament property change
Listener.bind(new ListCollectorModel(State.tournaments, TournamentModel), 'update', save)

// save on tournament insertion/removal
Listener.bind(State.tournaments, 'resize', save)

// save on global ranking change (i.e. after every match, etc.
Listener.bind(State.tournaments, 'update', save)

// save on tournament name change
const nameListener = new Listener()
nameListener.onupdate = save

// register tournament listeners
Listener.bind(State.tournaments, 'insert', function (emitter, event, data) {
  data.object.getName().registerListener(nameListener)
})
Listener.bind(State.tournaments, 'remove', function (emitter, event, data) {
  data.object.getName().unregisterListener(nameListener)
})
export default AutoSave
