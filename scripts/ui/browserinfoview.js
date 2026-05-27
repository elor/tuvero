import View from '../core/view.js'
import Browser from './browser.js'
import Toast from './toast.js'
import BrowserInfoController from './browserinfocontroller.js'
import Update from './update.js'

/**
 * Constructor
 */
class BrowserInfoView extends View {
  constructor ($view) {
    super(undefined, $view)
    this.$name = this.$view.find('.name')
    this.$version = this.$view.find('.version')
    this.$online = this.$view.find('.online')
    this.$local = this.$view.find('.local')
    this.$cached = this.$view.find('.cached')
    this.controller = new BrowserInfoController(this)
    this.update()
  }

  update () {
    Browser.update()
    this.$name.text(Browser.name)
    this.$version.text(Browser.version)
    this.$online.text(Browser.online)
    this.$local.text(Browser.local)
    this.$cached.text(Browser.cached)
  }

  onupdate () {
    this.update()
    Update()
    Toast.once('update')
  }
}

export default BrowserInfoView
