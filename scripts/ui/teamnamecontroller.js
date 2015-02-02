/**
 * TeamNameController
 *
 * @return TeamNameController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './controller'], function(extend, Controller) {
  /**
   * Constructor
   */
  function TeamNameController() {
    TeamNameController.superconstructor.call(this);
  }
  extend(TeamNameController, Controller);

  return TeamNameController;
});
