import View from '../core/view.js'
import TimeMachine from '../timemachine/timemachine.js'
import ValueModel from '../core/valuemodel.js'
import ValueView from './valueview.js'
import ClassView from '../core/classview.js'
import State from './state.js'
import TimeMachineCommitController from './timemachinecommitcontroller.js'
import BoxView from './boxview.js'
import CheckBoxView from './checkboxview.js'
import StateLinkView from './statelinkview.js'
import Listener from '../core/listener.js'
import UploadLog from './uploadlog.js'
import {
  syncState, syncLabel, syncTitle, formatSyncTime, formatAbsoluteTime
} from '../core/syncstatus.js'

/**
 * Constructor
 */
class TimeMachineCommitView extends View {
  constructor (model, $view) {
    super(model, $view)
    this.boxView = new BoxView(this.$view)
    this.nameView = new ValueView(new ValueModel(), this.$view.find('.name'))
    this.startDateView = new ValueView(new ValueModel(), this.$view.find('.startdate'))
    this.saveDateView = new ValueView(new ValueModel(), this.$view.find('.savedate'))
    this.activeView = new ClassView(new ValueModel(false), this.$view, 'activetree')
    this.updateName()
    this.updateStartDate()
    this.updateSaveDate()
    this.updateActive()
    this.autouploadCheckbox = new CheckBoxView(State.tabOptions.autouploadState, this.$view.find('input.autoupload'))
    this.stateLinkView = new StateLinkView(State.serverlink, this.$view.find('a.statelink'))
    this.syncStatusView = new ValueView(new ValueModel(''), this.$view.find('.syncstatus'))
    this.updateSyncStatus()
    // Re-derive on upload (UploadLog), on link/unlink (serverlink) and
    // on save (onsave below). Like the statelink, the status is only
    // shown for the active tree (the ".active" gate in the template),
    // since serverlink describes the loaded state.
    const view = this
    Listener.bind(UploadLog, 'update', function () { view.updateSyncStatus() })
    Listener.bind(State.serverlink, 'update', function () { view.updateSyncStatus() })
    this.controller = new TimeMachineCommitController(this)
    TimeMachine.registerListener(this)
  }

  updateSyncStatus () {
    const serverlink = State.serverlink.get()
    const lastUpload = serverlink
      ? UploadLog.lastUpload(serverlink)
      : undefined
    const youngestAncestor = this.model.getYoungestDescendant() || this.model
    const state = syncState({
      serverlink,
      lastUpload,
      lastSave: new Date(youngestAncestor.key.saveDate)
    })
    this.syncStatusView.model.set(syncLabel(state, lastUpload))
    // state class for color coding (style/background/upload.css);
    // the exact upload time lives in the hover text
    this.$view.find('.syncstatus')
      .removeClass('sync-local sync-unsynced sync-synced')
      .addClass('sync-' + state)
      .attr('title', syncTitle(lastUpload))
  }

  updateName () {
    this.nameView.model.set(this.model.getTreeName())
  }

  updateStartDate () {
    const startDate = new Date(this.model.key.startDate)
    this.startDateView.model.set(startDate.toLocaleDateString('de', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }))
    this.$view.find('.startdate')
      .attr('title', 'Beginn: ' + formatAbsoluteTime(startDate))
  }

  updateSaveDate () {
    const youngestAncestor = this.model.getYoungestDescendant() || this.model
    const saveDate = new Date(youngestAncestor.key.saveDate)
    this.saveDateView.model.set('geändert ' + formatSyncTime(saveDate))
    this.$view.find('.savedate')
      .attr('title', 'Zuletzt geändert: ' + formatAbsoluteTime(saveDate))
  }

  updateActive () {
    this.activeView.model.set(TimeMachine.isRelatedToActive(this.model))
  }

  onsave (event, emitter, commit) {
    if (commit.key.isRelated(this.model.key)) {
      this.updateSaveDate()
      this.updateSyncStatus()
    }
  }

  onremove (event, emitter, commit) {
    if (commit && !commit.isRoot()) {
      this.updateSaveDate()
    }
  }

  oninit (event, emitter, commit) {
    this.updateActive()
  }

  onload (event, emitter, commit) {
    this.updateActive()
  }

  oncleanup (event, emitter, commit) {
  }

  onrename (event, emitter, newname) {
    this.updateName()
  }

  destroy () {
    this.nameView.destroy()
    this.startDateView.destroy()
    this.saveDateView.destroy()
    this.nameView.model.destroy()
    this.startDateView.model.destroy()
    this.saveDateView.model.destroy()
    this.boxView.destroy()
    super.destroy()
  }
}

export default TimeMachineCommitView
