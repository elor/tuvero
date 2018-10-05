/**
 * SwissVotePropController
 *
 * @return SwissVotePropController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "core/controller"], function (extend, Controller) {
  /**
   * Constructor
   *
   * @param view
   *          a SwissVotePropView instance
   */
  function SwissVotePropController(view) {
    SwissVotePropController.superconstructor.call(this, view);

    this.view.$view.click(this.toggleValue.bind(this));
  }
  extend(SwissVotePropController, Controller);

  /**
   * toggles the boolean value of the underlying model.
   */
  SwissVotePropController.prototype.toggleValue = function () {
    this.model.set(!this.model.get());
  };

  return SwissVotePropController;
});
