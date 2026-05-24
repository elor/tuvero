import View from '../core/view.js';

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which implements get() and emits update
 * @param $view
 *          the associated DOM element
 */
class AttributeValueView extends View {
  constructor(model, $view, attribute) {
    super(model, $view);
    this.attribute = attribute;
    this.update();
  }

  /**
   * write the contents of get() to the DOM
   */
  update() {
    this.$view.attr(this.attribute, this.model.get());
  }

  /**
   * Callback listener
   */
  onupdate() {
    this.update();
  }
}

export default AttributeValueView;