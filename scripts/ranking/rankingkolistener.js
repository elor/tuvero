import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

// Set by kotournamentmodel.js after initialization to break the circular import cycle
let _KOTournamentModel = null
export function _registerKOTournamentModel (cls) {
  _KOTournamentModel = cls
}

function getWinnerPoints (result) {
  return -2 * result.getGroup()
}
function getLoserPoints (result) {
  const group = result.getGroup()
  const matchID = result.getID()
  if (matchID <= 1) {
    return -2 * group - 1
  } else {
    return -2 * _KOTournamentModel.loserGroupID(group, matchID)
  }
}

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingKOListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, // autoformat
      new VectorModel())
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
  onresult (r, e, result) {
    this.ko.set(result.getLoser(), getLoserPoints(result))
    this.ko.set(result.getWinner(), getWinnerPoints(result))
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
  oncorrect (r, e, correction) {
    let winner, loser, winnerPoints, loserPoints
    winner = correction.before.getWinner()
    loser = correction.before.getWinner()
    winnerPoints = getWinnerPoints(correction.before)
    loserPoints = getLoserPoints(correction.before)
    if (this.ko.get(winner) !== winnerPoints || this.ko.get(loser) !== loserPoints) {
      return
    }
    this.onresult(r, e, correction.after)
  }

  static NAME = 'ko'
  static DEPENDENCIES = undefined
}

export default RankingKOListener
