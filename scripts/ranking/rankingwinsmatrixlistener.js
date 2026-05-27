import RankingDataListener from './rankingdatalistener.js'
import MatrixModel from '../math/matrixmodel.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingWinsMatrixListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, new MatrixModel())
  }

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
  onresult (r, e, result) {
    let maxpoints, draw, score

    // get the max points, remember if there's a draw
    maxpoints = undefined
    draw = false
    result.score.forEach(function (points) {
      if (points > maxpoints || maxpoints === undefined) {
        maxpoints = points
        draw = false
      } else if (points === maxpoints) {
        draw = true
      }
    }, this)

    // only give half the score for a draw
    score = draw ? 0.5 : 1

    // find every winner and apply the score over his opponents (i.e. everyone
    // else)
    result.score.forEach(function (points, index) {
      let teamid
      if (points === maxpoints) {
        teamid = result.teams[index]
        result.teams.forEach(function (opponent) {
          let value
          if (teamid !== opponent) {
            value = this.winsmatrix.get(teamid, opponent) + score
            this.winsmatrix.set(teamid, opponent, value)
          }
        }, this)
      }
    }, this)
  }

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
  oncorrect (r, e, correction) {
    // TODO DRY - Don't Repeat Yourself!
    // TODO extract a method for use by onresult and oncorrect
    let maxpoints, draw, score

    // get the max points, remember if there's a draw
    maxpoints = undefined
    draw = false
    correction.before.score.forEach(function (points) {
      if (points > maxpoints || maxpoints === undefined) {
        maxpoints = points
        draw = false
      } else if (points === maxpoints) {
        draw = true
      }
    }, this)

    // only give half the score for a draw
    score = draw ? 0.5 : 1

    // find every winner and apply the score over his opponents (i.e. everyone
    // else)
    correction.before.score.forEach(function (points, index) {
      let teamid
      if (points === maxpoints) {
        teamid = correction.before.teams[index]
        correction.before.teams.forEach(function (opponent) {
          let value
          if (teamid !== opponent) {
            value = this.winsmatrix.get(teamid, opponent) - score
            this.winsmatrix.set(teamid, opponent, value)
          }
        }, this)
      }
    }, this)
    this.onresult(r, e, correction.after)
  }

  static NAME = 'winsmatrix'
}

export default RankingWinsMatrixListener
