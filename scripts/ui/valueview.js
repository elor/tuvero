import View from '../core/view.js';

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which implements get() and emits update
 * @param $view
 *          the associated DOM element
 */
class ValueView extends View {
  constructor(model, $view) {
    super(model, $view);
    this.update();
  }

  /**
   * write the contents of get() to the DOM
   */
  update() {
    const value = this.model.get();
    if (value === undefined) {
      this.$view.text('undefined');
    } else {
      this.$view.text(value);
    }
  }

  /**
   * Callback listener
   */
  onupdate() {
    this.update();
  }
}

export default ValueView;