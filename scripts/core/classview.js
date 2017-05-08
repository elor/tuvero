/**
 * ClassView, a class which sets CSS classes according to
 *
 * @return ClassView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View) {
  /**
   * Constructor
   *
   * @param model
   *          a boolean ValueModel instance
   * @param $view
   *          the DOM element for which to change the classes
   * @param onclass
   *          Optional. the class when model.get() returns true
   * @param offclass
   *          Optional. the class when model.get() returns false
   */
  function ClassView(model, $view, onclass, offclass) {
    ClassView.superconstructor.call(this, model, $view);

    this.onclass = onclass || undefined;
    this.offclass = offclass || undefined;

    this.update();
  }
  extend(ClassView, View);

  /**
   * set or remove the classes according to model.get()
   */
  ClassView.prototype.update = function() {
    if (this.model.get()) {
      if (this.onclass) {
        this.$view.addClass(this.onclass);
      }
      if (this.offclass) {
        this.$view.removeClass(this.offclass);
      }
    } else {
      if (this.onclass) {
        this.$view.removeClass(this.onclass);
      }
      if (this.offclass) {
        this.$view.addClass(this.offclass);
      }
    }
  };

  /**
   * Callback function to monitor value changes
   */
  ClassView.prototype.onupdate = function() {
    this.update();
  };

  return ClassView;
});
