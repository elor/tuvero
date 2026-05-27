import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

class RankingPouleIDListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, new VectorModel())
  }

  onresult (r, e, result) {
    const poule = result.getGroup()
    result.teams.forEach(function (teamid) {
      this.pouleid.set(teamid, poule)
    }, this)
  }

  oncorrect (r, e, correction) {
    this.onresult(r, e, correction.after)
  }

  static NAME = 'pouleid'
  static DEPENDENCIES = undefined
}

export default RankingPouleIDListener
