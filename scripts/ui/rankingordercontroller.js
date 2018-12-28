/**
 * RankingOrderController: Handle buttons and keypresses in the
 * RankingOrderView. This Controller has slightly more logic than a pure
 * controller, in that it moves items between lists, but this avoids having to
 * inherit a new model from ListModel, so different ListModels can be used as a
 * model for the view.
 *
 * @return RankingOrderController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller'], function ($, extend, Controller) {
  /**
   * Constructor
   *
   * @param view
   *          a valid RankingOrderView instance
   */
  function RankingOrderController (view) {
    RankingOrderController.superconstructor.call(this, view)

    var tournament = this.model
    var allComponents = this.view.allComponents

    this.view.$selectedList.on('click', '.component', function () {
      var components = tournament.ranking.componentnames
      components.splice($(this).index(), 1)
      tournament.setRankingOrder(components)
      view.updateFromScratch()
    })

    this.view.$availableList.on('click', '.component', function () {
      var components = tournament.ranking.componentnames
      components.push(allComponents.get($(this).index()))
      tournament.setRankingOrder(components)
      view.updateFromScratch()
    })
  }
  extend(RankingOrderController, Controller)

  return RankingOrderController
})
