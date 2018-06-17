/**
 * A teamView, which sets the .teamno and .name elements of the associated DOM
 * element
 *
 * @return TeamView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(
  [
    "lib/extend",
    "core/view",
    "core/type",
    "ui/playersettingscontroller",
    "core/listener"
  ],
  function (extend, View, Type, PlayerSettingsController, Listener) {
    function TeamSettingsView(model, $view) {
      TeamSettingsView.superconstructor.call(this, model, $view);

      this.controller = new PlayerSettingsController(this);

      this.update();
    }
    extend(TeamSettingsView, View);

    TeamSettingsView.prototype.update = function () {
      this.$view.find(".alias").val(this.model.alias);
      this.$view.find(".firstname").val(this.model.firstname);
      this.$view.find(".lastname").val(this.model.lastname);
      this.$view.find(".club").val(this.model.club);
      this.$view.find(".email").val(this.model.email);
      this.$view.find(".license").val(this.model.license);
      this.$view.find(".rankingpoints").val(this.model.rankingpoints);
      this.$view.find(".elo").val(this.model.elo);
    };

    TeamSettingsView.prototype.onupdate = function () {
      this.update();
    };

    TeamSettingsView.bindTeamList = function (teamlist) {
      function IndexTeamView(teamID, $view) {
        IndexTeamView.superconstructor.call(this, teamlist.get(teamID), $view);
      }
      extend(IndexTeamView, TeamSettingsView);

      return IndexTeamView;
    };

    TeamSettingsView.prototype.destroy = function () {
      this.controller.destroy();

      TeamSettingsView.superclass.destroy.call(this);
    };

    return TeamSettingsView;
  }
);