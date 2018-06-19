/**
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/listview", "ui/state",
  "ui/teammodel", "core/classview", "ui/teamsettingsview",
  "ui/playersettingsview", "list/listmodel", "ui/tabshandle",
  "ui/noregmodel", "ui/newteamview",
], function ($, extend, View, ListView, State, TeamModel, ClassView,
  TeamSettingsView, PlayerSettingsView, ListModel, TabsHandle,
  NoRegModel, NewTeamView) {

  function TeamViewTab($tab) {
    TeamViewTab.superconstructor.call(this, undefined, $tab);

    this.players = new ListModel();

    this.init();

    State.focusedteam.registerListener(this);
  }
  extend(TeamViewTab, View);

  TeamViewTab.prototype.onupdate = function () {
    this.update();
  };

  TeamViewTab.prototype.init = function () {
    var $container, $template;

    $container = this.$view.find(".hasteam");
    this.hasnoteam = new ClassView(State.focusedteam, $container, undefined, "hidden");

    $container = this.$view.find(".hasnoteam");
    this.hasnoteam = new ClassView(State.focusedteam, $container, "hidden", undefined);

    // registration / next team
    $container = this.$view.find(".newteamview");
    this.newTeamView = new NewTeamView(State.teams, $container, State.teamsize);
    // hide when registration is closed
    this.regVisibilityView = new ClassView(new NoRegModel(State.tournaments),
      $container, "hidden");

    $container = this.$view.find(".playersettings");
    $template = $container.find(".template");
    this.playerlistview = new ListView(this.players, $container, $template, PlayerSettingsView);

    this.update();
  };

  TeamViewTab.prototype.update = function () {
    this.reset();

    if (State.focusedteam.get()) {
      TabsHandle.secret("team");

      this.team = State.focusedteam.get();
      this.team.registerListener(this);

      this.team.players.forEach(function (player) {
        this.players.push(player);
      }, this);

      this.teamSettingsView = new TeamSettingsView(this.team,
        this.$view.find(".teamsettings"));

      this.updateTeamNo();
    } else {
      TabsHandle.hide("team");
    }
  };

  TeamViewTab.prototype.reset = function () {
    this.players.clear();
    if (this.team) {
      this.team.unregisterListener(this);
    }
    this.team = new TeamModel();
    if (this.teamSettingsView) {
      this.teamSettingsView.destroy();
      this.teamSettingsView = undefined;
    }
  };

  TeamViewTab.prototype.updateTeamNo = function () {
    this.$view.find(".teamno").text(this.team.getNumber());
  };

  $(function ($) {
    var $tab;

    $tab = $("#tabs > [data-tab=\"team\"]");
    if ($tab.length && $("#testmain").length === 0) {
      return new TeamViewTab($tab);
    }
  });

  return TeamViewTab;
});