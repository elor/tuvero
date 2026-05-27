import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingBuchholzListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, new VectorModel())
  }

  onrecalc () {
    this.gamematrix.multVector(this.finebuchholz, this.buchholz)
  }

  static NAME = 'finebuchholz'
  static DEPENDENCIES = ['gamematrix', 'buchholz']
}

export default RankingBuchholzListener
