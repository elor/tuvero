/**
 * RankingOrderController
 *
 * @return RankingOrderController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller'], function(extend, Controller) {
  /**
   * Constructor
   */
  function RankingOrderController(view) {
    RankingOrderController.superconstructor.call(this, view);
  }
  extend(RankingOrderController, Controller);

  return RankingOrderController;
});
