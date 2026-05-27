import TournamentModel from './tournamentmodel.js'
import MatchModel from '../core/matchmodel.js'
import Type from '../core/type.js'

/**
 * Constructor
 *
 * @param rankingorder
 *          the order of the ranking
 */
class RoundTournamentModel extends TournamentModel {
  constructor (rankingorder) {
    super(rankingorder)
    this.round = -1
  }

  /**
   * create all matches during the initial->running transition
   *
   * @return true on success, false otherwise
   */
  initialMatches () {
    this.round = 0
    if (this.teams.length < 2) {
      return false
    }
    RoundTournamentModel.generateSlideSystemMatches.call(this)
    return true
  }

  /**
   * create all matches during the idle->running transition
   *
   * @return true on success, false otherwise
   */
  idleMatches () {
    this.round += 1
    RoundTournamentModel.generateSlideSystemMatches.call(this)
    this.emit('update')
    return true
  }

  runningMatches () {
    if (this.isLastRound()) {
      return false
    }
    return this.idleMatches()
  }

  isLastRound () {
    return this.round >= this.numRounds() - 1
  }

  /**
   * @param matchresult
   *          Ignored.
   */
  postprocessMatch (matchresult) {
    if (this.matches.length === 0) {
      if (this.isLastRound()) {
        this.state.set('finished')
      }
    }
  }

  /**
   * @return the current or recently finished round. returns -1 if the
   *         tournament hasn't been started yet
   */
  getRound () {
    return this.round
  }

  /**
   * @return the total number of rounds.
   */
  numRounds () {
    if (this.teams.length % 2) {
      // tournaments with odd teams take one round longer due to the byes
      return this.teams.length
    }
    return this.teams.length - 1
  }

  /**
   * write the round to the data object
   *
   * @return a serializable data object
   */
  save () {
    const data = super.save()
    data.round = this.round
    return data
  }

  /**
   * restore the state form a data object, including this.round
   *
   * @param data
   *          a deserialized data object
   * @return true on success, false otherwise
   */
  restore (data) {
    if (!super.restore(data)) {
      return false
    }
    this.round = data.round
    return true
  }

  /**
   * use the slide system to generate a roundtournament. "this" is required to
   * be a RoundTournamentModel instance.
   */
  static generateSlideSystemMatches () {
    let teamA, teamB, id
    const slideList = RoundTournamentModel.generateSlideList(this.teams.length, this.round)
    if (slideList.length % 2 === 1) {
      teamA = slideList.pop()
      this.addBye(teamA, slideList.length / 2, this.round)
    }
    id = 0
    while (slideList.length > 1) {
      teamA = slideList.shift()
      teamB = slideList.pop()
      if (teamA > this.teams.length) {
        this.addBye(teamB, id, this.round)
      } else if (teamB > this.teams.length) {
        // teamB is a phantom bye slot — skip this pairing
      } else {
        this.matches.push(new MatchModel([teamA, teamB], id, this.round))
      }
      id += 1
    }
  }

  /**
   * @param numteams
   *          the number of teams
   * @param round
   *          the round, starting with 0.
   * @return an array of teams in a clockwise slide order, starting with the
   *         first team. Undefined on error.
   */
  static generateSlideList (numteams, round) {
    let teams, slideteam
    if (!Type.isNumber(numteams) || !Type.isNumber(round)) {
      return undefined
    }
    if (round <= 0) {
      teams = []
      while (teams.length < numteams) {
        teams.push(teams.length)
      }
    } else {
      teams = RoundTournamentModel.generateSlideList(numteams, round - 1)
      slideteam = teams.splice(numteams - 1, 1)[0]

      // numteams even: skip first player, odd: first player is shifted, too
      teams.splice(1 - numteams % 2, 0, slideteam)
    }
    return teams
  }
}

RoundTournamentModel.prototype.SYSTEM = 'round'

/**
 * add "round" to the data object
 */
RoundTournamentModel.prototype.SAVEFORMAT = Object.create(TournamentModel.prototype.SAVEFORMAT)
RoundTournamentModel.prototype.SAVEFORMAT.round = Number
export default RoundTournamentModel
