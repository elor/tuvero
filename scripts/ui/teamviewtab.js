/**
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/listview", "ui/teamview",
  "ui/state", "ui/teammodel"
], function ($, extend, View, ListView, TeamView, State, TeamModel) {
  function TeamViewTab($tab) {
    TeamViewTab.superconstructor.call(this, undefined, $tab);

    this.team = new TeamModel();

    this.init();

    this.update();

    State.focusedteam.registerListener(this);
  }
  extend(TeamViewTab, View);

  TeamViewTab.prototype.init = function () {};

  TeamViewTab.prototype.onupdate = function () {
    this.update();
  };

  TeamViewTab.prototype.update = function () {
    this.reset();

    if (State.focusedteam.get()) {
      this.team = State.focusedteam.get();

      this.$view.find(".teamno").text(this.team.getNumber());
    }
  };

  TeamViewTab.prototype.reset = function () {
    this.team = new TeamModel();
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