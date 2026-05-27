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
    this.sizeView = new ValueView(new ValueModel(), this.$view.find('.size'))
    this.activeView = new ClassView(new ValueModel(false), this.$view, 'activetree')
    this.updateName()
    this.updateStartDate()
    this.updateSaveDate()
    this.updateSize()
    this.updateActive()
    this.autouploadCheckbox = new CheckBoxView(State.tabOptions.autouploadState, this.$view.find('input.autoupload'))
    this.stateLinkView = new StateLinkView(State.serverlink, this.$view.find('a.statelink'))
    this.controller = new TimeMachineCommitController(this)
    TimeMachine.registerListener(this)
  }

  updateName () {
    this.nameView.model.set(this.model.getTreeName())
  }

  updateStartDate () {
    const startDate = new Date(this.model.key.startDate)
    this.startDateView.model.set(startDate.toLocaleString())
  }

  updateSaveDate () {
        const youngestAncestor = this.model.getYoungestDescendant() || this.model
    const saveDate = new Date(youngestAncestor.key.saveDate)
    this.saveDateView.model.set(saveDate.toLocaleString())
  }

  updateSize () {
    let size = TimeMachine.usedRelatedStorage(this.model)
    size = Math.round(size / 102.4) / 10
    this.sizeView.model.set(size + 'kB')
  }

  updateActive () {
    this.activeView.model.set(TimeMachine.isRelatedToActive(this.model))
  }

  onsave (event, emitter, commit) {
    if (commit.key.isRelated(this.model.key)) {
      this.updateSaveDate()
      this.updateSize()
    }
  }

  onremove (event, emitter, commit) {
    if (commit && !commit.isRoot()) {
      this.updateSaveDate()
      this.updateSize()
    }
  }

  oninit (event, emitter, commit) {
    this.updateActive()
  }

  onload (event, emitter, commit) {
    this.updateActive()
  }

  oncleanup (event, emitter, commit) {
    this.updateSize()
  }

  onrename (event, emitter, newname) {
    this.updateName()
  }

  destroy () {
    this.nameView.destroy()
    this.startDateView.destroy()
    this.saveDateView.destroy()
    this.sizeView.destroy()
    this.nameView.model.destroy()
    this.startDateView.model.destroy()
    this.saveDateView.model.destroy()
    this.sizeView.model.destroy()
    this.boxView.destroy()
    super.destroy()
  }
}

export default TimeMachineCommitView
