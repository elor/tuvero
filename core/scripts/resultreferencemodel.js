/**
 * ResultReferenceModel: Reference a result in all regards, but map the teams
 * from their tournament-specific id to the global id.
 *
 * @return ResultReferenceModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './matchresult', './matchreferencemodel'], function(
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
    var matchRef = new MatchReferenceModel(result, teamlist);
    ResultReferenceModel.superconstructor.call(this, matchRef, result.score);

    this.result = result;
  }
  extend(ResultReferenceModel, MatchResult);

  return ResultReferenceModel;
});
