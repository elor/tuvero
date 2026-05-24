import View from '../core/view.js';
import InputValueController from './inputvaluecontroller.js';

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which implements get() and emits update
 * @param $view
 *          the associated DOM element
 */
class InputValueView extends View {
  constructor(model, $view) {
    super(model, $view);
    this.update();
    this.controller = new InputValueController(this);
  }

  /**
  * write the contents of get() to the DOM
  */
  update() {
    this.$view.val(this.model.get());
  }

  /**
  * Callback listener
  */
  onupdate() {
    this.update();
  }
}

export default InputValueView;