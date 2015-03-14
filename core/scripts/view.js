/**
 * An abstract view class
 *
 * @return View
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/listener', 'core/model'], function(extend,
    Listener, Model) {
  /**
   * Displays a model and updates on changes to it.
   *
   * @param model
   *          The associated instance of the Model class
   * @param $view
   *          A jQuery object which is represented by this view
   */
  function View(model, $view) {
    model = model || new Model();
    View.superconstructor.call(this, model);

    if (!$view || !$view.length) {
      console.error('View: $view is empty or undefined:');
      console.error($view);
      if ($view && $view.selector) {
        console.error($view ? 'selector: ' + $view.selector : '');
      }
    }

    this.model = model;
    this.$view = $view;
  }
  extend(View, Listener);

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
    View.superclass.destroy.call(this);
    this.$view.remove();
  };

  return View;
});
