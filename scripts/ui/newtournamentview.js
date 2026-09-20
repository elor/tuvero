/**
 * NewTournamentView
 *
 * @return NewTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import NewTournamentController from './newtournamentcontroller.js'
import Presets from 'presets'
import State from './state.js'

/**
 * Constructor
 *
 * @param firstID
 * @param lastID
 * @param $view
 * @param tournaments
 * @param teams
 */
class NewTournamentView extends View {
  constructor (firstTeamID, numTeams, $view, tournaments, teams) {
    super(undefined, $view)
    this.$view.addClass('newsystem')
    if (numTeams < 2) {
      this.$view.addClass('notenoughteams')
    }

    // anonymous model
    this.model.firstTeamID = firstTeamID
    this.model.numTeams = numTeams
    this.model.tournaments = tournaments
    this.model.teams = teams
    /*
     * A Supermêlée does not mix with the other systems -- it draws
     * its teams every round, they play fixed ones -- so the kind
     * chosen when the tournament was created decides which buttons
     * are on offer at all.
     */
    const melee = !!State.melee.get() || State.tournaments.map(function (tournament) {
      return tournament.SYSTEM
    }).indexOf('melee') !== -1
    this.$view.find('button').each(function () {
      const $button = $(this)
      const system = $button.attr('data-system')
      if (!system) {
        return
      }
      if (!Presets.systems[system] || melee !== (system === 'melee')) {
        $button.hide()
      }
    })
    this.controller = new NewTournamentController(this)
  }
}

export default NewTournamentView
