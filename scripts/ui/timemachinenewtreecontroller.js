/**
 * TimeMachineNewTreeController
 *
 * @return TimeMachineNewTreeController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'ui/statesaver'], function(extend,
    Controller, StateSaver) {
  /**
   * Constructor
   */
  function TimeMachineNewTreeController(view) {
    TimeMachineNewTreeController.superconstructor.call(this, view);

    this.$input = this.view.$view.find('input.treename');
    this.$button = this.view.$view.find('button.createroot');

    this.$input.keydown(this.inputKey.bind(this));
    this.$button.click(this.create.bind(this));
  }
  extend(TimeMachineNewTreeController, Controller);

  /**
   * create a new tree. If no name has been set yet, focus the name input.
   *
   * @return true. always.
   */
  TimeMachineNewTreeController.prototype.create = function() {
    var name;

    name = this.$input.val();
    if (!name) {
      this.$input.focus();
      return;
    }

    if (StateSaver.createNewEmptyTree(name)) {
      this.$input.val('');
    }

    return true;
  };

  /**
   * If Enter is pressed, create a new tree. Default input otherwise.
   *
   * @param evt
   * @return false if event propagation should be stopped
   */
  TimeMachineNewTreeController.prototype.inputKey = function(evt) {
    if (evt.which === 13) {
      // enter
      this.$button.click();

      evt.preventDefault();
      return false;
    }

    return true;
  };

  return TimeMachineNewTreeController;
});
