/**
 * SystemTableRowView
 *
 * @return SystemTableRowView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/view', 'ui/teamview',
  'ui/newtournamentview', 'ui/teamdeletecontroller'
], function ($, extend, View, TeamView, NewTournamentView, TeamDeleteController) {
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
  function SystemTableRowView (index, $view, teams, tournaments, viewPopulator,
    $newTournamentTemplate) {
    SystemTableRowView.superconstructor.call(this, teams.get(index), $view)

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
  extend(SystemTableRowView, View)

  SystemTableRowView.prototype.updateRankTexts = function () {
    var ranking, globalRank, tournamentRank

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
  SystemTableRowView.prototype.updateLastRowClass = function () {
    var tournamentID, displayID, nextTeamID, nextTournamentID, ranking

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
  SystemTableRowView.prototype.updateSystem = function () {
    var tournament, newView, $view

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

      newView = new NewTournamentView(this.getDisplayID(),
        this.estimateNewTournamentSize(), $view, this.tournaments, this.teams)
    }

    this.clearTournamentView()
    this.tournamentView = newView

    $view = this.tournamentView.$view
    this.$view.append($view)
    this.$view.addClass('firstrow')
  }

  SystemTableRowView.prototype.estimateNewTournamentSize = function () {
    var ranking = this.getRanking()
    var displayID = this.getDisplayID()
    var tournamentID = this.getTournamentID()

    var rankingLength = ranking.displayOrder.length
    var nextDisplayID = displayID + 1
    var nextTeamID
    for (; nextDisplayID < rankingLength; nextDisplayID += 1) {
      nextTeamID = ranking.displayOrder[nextDisplayID]
      if (ranking.tournamentIDs[nextTeamID] !== tournamentID) {
        break
      }
    }

    var tournamentSize = nextDisplayID - displayID

    return tournamentSize
  }

  SystemTableRowView.prototype.updateEverything = function () {
    this.updateRankTexts()
    this.updateLastRowClass()
    this.updateSystem()
  }

  SystemTableRowView.prototype.onupdate = function (emitter, event, data) {
    var rowview = this
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

  SystemTableRowView.prototype.oninsert = function (emitter, event, data) {
    if (emitter === this.teams) {
      this.updateEverything()
    }
  }

  SystemTableRowView.prototype.onremove = function (emitter, event, data) {
    if (emitter === this.teams) {
      this.updateEverything()
    }
  }

  SystemTableRowView.prototype.destroy = function () {
    this.clearTournamentView()

    SystemTableRowView.superclass.destroy.call(this)
  }

  SystemTableRowView.prototype.getDisplayID = function () {
    var ranking = this.getRanking()
    var displayID = ranking.displayOrder.indexOf(this.teamID)
    return displayID
  }

  SystemTableRowView.prototype.getTournamentID = function () {
    var ranking = this.tournaments.getGlobalRanking(this.teams.length)
    var tournamentID = ranking.tournamentIDs[this.teamID]
    return tournamentID
  }

  SystemTableRowView.prototype.getRanking = function () {
    return this.tournaments.getGlobalRanking(this.teams.length)
  }

  SystemTableRowView.prototype.isFirstInTournament = function () {
    var displayID = this.getDisplayID()
    var tournamentID = this.getTournamentID()
    var ranking = this.getRanking()
    var isFirstInTournament = false
    if (displayID === 0) {
      isFirstInTournament = true
    } else {
      var previousTeamID = ranking.displayOrder[displayID - 1]
      if (ranking.tournamentIDs[previousTeamID] !== tournamentID) {
        isFirstInTournament = true
      }
    }

    return isFirstInTournament
  }

  SystemTableRowView.prototype.getTournament = function () {
    return this.tournaments.get(this.getTournamentID())
  }

  SystemTableRowView.prototype.clearTournamentView = function () {
    if (this.tournamentView) {
      if (this.tournamentView.$view.parent().is(this.$view)) {
        this.tournamentView.$view.detach()
      }
      this.tournamentView = undefined
    }
  }

  return SystemTableRowView
})
