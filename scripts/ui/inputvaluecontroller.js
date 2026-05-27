/**
 * InputValueController
 *
 * @return InputValueController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import Controller from '../core/controller.js'

/**
 * Constructor
 */
class InputValueController extends Controller {
  constructor (view) {
        super(view)
    const controller = this
    this.view.$view.change(function () {
      controller.model.set(Number(controller.view.$view.val()))
    })
  }
}

export default InputValueController
