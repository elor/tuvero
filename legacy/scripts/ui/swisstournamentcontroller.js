/**
 * SwissTournamentController
 *
 * @return SwissTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller'], function(extend, Controller) {
  /**
   * Constructor
   *
   * @param view
   */
  function SwissTournamentController(view) {
    SwissTournamentController.superconstructor.call(this, view);
  }
  extend(SwissTournamentController, Controller);

  return SwissTournamentController;
});
