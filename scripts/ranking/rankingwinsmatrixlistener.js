/**
 * RankingWinsMatrixListener, a matrix that represents how often a team has won
 * against another team. Does not represent byes
 *
 * @return RankingWinsMatrixListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/matrixmodel'], function(
    extend, RankingDataListener, MatrixModel) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingWinsMatrixListener(ranking) {
    RankingWinsMatrixListener.superconstructor.call(this, ranking,
        new MatrixModel());
  }
  extend(RankingWinsMatrixListener, RankingDataListener);

  RankingWinsMatrixListener.NAME = 'winsmatrix';

  /**
   * insert the game results into the ranking
   *
   * This one is tricky... To enable arbitrary numbers of players, there's no
   * direct comparison, but the highest points and whether they appear multiple
   * times (-> draw) are determined. Then, for every player with the highest
   * points, the score is increased by 1 if he's the only winner or 0.5 if he
   * shared the victory. That way, arbitrary numbers of players and winners are
   * possible
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  RankingWinsMatrixListener.prototype.onresult = function(r, e, result) {
    var maxpoints, draw, score;

    // get the max points, remember if there's a draw
    maxpoints = undefined;
    draw = false;
    result.score.forEach(function(points) {
      if (points > maxpoints || maxpoints === undefined) {
        maxpoints = points;
        draw = false;
      } else if (points === maxpoints) {
        draw = true;
      }
    }, this);

    // only give half the score for a draw
    score = draw ? 0.5 : 1;

    // find every winner and apply the score over his opponents (i.e. everyone
    // else)
    result.score.forEach(function(points, index) {
      var teamid;
      if (points === maxpoints) {
        teamid = result.teams[index];
        result.teams.forEach(function(opponent) {
          var value;
          if (teamid !== opponent) {
            value = this.winsmatrix.get(teamid, opponent) + score;
            this.winsmatrix.set(teamid, opponent, value);
          }
        }, this);
      }
    }, this);
  };

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the emitter, i.e. a RankingModel instance
   * @param e
   *          the event, i.e. "correct"
   * @param correction
   *          a game correction
   */
  RankingWinsMatrixListener.prototype.oncorrect = function(r, e, correction) {
    // TODO DRY - Don't Repeat Yourself!
    // TODO extract a method for use by onresult and oncorrect
    var maxpoints, draw, score;

    // get the max points, remember if there's a draw
    maxpoints = undefined;
    draw = false;
    correction.before.score.forEach(function(points) {
      if (points > maxpoints || maxpoints === undefined) {
        maxpoints = points;
        draw = false;
      } else if (points === maxpoints) {
        draw = true;
      }
    }, this);

    // only give half the score for a draw
    score = draw ? 0.5 : 1;

    // find every winner and apply the score over his opponents (i.e. everyone
    // else)
    correction.before.score.forEach(function(points, index) {
      var teamid;
      if (points === maxpoints) {
        teamid = correction.before.teams[index];
        correction.before.teams.forEach(function(opponent) {
          var value;
          if (teamid !== opponent) {
            value = this.winsmatrix.get(teamid, opponent) - score;
            this.winsmatrix.set(teamid, opponent, value);
          }
        }, this);
      }
    }, this);

    this.onresult(r, e, correction.after);
  };

  return RankingWinsMatrixListener;
});
