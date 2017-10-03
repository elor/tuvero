/**
 * MatchReferenceModel: Reference a match in all regards, but map the teams from
 * their tournament-specific id to the global id.
 *
 * @return MatchReferenceModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/matchmodel'], function(extend, MatchModel) {
  /**
   * Constructor
   *
   * @param match
   *          a valid match to reference
   * @param teamlist
   *          a list of teams which maps an internal id (index within the
   *          tournament) the the external id (global team id)
   */
  function MatchReferenceModel(match, teamlist) {
    var teams;

    if (teamlist) {
      teams = match.teams.map(function(teamid) {
        return teamlist.get(teamid);
      });
    } else {
      teams = match.teams.slice();
    }
    MatchReferenceModel.superconstructor.call(this, teams, match.id,
        match.group);

    this.match = match;
    match.registerListener(this);
  }
  extend(MatchReferenceModel, MatchModel);

  /**
   * forward the finish()-call to the referenced match
   *
   * @param score
   *          an array of points for each team. Lengths have to match!
   * @return true on success, undefined otherwise
   */
  MatchReferenceModel.prototype.finish = function(score) {
    if (this.match.finish(score) === undefined) {
      return undefined;
    }
    return true;
  };

  /**
   * Forward the "finish"-event to notify listeners about a finished match
   *
   * The re-emitted event does not contain the result of the match, which is to
   * be processed at the lowest level, i.e. within the tournament.
   *
   * This function also unregisters from the match itself to avoid memory leaks.
   * The current specification disallows any events after 'finish'.
   */
  MatchReferenceModel.prototype.onfinish = function() {
    this.match.unregisterListener(this);
    this.emit('finish');
  };

  return MatchReferenceModel;
});
