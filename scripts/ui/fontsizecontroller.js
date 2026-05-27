/**
 * Font Size Controller for adjusting the font size according to user input on
 * the FontSizeView widget
 *
 * @return FontSizeController
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
 *          the FontSizeView
 */
class FontSizeController extends Controller {
  constructor (view) {
    super(view)
    const model = this.model

    /**
     * adjust the font size at the click of a button
     */
    this.view.$view.on('click', '> button', function () {
      model.setFontSize($(this).attr('class').replace(/.*fontsize([a-z]+).*/, '$1'))
    })
  }
}

export default FontSizeController
