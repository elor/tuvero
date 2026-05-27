import TemplateView from './templateview.js'
import ListView from './listview.js'
import Listener from '../core/listener.js'
import MatchResultView from './matchresultview.js'
import TeamTableView from './teamtableview.js'
import Strings from './strings.js'
import ListCollectorModel from './listcollectormodel.js'
import MatchModel from '../core/matchmodel.js'

class MatchTableView extends TemplateView {
  constructor (model, $view, teamlist, tournament, teamsize) {
    super(model, $view, $view.find('.match'))
    const $listview = this.$view.children('table')
    this.listView = new ListView(this.model, $listview, this.$template, MatchResultView, teamlist, tournament)
    this.teamTableView = new TeamTableView(this.listView, teamsize)
    this.$roundtext = this.$view.find('.roundtext')
    this.$round = this.$view.find('.round')
    this.$count = this.$view.find('.count')
    this.$place = this.$view.find('.place')
    this.$roundtext.text(Strings['grouptext_' + tournament.SYSTEM] || Strings.grouptext_default)
    this.updateRunningState()
    this.updateGroupNumber()
    this.updateCount()
    this.updatePlaceHeader()
    const view = this
    this.groupListener = new Listener(this.model)
    this.groupListener.onresize = function (emitter, event, data) {
      view.updateGroupNumber()
      view.updateCount()
      view.updatePlaceHeader()
    }
    this.matchesListener = new ListCollectorModel(this.model, MatchModel)
    this.matchesListener.onupdate = this.updatePlaceHeader.bind(this)
  }

  /**
   * print the group ID as soon as it's available
   */
  updateGroupNumber () {
    let min, max, groupIDs
    if (this.model.length > 0) {
      groupIDs = this.model.map(function (match) {
        return Number(match.getGroup()) + 1
      })
      min = Math.min.apply(Math, groupIDs)
      max = Math.max.apply(Math, groupIDs)
      if (min === max) {
        this.$round.text(min)
      } else {
        this.$round.text(min + '-' + max)
      }
    }
  }

  updateCount () {
    this.$count.text(this.model.length)
  }

  updatePlaceHeader () {
    if (this.model.asArray().some(function (match) {
      return match.place
    })) {
      this.$place.show()
    } else {
      this.$place.hide()
    }
  }

  updateRunningState () {
    let i, isRunning
    isRunning = false
    for (i = 0; i < this.model.length; i += 1) {
      if (!this.model.get(i).isResult()) {
        isRunning = true
        break
      }
    }
    if (isRunning) {
      this.$view.addClass('running')
      this.$view.removeClass('finished')
    } else {
      this.$view.addClass('finished')
      this.$view.removeClass('running')
    }
  }

  /**
   * callback function, which gets called by insert and remove
   *
   * @param emitter
   * @param event
   * @param data
   */
  onresize (emitter, event, data) {
    this.updateRunningState()
  }

  destroy () {
    super.destroy()
    this.listView.destroy()
    this.groupListener.destroy()
  }
}

export default MatchTableView
