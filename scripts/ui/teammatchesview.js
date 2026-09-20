/**
 * The matches of one team, as shown on the team tab.
 *
 * Rebuilt from the state rather than bound row by row: the list is
 * short, it only changes when a result is entered, and the
 * alternative (a ListModel of synthetic row models) would outweigh
 * the view itself.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import State from './state.js'
import Listener from '../core/listener.js'
import MatchController from './matchcontroller.js'
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
    this.$finishtemplate = this.$view.find('.template.matchfinish').detach()
    this.controllers = []
    this.tournamentsListener = Listener.bind(State.tournaments,
      'update,resize', this.update.bind(this))
    this.update()
  }

  /**
   * A row shows the result from this team's point of view, and so do
   * the inputs. The match wants its own order, so the two points
   * swap back on the way in.
   *
   * @param row
   *          a collectMatches() row of an open match
   * @return a stand-in model for the MatchController
   */
  static ownOrder (row) {
    return {
      finish: function (points) {
        const ordered = []
        ordered[row.own] = points[0]
        ordered[1 - row.own] = points[1]
        return row.match.finish(ordered)
      }
    }
  }

  update () {
    const rows = collectMatches(State.tournaments, this.model, State.teams)
    this.destroyControllers()
    this.$body.empty()
    rows.forEach(function (row) {
      const $row = $('<tr>').addClass('outcome-' + row.outcome)
      $row.append($('<td>').addClass('phase').text(row.tournament))
      $row.append($('<td>').text(row.round))
      $row.append($('<td>').addClass('partnercol').text(row.partners.join(', ')))
      $row.append($('<td>').text(row.opponents.join(', ')))
      const $result = $('<td>').addClass('resultcol')
      if (row.outcome === 'open') {
        const $form = this.$finishtemplate.children().clone()
        $result.append($form)
        this.controllers.push(new MatchController({
          model: TeamMatchesView.ownOrder(row),
          $view: $row
        }, $form))
      } else {
        $result.text(row.score ? row.score.join(' : ') : OUTCOMES[row.outcome])
      }
      $row.append($result)
      this.$body.append($row)
    }, this)

    // a column of empty cells says nothing: in a normal tournament
    // nobody has line-up partners
    const haspartners = rows.some(function (row) {
      return row.partners.length > 0
    })
    this.$table.find('.partnercol').toggleClass('hidden', !haspartners)

    this.$table.toggleClass('hidden', rows.length === 0)
    this.$empty.toggleClass('hidden', rows.length > 0)
  }

  destroyControllers () {
    this.controllers.forEach(function (controller) {
      controller.destroy()
    })
    this.controllers = []
  }

  /**
   * The container belongs to the tab, not to this view: the next
   * team gets it back. Only the rows and the listeners go.
   */
  destroy () {
    this.destroyControllers()
    this.$body.empty()
    this.tournamentsListener.destroy()
    Listener.prototype.destroy.call(this)
  }

  onupdate () {
    this.update()
  }
}

export default TeamMatchesView
