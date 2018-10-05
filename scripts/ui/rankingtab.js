/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "jquery", "core/view", "ui/listview", "ui/state",
    "ui/checkboxview", "core/classview", "ui/tournamentrankingview",
    "ui/tabshandle", "ui/closedtournamentcollapselistener"], function (extend, $,
    View, ListView, State, CheckBoxView, ClassView, TournamentRankingView,
    TabsHandle, ClosedTournamentCollapseListener) {
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

    this.update();

    State.tournaments.registerListener(this);
  }
  extend(RankingTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  RankingTab.prototype.init = function () {
    var $template, $container, value;

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth;
    $container = this.$view.find(">.options input.maxwidth");
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, "maxwidth",
        "nomaxwidth");

    // player names checkbox
    value = State.tabOptions.showNames;
    $container = this.$view.find(">.options input.shownames");
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, undefined,
        "hidenames");

    // list/table selection checkbox
    this.rankingabbreviations = State.tabOptions.rankingAbbreviations;
    $container = this.$view.find(">.options input.abbreviate");
    this.abbreviateCheckBoxView = new CheckBoxView(this.rankingabbreviations,
        $container);

    // rankinglist
    $container = this.$view.find(".tournamentlist");
    $template = $container.find(".tournament.template");
    this.tournamentList = new ListView(State.tournaments, $container,
        $template, TournamentRankingView, State.teams,
        this.rankingabbreviations);

    // HACK: close tournaments
    this.collapseListener = new ClosedTournamentCollapseListener(
        this.tournamentList);
  };

  /**
   * show/hide the tab and update it as necessary
   */
  RankingTab.prototype.update = function () {
    var i, isRunning;

    isRunning = false;

    for (i = 0; !isRunning && i < State.tournaments.length; i += 1) {
      isRunning = State.tournaments.get(i).getState().get() !== "initial";
    }

    if (isRunning) {
      TabsHandle.show("ranking");
    } else {
      TabsHandle.hide("ranking");
    }
  };

  /**
   * a tournament state has been changed
   *
   * @param emitter
   * @param event
   * @param data
   */
  RankingTab.prototype.onupdate = function (emitter, event, data) {
    if (emitter !== State.tournaments) {
      this.update();
    }
  };

  /**
   * a tournament has been added
   *
   * @param emitter
   * @param event
   * @param data
   */
  RankingTab.prototype.oninsert = function (emitter, event, data) {
    data.object.getState().registerListener(this);
    this.update();
  };

  /**
   * a tournament has been removed
   *
   * @param emitter
   * @param event
   * @param data
   */
  RankingTab.prototype.onremove = function (emitter, event, data) {
    data.object.getState().unregisterListener(this);
    this.update();
  };

  // FIXME CHEAP HACK AHEAD
  $(function ($) {
    var $tab;

    $tab = $("#tabs > [data-tab=\"ranking\"]");
    if ($tab.length && $("#testmain").length === 0) {
      return new RankingTab($tab);
    }
  });

  return RankingTab;
});
