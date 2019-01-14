/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'ui/storage', 'ui/strings',
  'ui/toast', 'ui/loadedimagesview', 'ui/browserinfoview',
  'ui/registerteamscontroller', 'ui/registeridscontroller',
  'ui/requiremodsshortcut', 'ui/finishroundcontroller', 'ui/debug',
  'ui/tabshandle', 'ui/statesaver', 'ui/startroundcontroller'
], function (extend, $, View, Storage,
  Strings, Toast, LoadedImagesView, BrowserInfoView, RegisterTeamsController,
  RegisterIDsController, RequireModsShortcut, FinishRoundController, Debug,
  TabsHandle, StateSaver, StartRoundController) {
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
  function DebugTab ($tab) {
    DebugTab.superconstructor.call(this, undefined, $tab)

    this.init()
  }
  extend(DebugTab, View)

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  DebugTab.prototype.init = function () {
    var $container, $button

    /*
     * Show Tab in dev versions
     */
    if (!Debug.isDevVersion) {
      TabsHandle.secret('debug')
    }

    /*
     * show browser info
     */
    $container = this.$view.find('.browser')
    this.browserNameView = new BrowserInfoView($container)

    /*
     * button: clear all
     */
    $container = this.$view.find('.register .delete')
    $container.click(function () {
      StateSaver.removeEverything()
      Storage.clear()
      if (window.localStorage) {
        window.localStorage.clear()
      }
      Toast.once(Strings.reset)
    })

    /*
     * images at pageload
     */
    $container = this.$view.find('.allimages')
    this.allImages = new LoadedImagesView($container)

    /*
     * buttons: register teams
     */
    $button = this.$view.find('button.registerteams')
    $container = this.$view.find('input.numteams')
    this.registerTeamsController = new RegisterTeamsController($button,
      $container)

    /*
     * buttons: register teams
     */
    $button = this.$view.find('button.registerids')
    $container = this.$view.find('input.numteams')
    this.registerIDsController = new RegisterIDsController($button, //
      $container)

    this.mods = new RequireModsShortcut()

    /*
     * button: finish matches
     */
    $button = this.$view.find('button.finishround')
    this.finishRound = new FinishRoundController($button)

    $button = this.$view.find('button.finishroundrandom')
    this.finishRoundRandom = new FinishRoundController($button, true)

    $button = this.$view.find('button.startround')
    this.startRound = new StartRoundController($button)
  }

  // FIXME CHEAP HACK AHEAD
  $(function ($) {
    var $tab

    $tab = $('#tabs > [data-tab="debug"]')
    if ($tab.length && $('#testmain').length === 0) {
      return new DebugTab($tab)
    }
  })

  return DebugTab
})
