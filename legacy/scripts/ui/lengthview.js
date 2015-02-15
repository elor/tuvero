/**
 * A LengthView, which writes the length of a ListModel to a DOM element
 *
 * @return LengthView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/view'], function(extend, View) {

  /**
   * Constructor
   *
   * @param model
   *          a ListModel instance
   * @param $view
   *          the associated DOM element
   */
  function LengthView(model, $view) {
    LengthView.superconstructor.call(this, model, $view);

    this.update();
  }
  extend(LengthView, View);

  /**
   * write the playernames and teamnumber to the DOM
   */
  LengthView.prototype.update = function() {
    this.$view.text(this.model.length);
  };

  /**
   * Callback listener
   */
  LengthView.prototype.onresize = function() {
    this.update();
  };

  return LengthView;
});
