/**
 * @return TeamSizeController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/controller"], function ($, extend, Controller) {
  /**
   * Constructor
   *
   * @param view
   *          the TeamSizeView
   */
  function TeamSizeController(view) {
    var $buttons, model;
    TeamSizeController.superconstructor.call(this, view);

    $buttons = this.view.$buttons;
    model = this.model;

    /**
     * adjust the team size: get the index of the clicked button and calculate
     * the team size from it. Increment and set.
     */
    $buttons.click(function () {
      var teamsize;

      teamsize = $buttons.index($(this)) + 1;

      if (teamsize > 0) {
        model.set(teamsize);
      }
    });
  }
  extend(TeamSizeController, Controller);

  return TeamSizeController;
});
