/**
 * TeamController: Let the user change player names, when she clicks a player
 * name
 *
 * @return TeamController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "ui/renamecontroller", "ui/toast", "ui/strings"], function (
  extend, RenameController, Toast, Strings) {
  /**
   * Constructor
   *
   * @param view
   *          a ListView instance with TeamView instances
   */
  function TeamController(view, $input) {
    TeamController.superconstructor.call(this, view);

    this.view.$view.find(".teamno").click(this.openModal.bind(this));
  }
  extend(TeamController, RenameController);

  /**
   * Retrieve the Player instance, which is associated with the $name element
   *
   * This requires working knowledge of the TeamView structure. So be it.
   *
   * @param $name
   *          the DOM element which displays the player name
   * @return the associated PlayerModel instance
   */
  TeamController.prototype.getPlayer = function ($name) {
    var index, $names;

    $names = this.view.$view.find(".name");
    if ($names.length === 0) {
      $names = this.view.$view.filter(".name");
    }
    index = $names.index($name);

    return this.model.getPlayer(index);
  };

  TeamController.prototype.getName = function () {
    var player;

    if (!this.$anchor) {
      return "";
    }

    //    if (!(this.model.getID() >= 0)) {
    //      return undefined;
    //    }

    player = this.getPlayer(this.$anchor);

    return player.getName();
  };

  TeamController.prototype.setName = function (name) {
    var player;

    if (!this.$anchor || !name) {
      return false;
    }

    player = this.getPlayer(this.$anchor);

    player.setName(name);

    return true;
  };

  TeamController.prototype.openModal = function () {
    window.alert("OPEN MODAL");
  };

  return TeamController;
});