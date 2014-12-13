/**
 * An abstract view class
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  /**
   * Displays a model and updates on changes to it.
   * 
   * @param model
   *          The associated instance of the Model class
   * @param $view
   *          A jQuery object which is represented by this view
   */
  function View (model, $view) {
    this.$view = $view;
    this.model = model;

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
   * detach the whole view before removing it
   */
  View.prototype.detach = function () {
    this.$view.detach();
  };

  /**
   * attach the whole view to the end of the container
   * 
   * @param $container
   *          a jQuery object to which the view is attached
   */
  View.prototype.attach = function ($container) {
    $container.append(this.$view);
  };

  View.prototype.onupdate = function () {
    this.update;
  };

  return View;
});
