/**
 * Link the active tournament to the server (create + auto-upload)
 * and unlink it back to a local-only tournament.
 *
 * Linking mints a fresh server tournament via POST /api/t/new (the
 * server owns the alias), stores it as the state's serverlink and
 * turns auto-upload on — from then on the regular upload machinery
 * keeps the server current. Unlinking only removes the link and
 * turns auto-upload off; the upload history stays, so re-linking to
 * the same server tournament later shows honest sync info.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Toast from '../ui/toast.js'
import Strings from '../ui/strings.js'
import Server from '../ui/server.js'
import State from '../ui/state.js'
import StateSaver from '../ui/statesaver.js'
import TimeMachine from '../timemachine/timemachine.js'
import Listener from '../core/listener.js'
import Presets from 'presets'
import upload from './upload.js'

export function linkTournament (name) {
  if (State.serverlink.get()) {
    return false
  }
  if (!Server.logged_in.get()) {
    Toast.once(Strings.not_logged_in)
    return false
  }
  if (!name) {
    // Default to the active tree's name. Callers can't reliably pass
    // it themselves: in the create dialog the name input is already
    // cleared by TimeMachineNewTreeController when the click settles.
    const commit = TimeMachine.commit.get()
    name = commit ? commit.getTreeName() : undefined
  }
  const message = Server.message('/t/new', {
    name: name || undefined,
    // shape of the server twin: which variant owns it, and the
    // team size the registration forms should use
    target: Presets.target,
    teamsize: State.teamsize.get() || undefined
  })
  if (!message) {
    Toast.once(Strings.not_logged_in)
    return false
  }
  Listener.bind(message, 'error', function () {
    Toast.once('Online-Anlegen fehlgeschlagen')
  })
  Listener.bind(message, 'receive', function (emitter, event, data) {
    State.serverlink.set(data.alias || String(data.id))
    State.tabOptions.autouploadState.set(true)
    StateSaver.saveState()
    upload()
  })
  message.send()
  return true
}

export function unlinkTournament () {
  if (!State.serverlink.get()) {
    return false
  }
  State.serverlink.set(undefined)
  State.tabOptions.autouploadState.set(false)
  StateSaver.saveState()
  Toast.once('Turnier ist jetzt lokal – wird nicht mehr hochgeladen')
  return true
}

$(function ($) {
  $('#tabs').on('click', 'button.linkserver', function () {
    linkTournament()
  })
  $('#tabs').on('click', 'button.unlinkserver', function () {
    unlinkTournament()
  })
})
