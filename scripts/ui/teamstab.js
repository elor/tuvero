/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/listview", "ui/teamview",
  "ui/state", "ui/newteamview", "ui/lengthview", "ui/teamsizeview",
  "ui/preregcloserview", "ui/checkboxview", "core/classview", "ui/tabshandle",
  "ui/teamtableview", "ui/inputview",
  "ui/teamsfileloadcontroller", "presets", "ui/noregmodel",
  "ui/deleteallteamscontroller", "ui/teamformatdownloadcontroller",
  "timemachine/timemachine", "ui/storage", "core/valuemodel"
], function ($, extend, View,
  ListView, TeamView, State, NewTeamView, LengthView, TeamSizeView,
  PreregCloserView, CheckBoxView, ClassView, TabsHandle,
  TeamTableView, InputView, TeamsFileLoadController,
  Presets, NoRegModel, DeleteAllTeamsController, TeamFormatDownloadController, TimeMachine, Storage, ValueModel) {
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
  function TeamsTab($tab) {
    TeamsTab.superconstructor.call(this, undefined, $tab);

    this.init();

    this.update();

    TimeMachine.commit.registerListener(this);
  }
  extend(TeamsTab, View);

  /**
   * initialize the tab functionality
   *
   * TODO maybe split it into multiple autodetected functions?
   */
  TeamsTab.prototype.init = function () {
    var $container, $button, value;

    // teamsize bugfix
    if (State.teamsize.get() < Presets.registration.minteamsize) {
      State.teamsize.set(Presets.registration.minteamsize);
    }
    if (State.teamsize.get() > Presets.registration.maxteamsize) {
      State.teamsize.set(Presets.registration.maxteamsize);
    }

    // registration
    $container = this.$view.find(".newteamview");
    this.newTeamView = new NewTeamView(State.teams, $container, //
      State.teamsize);

    // number of teams
    $container = this.$view.find(".nextteamnumber");
    this.lengthView = new LengthView(State.teams, $container, +1);

    // change team size
    $container = this.$view.find("> .teamsizeview");
    if ($container.length !== 0) {
      this.teamSizeView = new TeamSizeView(State.teamsize, $container);
    }

    // hide team size buttons when a team has been registered
    this.teamSizeCloserView = new PreregCloserView(State.teams, this.$view);

    // hide registration and removal buttons after the first tournament
    this.regVisibilityView = new ClassView(new NoRegModel(State.tournaments),
      this.$view, "noreg");

    // name maxwidth checkbox
    value = State.tabOptions.nameMaxWidth;
    $container = this.$view.find(">.options input.maxwidth");
    this.maxwidthCheckBoxView = new CheckBoxView(value, $container);
    this.maxwidthClassView = new ClassView(value, this.$view, "maxwidth",
      "nomaxwidth");

    // rankingpoints checkbox
    value = new ValueModel(true);
    $container = this.$view.find(">.options input.rankingpoints");
    this.rankingpointsCheckBoxView = new CheckBoxView(value, $container);
    this.rankingpointsClassView = new ClassView(value, this.$view, undefined, "hiderankingpoints");

    // update the tab when the team size changes
    if (Presets.registration.teamsizeicon) {
      TabsHandle.bindTabOpts("teams", State.teamsize);
    }

    $container = this.$view.find("button.deleteall");
    this.deleteAllTeamsController = new DeleteAllTeamsController(new View(
      undefined, $container));

    $button = this.$view.find(">button.fileloadteams");
    this.teamsFileLoadController = new TeamsFileLoadController($button);
  };

  TeamsTab.prototype.onupdate = function () {
    this.update();
  };

  TeamsTab.prototype.update = function () {
    if (TimeMachine.commit.get()) {
      TabsHandle.show("teams");
    } else {
      TabsHandle.hide("teams");
    }
  };

  // FIXME CHEAP HACK AHEAD
  $(function ($) {
    var $tab;

    $tab = $("#tabs > [data-tab=\"teams\"]");
    if ($tab.length && $("#testmain").length === 0) {
      return new TeamsTab($tab);
    }
  });

  return TeamsTab;
});