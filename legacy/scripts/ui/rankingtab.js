/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './listview', 'ui/state',
    './checkboxview', 'core/classview', './tournamentrankingview',
    './closedtournamentcollapselistener'], function(extend, $, View, ListView,
    State, CheckBoxView, ClassView, TournamentRankingView,
    ClosedTournamentCollapseListener) {
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

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth;
    $container = this.$view.find('>.options input.maxwidth');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, 'maxwidth',
        'nomaxwidth');

    // player names checkbox
    value = State.tabOptions.showNames;
    $container = this.$view.find('>.options input.shownames');
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, undefined,
        'hidenames');

    // list/table selection checkbox
    this.rankingabbreviations = State.tabOptions.rankingAbbreviations;
    $container = this.$view.find('>.options input.abbreviate');
    this.abbreviateCheckBoxView = new CheckBoxView(this.rankingabbreviations,
        $container);

    // rankinglist
    $container = this.$view.find('.tournamentlist');
    $template = $container.find('.tournament.template');
    this.tournamentList = new ListView(State.tournaments, $container,
        $template, TournamentRankingView, State.teams,
        this.rankingabbreviations);

    // HACK: close tournaments
    this.collapseListener = new ClosedTournamentCollapseListener(
        this.tournamentList);
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
