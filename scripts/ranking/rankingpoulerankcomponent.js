import RankingComponent from './rankingcomponent.js'

class RankingPouleRankComponent extends RankingComponent {
  value (i) {
    return Number(this.ranking.poulerank.get(i)) + 1
  }

  compare (i, k) {
    return this.value(i) - this.value(k) || this.nextcomponent.compare(i, k)
  }

  static NAME = 'poulerank'
  static DEPENDENCIES = ['poulerank', 'wins', 'saldo', 'points']
}

export default RankingPouleRankComponent
