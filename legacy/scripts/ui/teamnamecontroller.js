/**
 * TeamNameController: Let the user change player names, when she clicks a
 * player name
 *
 * @return TeamNameController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ 'lib/extend', 'core/controller', './toast', './strings' ], function(
    extend, Controller, Toast, Strings) {
  /**
   * Constructor
   *
   * @param view
   *          a ListView instance with TeamView instances
   */
  function TeamNameController(view, $input) {
    TeamNameController.superconstructor.call(this, view);

    this.$input = $input || $('<input>').attr('type', 'text');

    this.view.$view
        .on('click', '.name', this, TeamNameController.onNameClicked);

    this.toast = undefined;

    this.hideInputField();
  }
  extend(TeamNameController, Controller);

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

  /**
   * show the input field in place of a player name
   *
   * @param $name
   *          the DOM element which displays the player name
   */
  TeamNameController.prototype.showInputField = function($name) {
    var player;

    player = this.getPlayer($name);

    this.attachInputListeners();

    this.$input.val(player.getName());
    $name.text('').append(this.$input);
    this.$input.focus();

    if (this.toast) {
      this.toast.display();
    } else {
      this.toast = new Toast(Strings.namechangeprompt, Toast.INFINITE);
    }
  };

  /**
   * detach the input field from the DOM and change/reset the player name
   *
   * @param abort
   *          if true, the new player name will be discarded
   */
  TeamNameController.prototype.hideInputField = function(abort) {
    var $parent, player;

    $parent = this.$input.parent();
    if ($parent.length) {
      this.$input.off('blur keydown');
      this.$input.detach();
      if ($parent.hasClass('name')) {
        player = this.getPlayer($parent);
        $parent.text(player.getName());
        if (!abort) {
          player.setName(this.$input.val());
        }
        // TODO show a Toast on success and failure
      }
    }

    if (this.toast) {
      this.toast.close();
    }
  };

  /**
   * attach blur and keydown listeners. This is required to avoid double-blurs,
   * where the browser sends a second blur event, if an element is detached
   * within a blur event. Keydown should be fine, but we'll do it anyways.
   */
  TeamNameController.prototype.attachInputListeners = function() {
    this.$input.blur(this, TeamNameController.onInputBlur);
    this.$input.keydown(this, TeamNameController.onInputKeydown);
  };

  /**
   * detach blur and keydown listeners. This is required to avoid double-blurs,
   * where the browser sends a second blur event, if an element is detached
   * within a blur event. Keydown should be fine, but we'll do it anyways.
   */
  TeamNameController.prototype.detachInputListeners = function() {
    this.$input.off('blur keydown');
  };

  /**
   * .name click callback function
   *
   * @param e
   *          jQuery Event object
   */
  TeamNameController.onNameClicked = function(e) {
    var controller;

    controller = e.data;
    if ($(e.target).data() !== controller.$input.data()) {
      controller.showInputField($(this));
    }
  };

  /**
   * input blur event: keep the new name
   *
   * @param e
   *          jQuery Event object
   */
  TeamNameController.onInputBlur = function(e) {
    var controller;

    controller = e.data;
    controller.hideInputField();
  };

  /**
   * escape or enter key: discard or keep name, respectively
   *
   * @param e
   *          jQuery Event object
   */
  TeamNameController.onInputKeydown = function(e) {
    var controller;

    controller = e.data;

    switch (e.which) {
    case 13: // enter
      controller.hideInputField();
      break;
    case 27: // escape
      controller.hideInputField(true);
      break;
    }
  };

  return TeamNameController;
});
