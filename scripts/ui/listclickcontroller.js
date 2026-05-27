/**
 * on a list element click, runs the callback function. Can handle other events
 * as well
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'
import ValueModel from '../core/valuemodel.js'

/**
 * Constructor
 *
 * The optional argument, options, can contain multiple options:
 *
 *
 * options.active: a ValueModel instance. When it's false, events are ignored
 *
 * options.callbackthis: use as the "this" for the callback function
 *
 * options.event: use this event instead of 'click', e.g. 'mousedown'
 *
 * options.selector: use this selector instead of '>' to select specific or
 * deeper nested DOM elements
 *
 *
 * @param view
 *          a ListView instance
 * @param callback
 *          the callback function: callback(model, index)
 * @param options
 *          Optional. An option object. See above
 */
class ListClickController extends Controller {
  constructor (view, callback, options) {
    super(view)
    options = options || {}
    options.active = options.active || new ValueModel(true)
    options.callbackthis = options.callbackthis || window
    options.event = options.event || 'click'
    if (this.view.$view.prop('tagName') === 'TABLE') {
      options.selector = options.selector || '> tbody >'
    } else {
      options.selector = options.selector || '>'
    }
    const listview = this.view
    const listmodel = this.model

    /**
     * handle the click action
     */
    this.view.$view.on(options.event, options.selector, function (e) {
      let $subview, index
      if (options.active.get()) {
        $subview = $(this)
        index = listview.indexOf($subview)
        if (index !== -1) {
          callback.call(options.callbackthis, listmodel, index)
          e.preventDefault()
          return false
        }
      }
    })
  }
}

export default ListClickController
