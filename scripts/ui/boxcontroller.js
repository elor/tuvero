/**
 * Box Controller for catching collapse-by-click events
 *
 * @return BoxController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/controller'], function (extend, Controller) {
  /**
   * Constructor, in which a click to the header is bound to sending a a toggle
   * event over the model.
   *
   * @param view
   *          the instance of BoxView which will be controlled
   */
  function BoxController (view) {
    BoxController.superconstructor.call(this, view)

    this.view.$view.on('click', '> h3:first-child', this.toggle.bind(this))
  }
  extend(BoxController, Controller)

  BoxController.prototype.toggle = function (evt) {
    if (evt.target.nodeName.toLowerCase() === 'input') {
      evt.preventDefault()
      return false
    }

    this.model.emit('toggle')
  }

  return BoxController
})
