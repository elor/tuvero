/**
 * ReferenceListModel: for every match in the matchlist, provide read-only
 * access to the matches, while translating the team indices to external team
 * numbers (e.g. global team ids)
 *
 * @return ReferenceListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel'], function(extend, ListModel) {

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
  function ReferenceListModel(matchlist, teamlist, ReferenceModel) {
    ReferenceListModel.superconstructor.call(this);

    this.makeReadonly();

    this.matches = matchlist;
    this.teams = teamlist;
    this.ReferenceModel = ReferenceModel;

    this.matches.map(function(match, id) {
      ReferenceListModel.insertMatch(this, id);
    }, this);

    this.matches.registerListener(this);
  }
  extend(ReferenceListModel, ListModel);

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param referenceList
   *          a ReferenceListModel instance
   * @param id
   *          the id to insert at
   */
  ReferenceListModel.insertMatch = function(referenceList, id) {
    var ref;
    ref = new referenceList.ReferenceModel(referenceList.matches.get(id),
        referenceList.teams);
    ListModel.prototype.insert.call(referenceList, id, ref);
  };

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a ReferenceListModel instance
   * @param id
   *          the id to remove
   */
  ReferenceListModel.removeMatch = function(list, id) {
    ListModel.prototype.remove.call(list, id);
  };

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReferenceListModel.prototype.oninsert = function(emitter, event, data) {
    if (emitter === this.matches) {
      ReferenceListModel.insertMatch(this, data.id);
      this.emit(event, data);
    }
  };

  /**
   * Callback function: called when a 'remove' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReferenceListModel.prototype.onremove = function(emitter, event, data) {
    if (emitter === this.matches) {
      ReferenceListModel.removeMatch(this, data.id);
      this.emit(event, data);
    }
  };

  /**
   * Callback function: called when a 'reset' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  ReferenceListModel.prototype.onreset = function(emitter, event, data) {
    if (emitter === this.matches) {
      this.emit(event, data);
    }
  };

  /*
   * Note to self:
   *
   * There's no need to intercept onresize, because the remove and insert
   * functions automatically emit resize events.
   */

  return ReferenceListModel;
});
