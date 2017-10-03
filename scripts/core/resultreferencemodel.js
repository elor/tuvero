/**
 * ResultReferenceModel: Reference a result in all regards, but map the teams
 * from their tournament-specific id to the global id.
 *
 * @return ResultReferenceModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/matchresult', 'core/matchreferencemodel'], function(
    extend, MatchResult, MatchReferenceModel) {
  /**
   * Constructor
   *
   * @param result
   *          a MatchResult instance
   * @param teamlist
   *          a ListModel instance of team ids, which is used for team mapping
   */
  function ResultReferenceModel(result, teamlist) {
    var matchRef;

    if (result instanceof MatchResult) {
      matchRef = new MatchReferenceModel(result, teamlist);
      ResultReferenceModel.superconstructor.call(this, matchRef, result.score);
      this.result = result;
    } else {
      MatchReferenceModel.call(this, result, teamlist);
      this.finish = MatchReferenceModel.prototype.finish;
    }
  }
  extend(ResultReferenceModel, MatchResult);

  return ResultReferenceModel;
});
