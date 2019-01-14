/**
 * RankingOrderView
 *
 * @return RankingOrderView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'ui/templateview', 'ui/rankingcomponentview', 'ui/listview',
  'ui/rankingordercontroller', 'list/listmodel', 'core/listener', 'presets'], function ($, extend, TemplateView,
  RankingComponentView, ListView, RankingOrderController, ListModel, Listener, Presets) {
  function RankingOrderView (tournament, $view, allComponents) {
    RankingOrderView.superconstructor.call(this, tournament, $view,
      $view.find('.template'))

    this.selectedComponents = new ListModel(this.model.ranking.componentnames)
    this.allComponents = new ListModel(allComponents.asArray())

    if (Presets.systems[tournament.SYSTEM] && Presets.systems[tournament.SYSTEM].ranking) {
      Presets.systems[tournament.SYSTEM].ranking.forEach(function (component) {
        if (this.allComponents.indexOf(component) === -1) {
          this.allComponents.push(component)
        }
      }, this)
    }

    this.$availableList = this.$view.find('.available')
    this.$selectedList = this.$view.find('.selected')

    this.selectedListView = new ListView(this.selectedComponents,
      this.$selectedList, this.$template, RankingComponentView)
    this.availableListView = new ListView(this.allComponents, this.$availableList,
      this.$template, RankingComponentView)

    this.controller = new RankingOrderController(this)

    Listener.bind(tournament.getState(), 'update', this.updateFromScratch, this)

    this.update()
  }
  extend(RankingOrderView, TemplateView)

  /**
   * automatically show/hide already selected values from the list of available
   * items
   */
  RankingOrderView.prototype.update = function () {
    var selected = this.selectedComponents

    this.$availableList.find('.component').each(function (index) {
      var $option = $(this)
      if (selected.indexOf($option.val()) === -1) {
        $option.removeClass('hidden')
      } else {
        $option.addClass('hidden')
      }
    })
  }

  RankingOrderView.prototype.updateFromScratch = function () {
    this.selectedComponents.restore(this.model.ranking.componentnames)
    this.update()
  }

  /**
   * an item has been inserted into the left list. Update the right list.
   */
  RankingOrderView.prototype.oninsert = function () {
    this.update()
  }

  /**
   * an item has been removed from the left list. Update the right list.
   */
  RankingOrderView.prototype.onremove = function () {
    this.update()
  }

  return RankingOrderView
})
