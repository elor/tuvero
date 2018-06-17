/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/listview", "ui/teamview",
  "ui/state", "ui/teammodel", "core/classview", "ui/teamsettingsview"
], function ($, extend, View, ListView, TeamView, State, TeamModel, ClassView,
  TeamSettingsView) {

  function TeamViewTab($tab) {
    TeamViewTab.superconstructor.call(this, undefined, $tab);

    this.init();

    State.focusedteam.registerListener(this);
  }
  extend(TeamViewTab, View);

  TeamViewTab.prototype.onupdate = function () {
    this.update();
  };

  TeamViewTab.prototype.init = function () {
    var $container;

    $container = this.$view.find(".hasteam");
    this.hasnoteam = new ClassView(State.focusedteam, $container, undefined, "hidden");

    $container = this.$view.find(".hasnoteam");
    this.hasnoteam = new ClassView(State.focusedteam, $container, "hidden", undefined);

    this.update();
  };

  TeamViewTab.prototype.update = function () {
    this.reset();

    if (State.focusedteam.get()) {
      this.team = State.focusedteam.get();
      this.teamSettingsView = new TeamSettingsView(this.team, this.$view.find(".teamsettings"));

      this.$view.find(".teamno").text(this.team.getNumber());
    }
  };

  TeamViewTab.prototype.reset = function () {
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