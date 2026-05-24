import RankingDataListener from './rankingdatalistener.js';
import VectorModel from '../math/vectormodel.js';
import Options from 'options';

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingLostPointsListener extends RankingDataListener {
  constructor(ranking) {
    super(ranking, new VectorModel());
  }

  /**
   * insert the results of a game into the ranking.
   *
   * We cannot make the assumption that there's only one opponent. That's why we
   * iterate over every team as a possible opponent and apply his points to
   * every other team's lostpoints vector.
   *
   * @param r
   *          the emitting RankingModel instance. Please ignore.
   * @param e
   *          the name of the emitted event
   * @param result
   *          a game result
   */
  onresult(r, e, result) {
    result.teams.forEach(function (opponent, index) {
      result.teams.forEach(function (team) {
        if (team !== opponent) {
          this.lostpoints.set(team, this.lostpoints.get(team) - result.score[index]);
        }
      }, this);
    }, this);
  }

  /**
   * account for bye points
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
      this.lostpoints.set(teamid, this.lostpoints.get(teamid) - Options.byepointslost);
    }, this);
  }

  /**
   * correct a ranking entry. Do not check whether it's valid. The
   * TournamentModel has to take care of that
   *
   * @param r
   *          the Emitter, i.e. a RankingModel instance
   * @param e
   *          the event type, i.e. "bye"
   * @param correction
   *          a game correction
   */
  oncorrect(r, e, correction) {
    correction.before.teams.forEach(function (opponent, index) {
      correction.before.teams.forEach(function (team) {
        if (team !== opponent) {
          this.lostpoints.set(team, this.lostpoints.get(team) + correction.before.score[index]);
        }
      }, this);
    }, this);
    this.onresult(r, e, correction.after);
  }

  static NAME = 'lostpoints';
  static DEPENDENCIES = undefined;
}

export default RankingLostPointsListener;