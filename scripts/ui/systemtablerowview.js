/**
 * SystemTableRowView
 *
 * @return SystemTableRowView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import TeamView from './teamview.js'
import NewTournamentView from './newtournamentview.js'
import TeamDeleteController from './teamdeletecontroller.js'

/**
 * Constructor
 *
 * @param index
 *          the team index for this line
 * @param $view
 *          the DOM element of a single table row
 * @param teams
 *          a ListModel of TeamModels
 * @param tournaments
 *          a ListModel of TournamentModels
 * @param viewPopulator
 *          a TournamentViewPopulator instance for creation of the ".system"
 *          cells
 */
class SystemTableRowView extends View {
  constructor (index, $view, teams, tournaments, viewPopulator, $newTournamentTemplate) {
    super(teams.get(index), $view)
    this.teamID = index
    this.teams = teams
    this.tournaments = tournaments
    this.teamView = new TeamView(this.model, this.$view)
    this.teamDeleteController = new TeamDeleteController(this)
    this.tournamentRank = -1
    this.globalRank = -1
    this.updatepending = undefined
    this.$tournamentrank = this.$view.find('.tournamentrank')
    this.$globalrank = this.$view.find('.rank')
    this.tournamentView = undefined
    this.viewPopulator = viewPopulator
    this.updateEverything()
    this.teams.registerListener(this)
    this.tournaments.registerListener(this)
  }

  updateRankTexts () {
    let ranking, globalRank, tournamentRank
    ranking = this.tournaments.getGlobalRanking(this.teams.length)
    globalRank = ranking.globalRanks[this.teamID]
    tournamentRank = ranking.tournamentRanks[this.teamID]
    if (this.globalRank !== globalRank) {
      this.$globalrank.text(globalRank + 1)
      this.globalRank = globalRank
    }
    if (this.tournamentRank !== tournamentRank) {
      this.$tournamentrank.text(tournamentRank + 1)
      this.tournamentRank = tournamentRank
    }
  }

  /**
   * adds/removes the .lastrow class on demand
   *
   * @param ranking
   *          a global ranking object
   */
  updateLastRowClass () {
    let tournamentID, displayID, nextTeamID, nextTournamentID, ranking
    ranking = this.getRanking()
    tournamentID = this.getTournamentID()
    displayID = this.getDisplayID()
    if (displayID + 1 === this.teams.length) {
      this.$view.addClass('lastrow')
      return
    }
    nextTeamID = ranking.displayOrder[displayID + 1]
    nextTournamentID = ranking.tournamentIDs[nextTeamID]
    if (tournamentID !== nextTournamentID) {
      this.$view.addClass('lastrow')
    } else {
      this.$view.removeClass('lastrow')
    }
  }

  /**
   * finds out if the current team is the first team in the tournament and
   * creates a new TournamentView, if necessary.
   */
  updateSystem () {
    let tournament, newView, $view
    if (!this.isFirstInTournament()) {
      this.clearTournamentView()
      this.$view.removeClass('firstrow')
      return
    }
    tournament = this.getTournament()
    if (tournament) {
      if (this.viewPopulator.getViewTeamID(this.getTournamentID()) === this.teamID) {
        return
      }
      newView = this.viewPopulator.getCachedView(this.getTournamentID(), this.teamID)
    } else {
      $view = $('<td>').addClass('system')
      this.viewPopulator.populate(tournament, $view)
      newView = new NewTournamentView(this.getDisplayID(), this.estimateNewTournamentSize(), $view, this.tournaments, this.teams)
    }
    this.clearTournamentView()
    this.tournamentView = newView
    $view = this.tournamentView.$view
    this.$view.append($view)
    this.$view.addClass('firstrow')
  }

  estimateNewTournamentSize () {
    const ranking = this.getRanking()
    const displayID = this.getDisplayID()
    const tournamentID = this.getTournamentID()
    const rankingLength = ranking.displayOrder.length
    let nextDisplayID = displayID + 1
    let nextTeamID
    for (; nextDisplayID < rankingLength; nextDisplayID += 1) {
      nextTeamID = ranking.displayOrder[nextDisplayID]
      if (ranking.tournamentIDs[nextTeamID] !== tournamentID) {
        break
      }
    }
    const tournamentSize = nextDisplayID - displayID
    return tournamentSize
  }

  updateEverything () {
    this.updateRankTexts()
    this.updateLastRowClass()
    this.updateSystem()
  }

  onupdate (emitter, event, data) {
    const rowview = this
    if (emitter === this.tournaments) {
      if (this.updatepending === undefined) {
        this.updatepending = true
        window.setTimeout(function () {
          rowview.updateEverything()
          rowview.updatepending = undefined
        }, 1)
      }
    }
  }

  oninsert (emitter, event, data) {
    if (emitter === this.teams) {
      this.updateEverything()
    }
  }

  onremove (emitter, event, data) {
    if (emitter === this.teams) {
      this.updateEverything()
    }
  }

  destroy () {
    this.clearTournamentView()
    super.destroy()
  }

  getDisplayID () {
    const ranking = this.getRanking()
    const displayID = ranking.displayOrder.indexOf(this.teamID)
    return displayID
  }

  getTournamentID () {
    const ranking = this.tournaments.getGlobalRanking(this.teams.length)
    const tournamentID = ranking.tournamentIDs[this.teamID]
    return tournamentID
  }

  getRanking () {
    return this.tournaments.getGlobalRanking(this.teams.length)
  }

  isFirstInTournament () {
    const displayID = this.getDisplayID()
    const tournamentID = this.getTournamentID()
    const ranking = this.getRanking()
    let isFirstInTournament = false
    if (displayID === 0) {
      isFirstInTournament = true
    } else {
      const previousTeamID = ranking.displayOrder[displayID - 1]
      if (ranking.tournamentIDs[previousTeamID] !== tournamentID) {
        isFirstInTournament = true
      }
    }
    return isFirstInTournament
  }

  getTournament () {
    return this.tournaments.get(this.getTournamentID())
  }

  clearTournamentView () {
    if (this.tournamentView) {
      if (this.tournamentView.$view.parent().is(this.$view)) {
        this.tournamentView.$view.detach()
      }
      this.tournamentView = undefined
    }
  }
}

export default SystemTableRowView
