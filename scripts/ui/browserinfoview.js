import View from '../core/view.js'
import Browser from './browser.js'
import Toast from './toast.js'
import BrowserInfoController from './browserinfocontroller.js'

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
    this.updateServiceWorkerInfo()
  }

  updateServiceWorkerInfo () {
    const $swbuild = this.$view.find('.swbuild')
    if (!$swbuild.length || !navigator.serviceWorker ||
        !navigator.serviceWorker.controller) {
      return
    }
    const view = this
    const channel = new MessageChannel()
    channel.port1.onmessage = function (event) {
      const info = event.data || {}
      $swbuild.text(info.version || '?')
      view.$view.find('.swbuildtime').text(info.builtAt || '?')
    }
    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_INFO' }, [channel.port2])
  }

  onupdate () {
    this.update()
    // Manual update check: ask the tuvero.de service worker to
    // re-fetch itself (the AppCache-era Update() equivalent).
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration('/').then(function (reg) {
        if (reg) reg.update()
      }).catch(function () {})
    }
    Toast.once('update')
  }
}

export default BrowserInfoView
