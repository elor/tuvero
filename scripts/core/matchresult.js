import MatchModel, { _registerMatchResult } from './matchmodel.js'
function min (array) {
  return Math.min.apply(Math, array)
}
function max (array) {
  return Math.max.apply(Math, array)
}

/**
 * Constructor
 *
 * @param match
 *          a MatchModel instance of which the result is to be kept
 * @param score
 *          an array of scored points
 */
class MatchResult extends MatchModel {
  constructor (match, score) {
    super(match && match.teams, match && match.id, match && match.group)

    // empty default constructor for list-based construction
    if (score === undefined) {
      this.score = []
      return
    }
    if (this.teams.length !== score.length) {
      throw new Error('MatchResult(): array lengths differ: ' + this.teams.length + '<>' + score.length)
    }
    this.score = score.slice(0)
  }

  /**
   * @return true if this result is a bye, false otherwise
   */
  isBye () {
    return this.isResult() && this.length === 2 && this.getTeamID(0) === this.getTeamID(1)
  }

  /**
   * crude save function as if it was ripped right out of the Model class.
   *
   * @return a serializable data object on success, undefined otherwise
   */
  save () {
    const data = super.save()
    data.s = this.score
    return data
  }

  /**
   * restore from a serialized data object
   *
   * @param data
   *          the data object
   * @return true on success, false otherwise
   */
  restore (data) {
    if (!super.restore(data)) {
      return false
    }
    this.score = data.s
    return true
  }

  getWinner () {
    let winner
    const maxpoints = max(this.score)
    const winnerIndex = this.score.indexOf(maxpoints)
    if (winnerIndex === this.score.lastIndexOf(maxpoints)) {
      winner = this.teams[winnerIndex]
      return winner
    }
    return undefined
  }

  getLoser () {
        const minpoints = min(this.score)
    const loser = this.teams[this.score.indexOf(minpoints)]
    const loser2 = this.teams[this.score.lastIndexOf(minpoints)]
    if (loser === loser2) {
      return loser
    }
    return undefined
  }
}

_registerMatchResult(MatchResult)

/**
 * Disable the finish() function
 */
MatchResult.prototype.finish = undefined

MatchResult.prototype.SAVEFORMAT = Object.create(MatchModel.prototype.SAVEFORMAT)
MatchResult.prototype.SAVEFORMAT.s = [Number]
export default MatchResult
