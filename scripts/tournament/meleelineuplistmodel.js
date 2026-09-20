/**
 * The team list a Supermêlée hands to the match views.
 *
 * A mêlée match is played by a line-up — two or three players drawn
 * for this round — which is not a registered team and therefore not
 * in the global team list. The views resolve a match side through
 * `teamlist.get(id)`, so this stands in for the global list and
 * composes the line-up's team on demand.
 *
 * The composed teams are cached: a TeamModel registers itself with
 * its players, so rebuilding one on every redraw would pile up
 * listeners on the PlayerModels.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import ListModel from '../list/listmodel.js'
import TeamModel from '../ui/teammodel.js'

class MeleeLineupListModel extends ListModel {
  /**
   * @param tournament
   *          a MeleeTournamentModel instance
   * @param teamlist
   *          the global team list, i.e. the registered players
   */
  constructor (tournament, teamlist) {
    super()
    this.makeReadonly()
    this.tournament = tournament
    this.teamlist = teamlist
    this.cache = []
  }

  /**
   * @param lineupid
   *          the index of a drawn line-up
   * @return a TeamModel of the line-up's players
   */
  get (lineupid) {
    if (this.cache[lineupid] === undefined) {
      const lineup = this.tournament.getLineup(lineupid) || []
      const players = lineup.map(function (playerid) {
        const team = this.teamlist.get(this.tournament.teams.get(playerid))
        return team && team.getPlayer(0)
      }, this)
      this.cache[lineupid] = new TeamModel(players, lineupid)
    }
    return this.cache[lineupid]
  }
}

export default MeleeLineupListModel
