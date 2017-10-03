/**
 * RankingVotesListener
 *
 * @return RankingVotesListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/vectormodel'], function(
    extend, RankingDataListener, VectorModel) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingVotesListener(ranking) {
    RankingVotesListener.superconstructor
        .call(this, ranking, new VectorModel());
  }
  extend(RankingVotesListener, RankingDataListener);

  RankingVotesListener.NAME = 'votes';
  RankingVotesListener.DEPENDENCIES = ['upvotes', 'downvotes', 'byes'];

  RankingVotesListener.prototype.onrecalc = function() {
    this.votes.map(function(oldVote, teamID) {
      var i, string;

      string = '';

      // byes
      for (i = 0; i < this.byes.get(teamID); i += 1) {
        string += '∅';
      }

      // upvotes
      for (i = 0; i < this.upvotes.get(teamID); i += 1) {
        string += '▲';
      }

      // downvotes
      for (i = 0; i < this.downvotes.get(teamID); i += 1) {
        string += '▼';
      }

      this.votes.set(teamID, string);
    }, this);
  };

  return RankingVotesListener;
});
