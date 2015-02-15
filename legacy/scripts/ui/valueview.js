/**
 * A ValueView, which updates the value of ValueModel to the DOM
 *
 * @return ValueView
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
  function ValueView(model, $view) {
    ValueView.superconstructor.call(this, model, $view);

    this.update();
  }
  extend(ValueView, View);

  /**
   * write the contents of get() to the DOM
   */
  ValueView.prototype.update = function() {
    this.$view.text(this.model.get());
  };

  /**
   * Callback listener
   */
  ValueView.prototype.onupdate = function() {
    this.update();
  };

  return ValueView;
});
