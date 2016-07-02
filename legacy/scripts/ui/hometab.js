/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'ui/state', './strings',
    './toast', './browser', 'ui/timemachineview', 'ui/statesaver',
    'ui/statefileloadcontroller', 'core/valuemodel', 'core/classview',
    'ui/browser'], function(extend, $, View, State, Strings, Toast, Browser,
    TimeMachineView, StateSaver, StateFileLoadController, ValueModel,
    ClassView, Browser) {
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
  function HomeTab($tab) {
    HomeTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(HomeTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  HomeTab.prototype.init = function() {
    var $button, $errorlink, browserstring, $container, $input;

    // TODO move to a controller
    $button = this.$view.find('button.reset');
    $button.click(function() {
      if (confirm(Strings.clearstorage)) {
        StateSaver.removeEverything();
      }
    });

    // TODO move to a view
    $errorlink = this.$view.find('a.errorlink');
    $errorlink.attr('href', $errorlink.attr('href') + '&browser='
        + Browser.name + ' ' + Browser.version);

    /*
     * Time Machine
     */
    $container = this.$view.find('.timemachineview');
    this.timeMachineView = new TimeMachineView($container);

    /*
     * tournament loader
     */
    $button = this.$view.find('button.load');
    this.fileLoadController = new StateFileLoadController($button);

    $container = this.$view.find('.chromerecommendation');
    this.chromeRecommendationClassView = new ClassView(new ValueModel(
        Browser.name == 'Chrome'), $container, 'hidden');

  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="home"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new HomeTab($tab);
    }
  });

  return HomeTab;
});
