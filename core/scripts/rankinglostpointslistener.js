/**
 * RankingLostPointsListener
 *
 * @return RankingLostPointsListener
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './rankingdatalistener', './vectormodel', //
'options'], function(extend, RankingDataListener, VectorModel, Options) {
  /**
   * Constructor
   *
   * @param ranking
   *          a RankingModel instance
   */
  function RankingLostPointsListener(ranking) {
    RankingLostPointsListener.superconstructor.call(this, ranking,
        new VectorModel());
  }
  extend(RankingLostPointsListener, RankingDataListener);

  RankingLostPointsListener.NAME = 'lostpoints';
  RankingLostPointsListener.DEPENDENCIES = undefined;

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
  RankingLostPointsListener.prototype.onresult = function(r, e, result) {
    result.teams.forEach(function(opponent, index) {
      result.teams.forEach(function(team) {
        if (team !== opponent) {
          this.lostpoints.set(team, this.lostpoints.get(team)
              - result.score[index]);
        }
      }, this);
    }, this);
  };

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
  RankingLostPointsListener.prototype.onbye = function(r, e, teams) {
    teams.forEach(function(teamid) {
      this.lostpoints.set(teamid, this.lostpoints.get(teamid)
          - Options.byepointslost);
    }, this);
  };

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
  RankingLostPointsListener.prototype.oncorrect = function(r, e, correction) {
    correction.before.teams.forEach(function(opponent, index) {
      correction.before.teams.forEach(function(team) {
        if (team !== opponent) {
          this.lostpoints.set(team, this.lostpoints.get(team)
              + correction.before.score[index]);
        }
      }, this);

      this.onresult(r, e, correction.after);
    }, this);
  };

  return RankingLostPointsListener;
});
