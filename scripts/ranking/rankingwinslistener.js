/**
 * RankingWinsListener
 *
 * @return RankingWinsListener
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ranking/rankingdatalistener', 'math/vectormodel'],
  function (extend, RankingDataListener, VectorModel) {
    /**
     * Constructor
     *
     * @param ranking
     *          a RankingModel instance
     */
    function RankingWinsListener (ranking) {
      RankingWinsListener.superconstructor.call(this, ranking, // autoformat
        new VectorModel())
    }
    extend(RankingWinsListener, RankingDataListener)

    RankingWinsListener.NAME = 'wins'
    RankingWinsListener.DEPENDENCIES = undefined

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
    RankingWinsListener.prototype.onresult = function (r, e, result) {
      var winner = result.getWinner()

      if (winner !== undefined) {
        this.wins.add(winner, 1)
      }
    }

    /**
     * add bye-related "wins"
     *
     * @param r
     *          the Emitter, i.e. a RankingModel instance
     * @param e
     *          the event type, i.e. "bye"
     * @param teams
     *          an array of team ids
     */
    RankingWinsListener.prototype.onbye = function (r, e, teams) {
      teams.forEach(function (teamid) {
        this.wins.add(teamid, 1)
      }, this)
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
    RankingWinsListener.prototype.oncorrect = function (r, e, correction) {
      var winner = correction.before.getWinner()

      if (winner !== undefined) {
        this.wins.set(winner, this.wins.get(winner) - 1)
      }

      this.onresult(r, e, correction.after)
    }

    return RankingWinsListener
  })
