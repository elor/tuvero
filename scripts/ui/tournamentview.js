/**
 * TournamentView
 *
 * @return TournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import StateClassView from './stateclassview.js'
import Listener from '../core/listener.js'
import TournamentController from './tournamentcontroller.js'
import ListModel from '../list/listmodel.js'
import BoxView from './boxview.js'
import Presets from 'presets'
import RankingOrderView from './rankingorderview.js'
import Strings from './strings.js'

class TournamentView extends View {
  constructor (tournament, $view, tournaments) {
    let advancedOptions
    super(undefined, $view)
    this.$view.attr('rowspan', tournament.getTeams().length)
    this.model.tournament = tournament
    this.stateClassView = new StateClassView(tournament.getState(), $view)
    this.$name = this.$view.find('.tournamentname')
    this.$round = this.$view.find('.round')
    this.$nextround = this.$view.find('.nextround')
    this.$initial = this.$view.find('.initial')
    this.$running = this.$view.find('.running')
    this.$idle = this.$view.find('.idle')
    this.$finished = this.$view.find('.finished')
    this.$advancedOptions = this.$view.find('.tournamentoptions.boxview')
    if (this.$advancedOptions.length > 0) {
      this.advancedOptions = advancedOptions = []
      this.$advancedOptions.each(function () {
        advancedOptions.push(new BoxView($(this)))
      })
    }
    this.$rankingboxes = this.$view.find('.rankingorder.boxview')
    this.rankingBoxViews = this.$rankingboxes.map(function () {
      return new BoxView($(this))
    }).toArray()
    if (Presets.ui.hiderankingorder) {
      this.hideRankingOrder()
    }
    this.initRankingOrderViews()
    Listener.bind(this.model.tournament.getName(), 'update', this.updateNames, this)
    Listener.bind(this.model.tournament.getState(), 'update', this.updateRound, this)
    this.updateNames()
    this.updateRound()
    this.controller = new TournamentController(this, tournaments)
  }

  initRankingOrderViews () {
    let availableComponents
    this.$rankingOrderViews = this.$view.find('.rankingorderview')
    if (this.$rankingOrderViews.length > 0) {
      availableComponents = Presets.ranking.components.slice(0)
      this.model.tournament.getRanking().get().components.forEach(function (component) {
        if (availableComponents.indexOf(component) === -1) {
          availableComponents.push(component)
        }
      })
      availableComponents.sort(function (a, b) {
        a = Strings['ranking_' + a] || a
        b = Strings['ranking_' + b] || b
        return a.localeCompare(b)
      })
      this.rankingOrderViews = []
      for (let i = 0; i < this.$rankingOrderViews.length; i += 1) {
        this.rankingOrderViews.push(new RankingOrderView(this.model.tournament, this.$rankingOrderViews.eq(i), new ListModel(availableComponents)))
      }
    }
  }

  hideRankingOrder () {
    this.$view.find('.rankingorder').each(function () {
      const $this = $(this)
      const $anchor = $this.parent().find('.tournamentoptions.boxview')
      if ($anchor.length === 1) {
        $anchor.append($this)
      }
    })
  }

  updateNames () {
    this.$name.text(this.model.tournament.getName().get())
  }

  updateRound () {
    if (this.model.tournament.getRound) {
      this.$round.text(this.model.tournament.getRound() + 1)
      this.$nextround.text(this.model.tournament.getRound() + 2)
    }
  }

  destroy () {
    this.controller.destroy()
    if (this.subcontroller && this.subcontroller.destroy) {
      this.subcontroller.destroy()
    }
    if (this.rankingOrderViews) {
      this.rankingOrderViews.forEach(function (view) {
        view.destroy()
      })
    }
    if (this.rankingBoxViews) {
      this.rankingBoxViews.forEach(function (view) {
        view.destroy()
      })
    }
    this.stateClassView.destroy()
    super.destroy()
  }
}

export default TournamentView
