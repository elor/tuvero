/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './storage', './strings',
    './toast', './loadedimagesview', './browserinfoview',
    './registerteamscontroller', './registeridscontroller',
    './requiremodsshortcut', './finishroundcontroller', './debug',
    './tabshandle', 'timemachine/timemachine', 'ui/stateloader'], function(
    extend, $, View, Storage, Strings, Toast, LoadedImagesView,
    BrowserInfoView, RegisterTeamsController, RegisterIDsController,
    RequireModsShortcut, FinishRoundController, Debug, TabsHandle, TimeMachine,
    StateLoader) {
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
  function DebugTab($tab) {
    DebugTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(DebugTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  DebugTab.prototype.init = function() {
    var $container, $button;

    /*
     * Show Tab in dev versions
     */
    if (!Debug.isDevVersion) {
      TabsHandle.direct.getTabModel('debug').visibility.set(false);
    }

    /*
     * show browser info
     */
    $container = this.$view.find('.browser');
    this.browserNameView = new BrowserInfoView($container);

    /*
     * button: clear all
     */
    $container = this.$view.find('.register .delete');
    $container.click(function() {
      StateLoader.unload();
      while (TimeMachine.roots.length > 0) {
        TimeMachine.roots.get(0).eraseTree();
      }
      window.localStorage.clear();
      Storage.clear();
      new Toast(Strings.reset);
    });

    /*
     * images at pageload
     */
    $container = this.$view.find('.allimages');
    this.allImages = new LoadedImagesView($container);

    $container;

    /*
     * buttons: register teams
     */
    $button = this.$view.find('button.registerteams');
    $container = this.$view.find('input.numteams');
    this.registerTeamsController = new RegisterTeamsController($button,
        $container);

    /*
     * buttons: register teams
     */
    $button = this.$view.find('button.registerids');
    $container = this.$view.find('input.numteams');
    this.registerIDsController = new RegisterIDsController($button, //
    $container);

    this.mods = new RequireModsShortcut();

    /*
     * button: finish matches
     */
    $button = this.$view.find('button.finishround');
    this.finishRound = new FinishRoundController($button);
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="debug"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new DebugTab($tab);
    }
  });

  return DebugTab;
});
