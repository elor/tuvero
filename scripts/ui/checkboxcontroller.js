/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'

/**
 * Constructor
 *
 * @param view
 *          a CheckboxView instance
 */
class CheckboxController extends Controller {
  constructor (view) {
        super(view)
    const model = this.model
    const $checkbox = this.view.$view
    const $parent = $checkbox.parent().filter('span')
    $parent.click(function (e) {
      if ($(e.target).prop('tagName') === 'SPAN') {
        $checkbox.click()
      }
    })

    /**
     * apply checkbox state to model state
     */
    $checkbox.change(function () {
            const viewvalue = $checkbox.prop('checked')
      const modelvalue = model.get()
      if (viewvalue !== modelvalue) {
        model.set(viewvalue)
      }
    })
  }
}

export default CheckboxController
