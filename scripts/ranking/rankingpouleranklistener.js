import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

class RankingPouleRankListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, new VectorModel())
  }

  onresult (r, e, result) {
    const ranks = this.ranking.tournament.getRanksFromTable(result.getID(), result.getGroup())
    if (ranks) {
      this.poulerank.set(result.getWinner(), ranks.winner)
      this.poulerank.set(result.getLoser(), ranks.loser)
    }
  }

  oncorrect (r, e, correction) {
    this.onresult(r, e, correction.after)
  }

  static NAME = 'poulerank'
  static DEPENDENCIES = undefined
}

export default RankingPouleRankListener
