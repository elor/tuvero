/**
 * TeamNameController: Let the user change player names, when she clicks a
 * player name
 *
 * @return TeamNameController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/renamecontroller', './toast', './strings'], function(
    extend, RenameController, Toast, Strings) {
  /**
   * Constructor
   *
   * @param view
   *          a ListView instance with TeamView instances
   */
  function TeamNameController(view, $input) {
    TeamNameController.superconstructor.call(this, view);

    this.toast = undefined;
  }
  extend(TeamNameController, RenameController);

  /**
   * Retrieve the Player instance, which is associated with the $name element
   *
   * This requires working knowledge of the TeamView structure. So be it.
   *
   * @param $name
   *          the DOM element which displays the player name
   * @return the associated PlayerModel instance
   */
  TeamNameController.prototype.getPlayer = function($name) {
    var index, subview;

    index = this.view.indexOf($name);
    subview = this.view.getSubview(index);

    index = subview.$view.find('.name').index($name);

    return subview.model.getPlayer(index);
  };

  TeamNameController.prototype.getName = function() {
    var player;

    if (!this.$anchor) {
      return '';
    }

    player = this.getPlayer(this.$anchor);

    return player.getName();
  };

  TeamNameController.prototype.setName = function(name) {
    if (!this.$anchor || !name) {
      return false;
    }

    player = this.getPlayer(this.$anchor);

    player.setName(name);

    return true;
  };

  return TeamNameController;
});
