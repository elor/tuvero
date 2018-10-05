/**
 * A ValueView, which updates the value of ValueModel to the DOM
 *
 * @return ValueView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/view"], function (extend, View) {

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
  ValueView.prototype.update = function () {
    var value = this.model.get();
    if (value === undefined) {
      this.$view.text("undefined");
    } else {
      this.$view.text(value);
    }
  };

  /**
   * Callback listener
   */
  ValueView.prototype.onupdate = function () {
    this.update();
  };

  return ValueView;
});
