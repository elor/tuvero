/**
 * MatchTableView
 *
 * @return MatchTableView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/templateview', 'ui/listview', 'core/listener',
  'ui/matchresultview', 'ui/teamtableview', 'ui/strings', 'ui/listcollectormodel',
  'core/matchmodel'
], function (extend, TemplateView, ListView, Listener, MatchResultView,
  TeamTableView, Strings, ListCollectorModel, MatchModel) {
  function MatchTableView (model, $view, teamlist, tournament, teamsize) {
    var $listview
    MatchTableView.superconstructor.call(this, model, $view, $view
      .find('.match'))

    $listview = this.$view.children('table')
    this.listView = new ListView(this.model, $listview, this.$template,
      MatchResultView, teamlist, tournament)

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

    var view = this
    this.groupListener = new Listener(this.model)
    this.groupListener.onresize = function (emitter, event, data) {
      view.updateGroupNumber()
      view.updateCount()
      view.updatePlaceHeader()
    }

    this.matchesListener = new ListCollectorModel(this.model, MatchModel)
    this.matchesListener.onupdate = this.updatePlaceHeader.bind(this)
  }
  extend(MatchTableView, TemplateView)

  /**
   * print the group ID as soon as it's available
   */
  MatchTableView.prototype.updateGroupNumber = function () {
    var min, max, groupIDs

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

  MatchTableView.prototype.updateCount = function () {
    this.$count.text(this.model.length)
  }

  MatchTableView.prototype.updatePlaceHeader = function () {
    if (this.model.asArray().some(function (match) { return match.place })) {
      this.$place.show()
    } else {
      this.$place.hide()
    }
  }

  MatchTableView.prototype.updateRunningState = function () {
    var i, isRunning

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
  MatchTableView.prototype.onresize = function (emitter, event, data) {
    this.updateRunningState()
  }

  MatchTableView.prototype.destroy = function () {
    MatchTableView.superclass.destroy.call(this)
    this.listView.destroy()
    this.groupListener.destroy()
  }

  return MatchTableView
})
