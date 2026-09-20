/**
 * The matches of one team, as shown on the team tab.
 *
 * Rebuilt from the state rather than bound row by row: the list is
 * short, it only changes when a result is entered somewhere else,
 * and the alternative (a ListModel of synthetic row models) would
 * outweigh the view itself.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import State from './state.js'
import Listener from '../core/listener.js'
import collectMatches from './teammatches.js'

const OUTCOMES = {
  won: 'Sieg',
  lost: 'Niederlage',
  draw: 'Unentschieden',
  bye: 'Freilos',
  open: 'offen'
}

class TeamMatchesView extends View {
  /**
   * @param model
   *          the TeamModel to report on
   * @param $view
   *          the .teammatches container
   */
  constructor (model, $view) {
    super(model, $view)
    this.$table = this.$view.find('table.matches')
    this.$body = this.$table.find('tbody')
    this.$empty = this.$view.find('.nomatches')
    this.tournamentsListener = Listener.bind(State.tournaments,
      'update,resize', this.update.bind(this))
    this.update()
  }

  /**
   * The container belongs to the tab, not to this view: the next
   * team gets it back. Only the rows and the listeners go.
   */
  destroy () {
    this.$body.empty()
    this.tournamentsListener.destroy()
    Listener.prototype.destroy.call(this)
  }

  update () {
    const rows = collectMatches(State.tournaments, this.model, State.teams)
    this.$body.empty()
    rows.forEach(function (row) {
      const $row = $('<tr>').addClass('outcome-' + row.outcome)
      $row.append($('<td>').text(row.tournament))
      $row.append($('<td>').text(row.round))
      $row.append($('<td>').text(row.partners.join(', ')))
      $row.append($('<td>').text(row.opponents.join(', ')))
      $row.append($('<td>').text(row.score
        ? row.score.join(' : ')
        : OUTCOMES[row.outcome]))
      this.$body.append($row)
    }, this)
    this.$table.toggleClass('hidden', rows.length === 0)
    this.$empty.toggleClass('hidden', rows.length > 0)
  }

  onupdate () {
    this.update()
  }
}

export default TeamMatchesView
