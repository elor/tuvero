import Controller from '../core/controller.js';
import StateSaver from './statesaver.js';

/**
 * Constructor
 */
class TimeMachineNewTreeController extends Controller {
  constructor(view) {
    super(view);
    this.$input = this.view.$view.find('input.treename');
    this.$button = this.view.$view.find('button.createroot');
    this.$input.keydown(this.inputKey.bind(this));
    this.$button.click(this.create.bind(this));
  }

  /**
   * create a new tree. If no name has been set yet, focus the name input.
   *
   * @return true. always.
   */
  create() {
    let name;
    name = this.$input.val();
    if (!name) {
      this.$input.focus();
      return;
    }
    if (StateSaver.createNewEmptyTree(name)) {
      this.$input.val('');
    }
    return true;
  }

  /**
   * If Enter is pressed, create a new tree. Default input otherwise.
   *
   * @param evt
   * @return false if event propagation should be stopped
   */
  inputKey(evt) {
    if (evt.which === 13) {
      // enter
      this.$button.click();
      evt.preventDefault();
      return false;
    }
    return true;
  }
}

export default TimeMachineNewTreeController;