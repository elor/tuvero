import Listener from './listener.js'
import Model from './model.js'

/**
 * Displays a model and updates on changes to it.
 *
 * @param model
 *          The associated instance of the Model class
 * @param $view
 *          A jQuery object which is represented by this view
 */
class View extends Listener {
  constructor (model, $view) {
    model = model || new Model()
    super(model)
    if ($view === undefined || $view.length === 0) {
      console.error('View: $view is empty or undefined:')
      console.error($view)
      if ($view && $view.selector) {
        console.error($view ? 'selector: ' + $view.selector : '')
      }
    }
    this.model = model
    this.$view = $view
  }

  /**
   * resets the whole view
   */
  reset () {
    //
  }

  /**
   * update the whole view
   */
  update () {
    //
  }

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
  destroy () {
    super.destroy()
    this.$view.remove()
  }
}

export default View
