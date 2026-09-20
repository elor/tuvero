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
import MatchResultController from './matchresultcontroller.js'
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
    this.$correcttemplate = this.$view.find('.template.matchcorrect').detach()
    this.controllers = []
    this.nameListeners = []
    this.tournamentsListener = Listener.bind(State.tournaments,
      'update,resize', this.update.bind(this))
    // a phase's name lives in a model of its own and does not reach
    // the list, so the column would keep showing the system name
    this.listListener = Listener.bind(State.tournaments,
      'insert,remove,resize', this.bindNames.bind(this))
    this.bindNames()
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

  /**
   * Follow what the tournament list itself does not pass on: a
   * phase's name lives in a model of its own, and a correction
   * lands in the tournament's own lists.
   */
  bindNames () {
    this.nameListeners.forEach(function (listener) {
      listener.destroy()
    })
    this.nameListeners = []
    State.tournaments.forEach(function (tournament) {
      const update = this.update.bind(this)
      this.nameListeners.push(Listener.bind(tournament.getName(), 'update', update))
      this.nameListeners.push(Listener.bind(tournament.getCorrections(),
        'insert,resize,update', update))
      this.nameListeners.push(Listener.bind(tournament.getCombinedHistory(),
        'resize,update,set', update))
    }, this)
  }

  /**
   * @param members [{ name, team }] of one side
   * @return a jQuery fragment of clickable names
   */
  memberCell (members) {
    const $cell = $('<td>')
    members.forEach(function (member, index) {
      if (index > 0) {
        $cell.append(', ')
      }
      const $name = $('<span>').addClass('name').text(member.name)
      if (member.team) {
        // the same gesture as everywhere else: a name leads to its
        // team
        $name.on('click', function () {
          State.focusedteam.set(member.team)
        })
      }
      $cell.append($name)
    })
    return $cell
  }

  /**
   * A finished row reads from this team's point of view, and so does
   * its correction form. Both stand-ins put the points back into the
   * match's order on the way in.
   *
   * @param row a collectMatches() row of a finished match
   * @return { result, tournament } for the MatchResultController
   */
  static correctable (row) {
    return {
      result: { score: row.score.slice(0), length: 2 },
      tournament: {
        correct: function (result, score) {
          const ordered = []
          ordered[row.own] = score[0]
          ordered[1 - row.own] = score[1]
          return row.tournamentModel.correct(row.match, ordered)
        }
      }
    }
  }

  update () {
    const rows = collectMatches(State.tournaments, this.model, State.teams)
    this.destroyControllers()
    this.$body.empty()
    rows.forEach(function (row) {
      // .match is what the correction form keys its visibility off
      const $row = $('<tr>').addClass('match outcome-' + row.outcome)
      $row.append($('<td>').addClass('phase').text(row.tournament))
      $row.append($('<td>').text(row.round))
      $row.append(this.memberCell(row.partners).addClass('partnercol'))
      $row.append(this.memberCell(row.opponents))
      const $result = $('<td>').addClass('resultcol')
      // in the row before the controllers: they look for the .match
      // ancestor to show and hide the correction form
      $row.append($result)
      this.$body.append($row)
      if (row.outcome === 'open') {
        const $form = this.$finishtemplate.children().clone()
        $result.append($form)
        this.controllers.push(new MatchController({
          model: TeamMatchesView.ownOrder(row),
          $view: $row
        }, $form))
      } else if (row.score) {
        // click the result to correct it, like in the history
        const $score = $('<span>').addClass('result').text(row.score.join(' : '))
        const $form = this.$correcttemplate.children().clone()
        $result.append($score).append($form)
        const correctable = TeamMatchesView.correctable(row)
        this.controllers.push(new MatchResultController({
          model: correctable.result,
          $view: $row,
          $result: $score
        }, $form, correctable.tournament))
      } else {
        $result.text(OUTCOMES[row.outcome])
      }
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
    this.listListener.destroy()
    this.nameListeners.forEach(function (listener) {
      listener.destroy()
    })
    Listener.prototype.destroy.call(this)
  }

  onupdate () {
    this.update()
  }
}

export default TeamMatchesView
