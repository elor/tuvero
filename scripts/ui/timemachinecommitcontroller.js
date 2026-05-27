import RenameController from './renamecontroller.js'
import TimeMachine from '../timemachine/timemachine.js'
import StateLoader from './stateloader.js'
import Strings from './strings.js'
import Toast from './toast.js'
import FileSaverModel from './filesavermodel.js'

/**
 * Constructor
 */
class TimeMachineCommitController extends RenameController {
  constructor (view) {
    super(view, false)
    this.view.$view.find('button.removecommit').click(this.remove.bind(this))
    this.view.$view.find('button.loaddescendant').click(this.load.bind(this))
    this.view.$view.find('button.cleanuptree').click(this.cleanup.bind(this))
    this.view.$view.find('button.download').click(this.download.bind(this))
  }

  remove () {
    const active = TimeMachine.isRelatedToActive(this.model)
    const name = this.model.getTreeName() || 'noname'
    const confirmtext = active ? Strings.confirmactivetreeremoval : Strings.confirmtreeremoval
    if (window.confirm(confirmtext.replace('%s', name))) {
      this.model.remove()
      if (active) {
        StateLoader.unload()
      }
    }
  }

  cleanup () {
    TimeMachine.cleanup(this.model, 0)
  }

  load () {
    StateLoader.loadCommit(this.model.getYoungestDescendant() || this.model)
  }

  download () {
    const fileSaver = new FileSaverModel(this.model.getYoungestDescendant() || this.model)
    if (!fileSaver.save()) {
      Toast.once(Strings.savefailed)
    }
  }

  getName (name) {
    return this.model.getTreeName()
  }

  setName (name) {
    if (name) {
      this.model.setTreeName(name)
      return true
    }
    return false
  }
}

export default TimeMachineCommitController
