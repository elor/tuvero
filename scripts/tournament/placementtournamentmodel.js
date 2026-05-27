import TournamentModel from './tournamentmodel.js'
import MatchModel from '../core/matchmodel.js'
import ByeResult from '../core/byeresult.js'
import Options from 'options'

/**
   * Constructor
   */
class PlacementTournamentModel extends TournamentModel {
  constructor () {
    super(['placement', 'wins'])
  }

  /**
     * create the initial matches for the registered teams
     *
     * @return true on success, false otherwise
     */
  initialMatches () {
    let teams, match, matchID
    const indices = this.teams.map(function (teamid, index) {
      return index
    })
    matchID = 0
    while (indices.length > 0) {
      teams = indices.splice(0, 2)
      if (teams[1] === undefined) {
        match = new ByeResult(teams[0], [Options.byepointswon, Options.byepointslost], matchID, 0)
        this.history.push(match)
      } else {
        match = new MatchModel(teams, matchID, 0)
        this.matches.push(match)
      }
      matchID += 1
    }
    return true
  }

  /**
     * should never be called since KO tournaments can't be idle, only finished
     */
  idleMatches () {
    throw new Error('KO Tournaments cannot be in idle state.' + ' This function can never be called by the TournamentModel.')
  }

  postprocessMatch (matchresult) {
    if (this.matches.length === 0) {
      this.state.set('finished')
    }
  }
}

PlacementTournamentModel.prototype.SYSTEM = 'placement'

export default PlacementTournamentModel
