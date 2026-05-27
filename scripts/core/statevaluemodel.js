import SelectionValueModel from './selectionvaluemodel.js'
import UniqueListModel from './uniquelistmodel.js'

/**
 * Constructor
 *
 * Transition object: { 'current': ['possible1', 'possible2']}
 *
 * @param initial
 *          initial value
 * @param transitions
 *          an object with transition arrays, as described above
 */
class StateValueModel extends SelectionValueModel {
  constructor (initial, transitions) {
    super(initial, //
      new UniqueListModel())

    // push it for safety
    this.allowedValues.push(initial)

    /*
     * Design decision: Not cloning the transitions object, so the state
     * transitions can later be modified, although they're not immediate, but
     * require an update across one of the old transition paths.
     */
    this.transitions = transitions
    this.updateStates()
    this.registerListener(this)
  }

  /**
   * Write all possible next states, as specified by this.transitions, to the
   * list of allowed values.
   */
  updateStates () {
    /*
     * Read all possible states, remove all currently inaccessible states from
     * allowedValues and add those that are accessible. This is not the fastest
     * way, but it avoids any assumptions about possible subclasses
     */
    Object.keys(this.transitions).forEach(function (state) {
      let transition
      transition = this.transitions[this.get()]
      if (this.get() === state) {
        // retain the current state to avoid the default value
        this.allowedValues.push(state)
      } else if (transition.indexOf(state) !== -1) {
        // transition is possible. Allowed state
        this.allowedValues.push(state)
      } else {
        // transition is impossible. Invalid state
        this.allowedValues.erase(state)
      }
    }, this)
  }

  /**
   * like this.set(), but it enforces a state change
   *
   * @param newState
   * @return true on success, false otherwise
   */
  forceState (newState) {
    if (this.transitions[newState]) {
      this.allowedValues.push(newState)
      this.set(newState)
      return true
    }
    return false
  }

  /**
   * Callback function to update the list of allowed states after a state change
   */
  onupdate () {
    this.updateStates()
  }
}

export default StateValueModel
