/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', 'ui/state', 'ui/strings',
    'ui/toast', 'ui/browser', 'ui/timemachineview', 'ui/statesaver',
    'ui/statefileloadcontroller', 'core/valuemodel', 'core/classview',
    'ui/server', 'ui/loginview', 'ui/storage', 'presets',
    'ui/servertournamentlistmodel', 'ui/servertournamentview', 'ui/listview',
    'ui/serverautoloadmodel'], function(extend, $, View, State, Strings, Toast,
    Browser, TimeMachineView, StateSaver, StateFileLoadController, ValueModel,
    ClassView, Server, LoginView, Storage, Presets,
    ServerTournamentListModel, ServerTournamentView, ListView,
    ServerAutoloadModel) {
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
    var $button, $errorlink, $container, $template;

    // TODO move to a controller
    $button = this.$view.find('button.reset');
    $button.click(function() {
      if (window.confirm(Strings.clearstorage)) {
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
        Browser.name === 'Chrome'), $container, 'hidden');

    /*
     * LoginView, ServerTournamentView
     */

    this.serverAutoloadModel = new ServerAutoloadModel(Server);

    this.serverTournamentListModel = new ServerTournamentListModel(
        Server);
    $container = this.$view.find('.servertournaments');
    $template = $container.find('.template');
    this.serverTournamentListView = new ListView(
        this.serverTournamentListModel, $container, $template,
        ServerTournamentView);

    $container = this.$view.find('.loginview');
    this.loginView = new LoginView(Server, $container);
    if (!Server.token.get()) {
      this.loginView.loginWindowSuppressed.set(true);
      Server.createToken();
    }
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
