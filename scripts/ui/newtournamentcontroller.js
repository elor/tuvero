/**
 * NewTournamentController
 *
 * @return NewTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'
import TournamentIndex from '../tournament/tournamentindex.js'
import Strings from './strings.js'
import TournamentController from './tournamentcontroller.js'
import Presets from 'presets'
import InputValueView from './inputvalueview.js'
import AttributeValueView from './attributevalueview.js'
import ClassView from '../core/classview.js'

/**
 * Constructor
 */
class NewTournamentController extends Controller {
  constructor (view) {
        super(view)
    const controller = this
    this.$interlacecount = this.view.$view.find('input.interlacecount')
    this.interlaceMaximum = new AttributeValueView(this.model.tournaments.interlaceMaximum, this.$interlacecount, 'max')
    this.interlaceVisibility = new ClassView(this.model.tournaments.interlaceAllowed, this.view.$view.find('.interlace'), undefined, 'hidden')
    this.interlaceBinding = new InputValueView(this.model.tournaments.interlaceCount, this.$interlacecount)
    this.$tournamentsize = this.view.$view.find('input.tournamentsize')
    this.$buttons = this.view.$view.find('button[data-system]')
    this.$tournamentsize.attr('max', this.model.numTeams)
    this.$tournamentsize.val(this.model.numTeams)
    controller.updateViewHeight()
    controller.updateDisabledButtons()
    this.$tournamentsize.on('change keypress mousewheel', function () {
      controller.updateViewHeight()
      controller.updateDisabledButtons()
      window.setTimeout(controller.updateViewHeight.bind(controller), 1)
    })
    this.$buttons.click(function (e) {
            const $button = $(this)
      const type = $button.attr('data-system')
      const size = Number(controller.$tournamentsize.val())
      controller.createTournament(type, size)
    })
  }

  /**
   * @param size
   *          a tournament size
   * @return true if the size is valid for a tournament, false otherwise
   */
  validateSize (size) {
    return size >= 2 && size <= this.model.numTeams
  }

  updateViewHeight () {
        const size = Number(this.$tournamentsize.val())
    if (this.validateSize(size)) {
      this.view.$view.attr('rowspan', size)
    }
  }

  createTournament (type, size) {
    let i, rankingorder
    if (!this.validateSize(size)) {
      return
    }
    rankingorder = ['wins']
    if (Presets.systems[type] && Presets.systems[type].ranking) {
      rankingorder = Presets.systems[type].ranking.slice(0)
    }
    const tournament = TournamentIndex.createTournament(type, rankingorder)
    tournament.getName().set(Strings['defaultname' + tournament.SYSTEM] || Strings.defaultnamegeneric)
    const ranking = this.model.tournaments.getGlobalRanking(this.model.teams.length)
    const imax = Math.min(this.model.firstTeamID + size,
    //
      ranking.displayOrder.length)
    for (i = this.model.firstTeamID; i < imax; i += 1) {
      tournament.addTeam(ranking.displayOrder[i])
    }
    if (tournament) {
      this.model.tournaments.push(tournament, this.model.firstTeamID)
    }
    TournamentController.initiateNameChange(tournament)
  }

  updateDisabledButtons () {
    const numTeams = Number(this.$tournamentsize.val())
    this.$buttons.each(function () {
            const $button = $(this)
      const minTeams = Number($button.attr('data-minteams')) || 0
      $button.prop('disabled', numTeams < minTeams)
    })
  }
}

export default NewTournamentController
