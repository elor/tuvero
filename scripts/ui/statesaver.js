/**
 * StateSaver: Properly saves the State to the TimeMachine
 *
 * @return StateSaver
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import State from './state.js'
import TimeMachine from '../timemachine/timemachine.js'
import StateLoader from './stateloader.js'

/**
 * Constructor of the singleton StateSaver
 */
class StateSaverModel {
  constructor () {
    this.createTree = undefined
  }

  newTree (name) {
    this.createTree = name || ''
  }

  createNewEmptyTree (name) {
    this.newTree(name)
    StateLoader.unload()
    return this.saveState()
  }

  /**
   * @return true if a state can be saved, false otherwise
   */
  canSave () {
    return this.createTree !== undefined || TimeMachine.isInitialized()
  }

  /**
   * Save the current state to a new commit
   *
   * @return true on success, false otherwise
   */
  saveState () {
    const data = State.save()
    return this.saveData(data)
  }

  /**
   * Save a data object to a new commit
   *
   * @param data
   *          a data object to save
   * @return true on success, false otherwise
   */
  saveData (data) {
    if (!data) {
      return false
    }
    const string = JSON.stringify(data)
    return this.saveString(string)
  }

  /**
   * Save a string to a new commit
   *
   * @param string
   *          the string to store
   * @return true on success, false otherwise
   */
  saveString (string) {
    let commit
    if (!string) {
      return false
    }
    if (this.createTree === undefined) {
      commit = TimeMachine.save(string)
    } else {
      commit = TimeMachine.init(string, this.createTree)
    }
    if (!commit) {
      return false
    }
    const success = commit.isValid()
    if (success) {
      this.createTree = undefined
      TimeMachine.cleanup(commit, 3)
      console.log('state saved')
    }
    return success
  }

  removeEverything () {
    StateLoader.unload()
    while (TimeMachine.roots.length > 0) {
      TimeMachine.roots.get(0).eraseTree()
    }
    TimeMachine.getOrphans().forEach(function (orphan) {
      orphan.remove()
    })
  }
}

/*
 * StateSaver is a singleton
 */
const StateSaver = new StateSaverModel()
export default StateSaver
