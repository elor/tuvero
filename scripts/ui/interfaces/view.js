/**
 * An abstract view class
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ './model' ], function (Model) {
  /**
   * Displays a model and updates on changes to it.
   * 
   * @param model
   *          The associated instance of the Model class
   * @param $view
   *          A jQuery object which is represented by this view
   */
  function View (model, $view) {
    this.model = model || new Model();
    this.$view = $view;

    this.model.registerListener(this);
  }

  /**
   * resets the whole view
   */
  View.prototype.reset = function () {
  };

  /**
   * update the whole view
   */
  View.prototype.update = function () {
  };

  /**
   * hide the whole view
   */
  View.prototype.hide = function () {
    this.$view.hide();
  };

  /**
   * show the whole view (after hiding it)
   */
  View.prototype.show = function () {
    this.$view.show();
  };

  /**
   * Detach the whole view from its container before removing it
   */
  View.prototype.detach = function () {
    this.$view.detach();
  };

  /**
   * get the jQuery object (this.$view)
   * 
   * @returns this.$view
   */
  View.prototype.getElem = function () {
    return this.$view;
  };

  return View;
});
