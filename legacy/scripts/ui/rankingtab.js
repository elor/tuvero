/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './listview', './state_new',
    'core/valuemodel', './checkboxview', 'core/classview', 'options',
    './tournamentrankingview'], function(extend, $, View, ListView, State,
    ValueModel, CheckboxView, ClassView, Options, TournamentRankingView) {
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
  function RankingTab($tab) {
    RankingTab.superconstructor.call(this, undefined, $tab);

    this.init();
  }
  extend(RankingTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  RankingTab.prototype.init = function() {
    var $template, $container, value;

    // rankinglist
    $container = this.$view.find('.tournamentlist');
    $template = $container.find('.tournament.template');
    this.teamList = new ListView(State.tournaments, $container, $template,
        TournamentRankingView, State.teams);

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
  };

  // FIXME CHEAP HACK AHEAD
  $(function($) {
    var $tab;

    $tab = $('#tabs > [data-tab="ranking"]');
    if ($tab.length && $('#testmain').length === 0) {
      return new RankingTab($tab);
    }
  });

  return RankingTab;
});
