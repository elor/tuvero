/**
 * An abstract controller class
 *
 * @return Controller
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/**
 * Controls a model, which is referenced by its view.
 *
 * Please provide additional functions for controlling and event callback,
 * e.g. after button presses
 *
 * @param view
 *          An associated instance of View
 */
class Controller {
  constructor (view) {
    this.model = view.model
    this.view = view
  }

  destroy () {}
}

export default Controller
