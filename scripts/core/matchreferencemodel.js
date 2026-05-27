import MatchModel from './matchmodel.js'

/**
 * Constructor
 *
 * @param match
 *          a valid match to reference
 * @param teamlist
 *          a list of teams which maps an internal id (index within the
 *          tournament) the the external id (global team id)
 */
class MatchReferenceModel extends MatchModel {
  constructor (match, teamlist) {
    const teams = teamlist
      ? match.teams.map(teamid => teamlist.get(teamid))
      : match.teams.slice()
    super(teams, match.id, match.group, match.place)
    this.match = match
    this.updateTeams = function () {
      if (teamlist) {
        this.teams = this.match.teams.map(function (teamid) {
          return teamlist.get(teamid)
        })
      } else {
        this.teams = this.match.teams.slice()
      }
    }
    this.updatePlace = function () {
      this.place = this.match.place
    }
    match.registerListener(this)
  }

  /**
   * forward the finish()-call to the referenced match
   *
   * @param score
   *          an array of points for each team. Lengths have to match!
   * @return true on success, undefined otherwise
   */
  finish (score) {
    if (this.match.finish(score) === undefined) {
      return undefined
    }
    return true
  }

  /**
   * Forward the "finish"-event to notify listeners about a finished match
   *
   * The re-emitted event does not contain the result of the match, which is to
   * be processed at the lowest level, i.e. within the tournament.
   *
   * This function also unregisters from the match itself to avoid memory leaks.
   * The current specification disallows any events after 'finish'.
   */
  onfinish () {
    this.match.unregisterListener(this)
    this.emit('finish')
  }

  onupdate () {
    this.updateTeams()
    this.updatePlace()
    this.emit('update')
  }
}

export default MatchReferenceModel
