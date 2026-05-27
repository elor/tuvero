import RankingDataListener from './rankingdatalistener.js'
import VectorModel from '../math/vectormodel.js'

/**
 * Constructor
 *
 * @param ranking
 *          a RankingModel instance
 */
class RankingVotesListener extends RankingDataListener {
  constructor (ranking) {
    super(ranking, new VectorModel())
  }

  onrecalc () {
    this.votes.map(function (oldVote, teamID) {
      let i, string
      string = ''

      // byes
      for (i = 0; i < this.byes.get(teamID); i += 1) {
        string += '∅'
      }

      // upvotes
      for (i = 0; i < this.upvotes.get(teamID); i += 1) {
        string += '▲'
      }

      // downvotes
      for (i = 0; i < this.downvotes.get(teamID); i += 1) {
        string += '▼'
      }
      this.votes.set(teamID, string)
    }, this)
  }

  static NAME = 'votes'
  static DEPENDENCIES = ['upvotes', 'downvotes', 'byes']
}

export default RankingVotesListener
