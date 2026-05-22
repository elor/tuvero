/**
 * @return TeamSizeController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
/**
 * Constructor
 *
 * @param view
 *          the TeamSizeView
 */
function TeamSizeController(view) {
  let $buttons, model;
  TeamSizeController.superconstructor.call(this, view);
  $buttons = this.view.$buttons;
  model = this.model;

  /**
   * adjust the team size: get the index of the clicked button and calculate
   * the team size from it. Increment and set.
   */
  $buttons.click(function () {
    let teamsize;
    teamsize = $buttons.index($(this)) + 1;
    if (teamsize > 0) {
      model.set(teamsize);
    }
  });
}
extend(TeamSizeController, Controller);
export default TeamSizeController;