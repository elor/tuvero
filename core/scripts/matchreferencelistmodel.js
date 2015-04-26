/**
 * MatchReferenceListModel: for every match in the matchlist, provide read-only
 * access to the matches, while translating the team indices to external team
 * numbers (e.g. global team ids)
 *
 * @return MatchReferenceListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './listmodel', './matchreferencemodel'], function(extend,
    ListModel, MatchReferenceModel) {

  /**
   * Constructor
   *
   * @param matchlist
   *          a ListModel instance comprising of MatchModel instances
   * @param teamlist
   *          a ListModel instance comprising of team numbers
   */
  function MatchReferenceListModel(matchlist, teamlist) {
    MatchReferenceListModel.superconstructor.call(this);

    this.makeReadonly();

    this.matches = matchlist;
    this.teams = teamlist;

    this.matches.map(function(match, id) {
      MatchReferenceListModel.insertMatch(this, id);
    }, this);

    this.matches.registerListener(this);
  }
  extend(MatchReferenceListModel, ListModel);

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a MatchReferenceListModel instance
   * @param id
   *          the id to insert at
   */
  MatchReferenceListModel.insertMatch = function(list, id) {
    var ref;
    ref = new MatchReferenceModel(list.matches.get(id), list.teams);
    ListModel.prototype.insert.call(list, id, ref);
  };

  /**
   * Helper function for dealing with readonly list: Do not call directly
   *
   * @param list
   *          a MatchReferenceListModel instance
   * @param id
   *          the id to remove
   */
  MatchReferenceListModel.removeMatch = function(list, id) {
    ListModel.prototype.remove.call(list, id);
  };

  /**
   * Callback function: called when an 'insert' event is emitted
   *
   * @param emitter
   * @param event
   * @param data
   */
  MatchReferenceListModel.prototype.oninsert = function(emitter, event, data) {
    if (emitter === this.matches) {
      MatchReferenceListModel.insertMatch(this, data.id);
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
  MatchReferenceListModel.prototype.onremove = function(emitter, event, data) {
    if (emitter === this.matches) {
      MatchReferenceListModel.removeMatch(this, data.id);
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
  MatchReferenceListModel.prototype.onreset = function(emitter, event, data) {
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

  return MatchReferenceListModel;
});
