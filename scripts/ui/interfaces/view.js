/**
 * An abstract view class
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./model'], function(Model) {
  /**
   * Displays a model and updates on changes to it.
   *
   * @param model
   *          The associated instance of the Model class
   * @param $view
   *          A jQuery object which is represented by this view
   */
  function View(model, $view) {
    this.model = model || new Model();
    this.$view = $view;

    this.model.registerListener(this);
  }

  /**
   * resets the whole view
   */
  View.prototype.reset = function() {
  };

  /**
   * update the whole view
   */
  View.prototype.update = function() {
  };

  /**
   * destroy the whole view by removing its element from the DOM and
   * unregistering the default event listener (disconnect from this.model)
   *
   * Ideas:
   *
   * A View should not be destroyed and re-instantiated in place on the same DOM
   * element, that's what reset() is for
   *
   * This function should effectively destroy the view, leaving nothing behind.
   * That's intended for deletion from lists etc., where elements are
   * permanently removed and replaced with new elements.
   *
   */
  View.prototype.destroy = function() {
    this.$view.remove();
    this.model.unregisterListener(this);
  };

  return View;
});
