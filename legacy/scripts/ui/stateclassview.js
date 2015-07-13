/**
 * StateClassView
 *
 * TODO write a test page
 *
 * @return StateClassView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function(extend, View) {
  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance, preferably a StateModel
   * @param $view
   */
  function StateClassView(model, $view) {
    StateClassView.superconstructor.call(this, model, $view);

    this.currentClass = undefined;

    this.update();
  }
  extend(StateClassView, View);

  /**
   * change the class to the value of this.model.get()
   */
  StateClassView.prototype.update = function() {
    var newClass;

    newClass = this.model.get();
    if (newClass !== this.currentClass) {
      this.$view.removeClass(this.currentClass);
      this.$view.addClass(newClass);
      this.currentClass = newClass;
    }
  };

  /**
   * Callback function to monitor value changes
   */
  StateClassView.prototype.onupdate = function() {
    this.update();
  }

  return StateClassView;
});
