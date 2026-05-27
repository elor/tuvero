import Controller from '../core/controller.js'

/**
 * Constructor
 */
class BrowserInfoController extends Controller {
  constructor (view) {
    super(view)
    this.$updateButton = this.view.$view.find('button.update')
    const model = this.model
    this.$updateButton.click(function () {
      model.emit('update')
    })
  }
}

export default BrowserInfoController
