import ListModel from './listmodel.js'

/**
 * Constructor
 *
 * @param matchlist
 *          a ListModel instance comprising of MatchModel instances
 * @param teamlist
 *          a ListModel instance comprising of team numbers
 * @param ReferenceModel
 *          a reference model, which takes an actual model and a team list as
 *          the constructor arguments, and creates a reference to the model
 */
class ReferenceListModel extends ListModel {
  constructor (matchlist, teamlist, ReferenceModel) {
    super()
    this.makeReadonly()
    this.matches = matchlist
    this.teams = teamlist
    this.ReferenceModel = ReferenceModel
    this.matches.forEach(function (match, id) {
      ReferenceListModel.insertMatch(this, id)
    }, this)
    this.matches.registerListener(this)
  }

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  oninsert (emitter, event, data) {
    if (emitter === this.matches) {
      ReferenceListModel.insertMatch(this, data.id)
    }
  }

  /**
   * Callback function: called when a 'remove' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onremove (emitter, event, data) {
    if (emitter === this.matches) {
      ReferenceListModel.removeMatch(this, data.id)
    }
  }

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  onreset (emitter, event, data) {
    if (emitter === this.matches) {
      this.emit(event, data)
    }
  }

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param referenceList
   *          a ReferenceListModel instance
   * @param id
   *          the id to insert at
   */
  static insertMatch (referenceList, id) {
    let ref
    ref = new referenceList.ReferenceModel(referenceList.matches.get(id), referenceList.teams)
    ListModel.prototype.insert.call(referenceList, id, ref)
  }

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a ReferenceListModel instance
   * @param id
   *          the id to remove
   */
  static removeMatch (list, id) {
    ListModel.prototype.remove.call(list, id)
  }
}

/*
 * Note to self:
 *
 * There's no need to intercept onresize, because the remove and insert
 * functions automatically emit resize events.
 */
export default ReferenceListModel
