/**
 * A AttributeValueView, which updates the value of ValueModel to the DOM
 *
 * @return AttributeValueView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/view'], function(extend, View) {

  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance, which implements get() and emits update
   * @param $view
   *          the associated DOM element
   */
  function AttributeValueView(model, $view, attribute) {
    AttributeValueView.superconstructor.call(this, model, $view);

    this.attribute = attribute;

    this.update();
  }
  extend(AttributeValueView, View);

  /**
   * write the contents of get() to the DOM
   */
  AttributeValueView.prototype.update = function() {
    this.$view.attr(this.attribute, this.model.get());
  };

  /**
   * Callback listener
   */
  AttributeValueView.prototype.onupdate = function() {
    this.update();
  };

  return AttributeValueView;
});
