/**
 * A container with number of buttons with which the team size can be set. The
 * order of the buttons indicates the team size, starting at 1. The button
 * representinc the current team size will be selected
 *
 * @return TeamSizeView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/view", "ui/teamsizecontroller"], function (extend, View,
    TeamSizeController) {

  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance which represents the team size
   */
  function TeamSizeView(model, $view) {
    TeamSizeView.superconstructor.call(this, model, $view);

    this.$buttons = this.$view.find(">button");

    this.update();

    this.controller = new TeamSizeController(this);
  }
  extend(TeamSizeView, View);

  /**
   * unselect all buttons and select the current one.
   *
   * When driven by update events, ValueModel.set() should avoid sending events
   * when the new and old values match, i.e. there's no actual change
   */
  TeamSizeView.prototype.update = function () {
    var teamsize;

    teamsize = this.model.get();

    this.$buttons.removeClass("selected");
    this.$buttons.eq(teamsize - 1).addClass("selected");
  };

  /**
   * Callback function
   */
  TeamSizeView.prototype.onupdate = function () {
    this.update();
  };

  return TeamSizeView;
});
