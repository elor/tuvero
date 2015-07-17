/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './listview', './state_new',
    'core/valuemodel', './checkboxview', 'core/classview', 'options',
    './tournamentmatchesview'],//
function(extend, $, View, ListView, State, ValueModel, CheckboxView, ClassView,
    Options, TournamentMatchesView) {
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
  function GamesTab($tab) {
    GamesTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(GamesTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  GamesTab.prototype.init = function() {
    var $template, $container, value;

    // tournamentlist
    $container = this.$view.find('.tournamentlist');
    $template = $container.find('.tournament.template');
    this.teamList = new ListView(State.tournaments, $container, $template,
        TournamentMatchesView, State.teams);

    // name maxwidth checkbox
    value = new ValueModel();
    $container = this.$view.find('>.options input.maxwidth');
    this.maxwidthCheckboxView = new CheckboxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
        'nomaxwidth');

    // player names checkbox
    value = new ValueModel();
    $view = this.$view.find('>.options input.shownames');
    this.maxwidthCheckboxView = new CheckboxView(value, $view);
    this.maxwidthClassView = new ClassView(value, this.$view, undefined,
        'hidenames');

    // list/table selection checkbox
    value = new ValueModel();
    $container = this.$view.find('>.options input.showtable');
    this.showtableCheckboxView = new CheckboxView(value, $container);
    this.showtableClassView = new ClassView(value, this.$view, 'showtable');

    // hide teamTable content depending on state
    // this.teamTableView = new TeamTableView(this.teamTable,
    // State.teamsize);

    // $container = this.$view.find('>.filereader input');
    // this.teamsFileLoadController = new TeamsFileLoadController(new
    // InputView(
    // $container));
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="games"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new GamesTab($tab);
    }
  });

  return GamesTab;
});