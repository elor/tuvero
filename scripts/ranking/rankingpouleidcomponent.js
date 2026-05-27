import RankingComponent from './rankingcomponent.js'

class RankingPouleIDComponent extends RankingComponent {

  value (i) {
    return Number(this.ranking.pouleid.get(i)) + 1
  }

  compare (i, k) {
    return this.value(i) - this.value(k) || this.nextcomponent.compare(i, k)
  }

  static NAME = 'pouleid'
  static DEPENDENCIES = undefined
}

export default RankingPouleIDComponent
