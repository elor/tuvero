/**
 * ByeResult
 *
 * @return ByeResult
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/matchresult', 'core/matchmodel'], function(extend,
    MatchResult, MatchModel) {
  /**
   * Constructor for auto-creation of a bye instance, which contains all
   * relevant data, and matches the MatchResult interface.
   *
   * If both teams have the same id, it's a bye
   *
   * save() and restore() work with the MatchResult, too, which is necessary for
   * tournamentmodel.save()/restore(). Corrections, on the other hand, are not
   * supposed to be used with byes, but can work, too.
   *
   * @param teamid
   *          the internal id of the team which gets the bye
   * @param score
   *          the score of the bye, a two-element-array. (e.g. [13, 7]). For
   *          displaying only, not supposed to be used for actual result
   *          calculations.
   * @param id
   *          id of the bye. Similar to the match id.
   * @param group
   *          the group of the bye. Similar to the match group.
   *
   */
  function ByeResult(teamid, score, id, group) {
    ByeResult.superconstructor.call(this, new MatchModel([teamid, teamid], id,
        group), score);
  }
  extend(ByeResult, MatchResult);

  return ByeResult;
});
