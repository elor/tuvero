import $ from 'jquery'
import View from '../core/view.js'
import Strings from './strings.js'
import Browser from './browser.js'
import TimeMachineView from './timemachineview.js'
import StateSaver from './statesaver.js'
import StateFileLoadController from './statefileloadcontroller.js'
import ValueModel from '../core/valuemodel.js'
import ClassView from '../core/classview.js'
import Server from './server.js'
import LoginView from './loginview.js'
import ServerTournamentListModel from './servertournamentlistmodel.js'
import ServerTournamentView from './servertournamentview.js'
import ListView from './listview.js'
import ServerAutoloadModel from './serverautoloadmodel.js'

/**
 * represents a whole team tab
 *
 * TODO write a TabView superclass with common functions
 *
 * TODO isolate common tab-related function
 *
 * @param $tab
 *          the tab DOM element
 */
class HomeTab extends View {
  constructor ($tab) {
    super(undefined, $tab)
    this.init()
  }

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  init () {
    let $button, $container

    // TODO move to a controller
    $button = this.$view.find('button.reset')
    $button.click(function () {
      if (window.confirm(Strings.clearstorage)) {
        StateSaver.removeEverything()
      }
    })

    // TODO move to a view
    const $errorlink = this.$view.find('a.errorlink')
    $errorlink.attr('href', $errorlink.attr('href') + '&browser=' + Browser.name + ' ' + Browser.version)

    /*
     * Time Machine
     */
    $container = this.$view.find('.timemachineview')
    this.timeMachineView = new TimeMachineView($container)

    /*
     * tournament loader
     */
    $button = this.$view.find('button.load')
    this.fileLoadController = new StateFileLoadController($button)
    $container = this.$view.find('.chromerecommendation')
    this.chromeRecommendationClassView = new ClassView(new ValueModel(Browser.name === 'Chrome'), $container, 'hidden')

    /*
     * LoginView, ServerTournamentView
     */

    this.serverAutoloadModel = new ServerAutoloadModel(Server)
    this.serverTournamentListModel = new ServerTournamentListModel(Server)
    $container = this.$view.find('.servertournaments')
    const $template = $container.find('.template')
    this.serverTournamentListView = new ListView(this.serverTournamentListModel, $container, $template, ServerTournamentView)
    $container = this.$view.find('.loginview')
    this.loginView = new LoginView(Server, $container)
    if (!Server.token.get()) {
      this.loginView.loginWindowSuppressed.set(true)
      Server.createToken()
    }
  }
}

// FIXME CHEAP HACK AHEAD
$(function ($) {
  const $tab = $('#tabs > [data-tab="home"]')
  if ($tab.length && $('#testmain').length === 0) {
    return new HomeTab($tab)
  }
})
export default HomeTab
