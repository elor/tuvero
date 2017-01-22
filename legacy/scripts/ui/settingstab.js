/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './csvexportcontroller',
    'ui/fontsizeview', 'ui/servermodel', 'ui/loginview', 'ui/storage',
    'presets', 'ui/servertournamentlistmodel', 'ui/servertournamentview',
    'ui/listview'], function(extend, $, View, CSVExportController,
    FontSizeView, ServerModel, LoginView, Storage, Presets,
    ServerTournamentListModel, ServerTournamentView, ListView) {
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
  function SettingsTab($tab) {
    SettingsTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(SettingsTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  SettingsTab.prototype.init = function() {
    var $container, $input, $template;

    this.$fontsizeview = this.$view.find('.fontsizeview').eq(0);
    this.fontsizeview = new FontSizeView(this.$fontsizeview, $('body'));

    /*
     * CSV buttons
     */
    $container = this.$view.find('.csv');
    this.csvExportController = new CSVExportController(new View(undefined,
        $container));

    $container = this.$view.find('.tuvero-login');
    this.serverModel = Storage.register(Presets.names.apitoken, ServerModel);

    this.serverTournamentListModel = new ServerTournamentListModel(
        this.serverModel);
    $container = this.$view.find('.servertournaments');
    $template = $container.find('.template')
    this.serverTournamentListView = new ListView(
        this.serverTournamentListModel, $container, $template,
        ServerTournamentView);

    this.loginView = new LoginView(this.serverModel, $container);
    if (!this.serverModel.token.get()) {
      this.loginView.loginWindowSuppressed.set(true);
      this.serverModel.createToken();
    }
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="settings"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new SettingsTab($tab);
    }
  });

  return SettingsTab;
});
