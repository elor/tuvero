/**
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/listview", "ui/teamview",
  "ui/state", "ui/teammodel", "core/classview", "ui/teamsettingsview",
  "ui/playersettingsview", "list/listmodel", "ui/tabshandle"
], function ($, extend, View, ListView, TeamView, State, TeamModel, ClassView,
  TeamSettingsView, PlayerSettingsView, ListModel, TabsHandle) {

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

      this.team.players.forEach(function (player) {
        this.players.push(player);
      }, this);

      this.teamSettingsView = new TeamSettingsView(this.team,
        this.$view.find(".teamsettings"));

      this.$view.find(".teamno").text(this.team.getNumber());
    } else {
      TabsHandle.hide("team");
    }
  };

  TeamViewTab.prototype.reset = function () {
    this.players.clear();
    this.team = new TeamModel();
    if (this.teamSettingsView) {
      this.teamSettingsView.destroy();
      this.teamSettingsView = undefined;
    }
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