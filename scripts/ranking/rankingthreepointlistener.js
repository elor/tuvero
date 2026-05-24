import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingThreePointListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, // autoformat
    new VectorModel());
  }

  /**
   * insert the results of a game into the ranking.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  onresult(r, e, result) {
    let winner, maxpoints;
    winner = result.getWinner();
    if (winner !== undefined) {
      this.threepoint.add(winner, 3);
    } else {
      maxpoints = Math.max.apply(Math, result.score);
      result.teams.forEach(function (teamid, index) {
        if (result.score[index] === maxpoints) {
          this.threepoint.add(teamid, 1);
        }
      }, this);
    }
  }

  /**
   * add bye-related "threepoint"
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "bye"
   * @param teams
   *          an array of team ids
   */
  onbye(r, e, data) {
    data.teams.forEach(function (teamid) {
      this.threepoint.add(teamid, 3);
    }, this);
  }

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "correct"
   * @param correction
   *          a game correction
   */
  oncorrect(r, e, correction) {
    let winner, maxpoints;
    winner = correction.before.getWinner();
    if (winner !== undefined) {
      this.threepoint.set(winner, this.threepoint.get(winner) - 3);
    } else {
      maxpoints = Math.max.apply(Math, correction.before.score);
      correction.before.teams.forEach(function (teamid, index) {
        if (correction.before.score[index] === maxpoints) {
          this.threepoint.set(teamid, this.threepoint.get(teamid) - 1);
        }
      }, this);
    }
    this.onresult(r, e, correction.after);
  }

  static NAME = 'threepoint';
  static DEPENDENCIES = undefined;
}

export default RankingThreePointListener;