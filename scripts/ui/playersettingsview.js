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
    "ui/playersettingscontroller",
    "ui/playermodel"
  ],
  function (extend, View, PlayerSettingsController, PlayerModel) {
    function PlayerSettingsView(model, $view, teamref) {
      PlayerSettingsView.superconstructor.call(this, model, $view);

      this.controller = new PlayerSettingsController(this, teamref);

      this.update();
    }
    extend(PlayerSettingsView, View);

    PlayerSettingsView.prototype.update = function () {
      this.$view.find(".alias").val(this.model.alias === PlayerModel.NONAME ? "" : this.model.alias);
      this.$view.find(".firstname").val(this.model.firstname);
      this.$view.find(".lastname").val(this.model.lastname);
      this.$view.find(".club").val(this.model.club);
      this.$view.find(".email").val(this.model.email);
      this.$view.find(".license").val(this.model.license);
      this.$view.find(".rankingpoints").val(this.model.rankingpoints);
      this.$view.find(".elo").val(this.model.elo);
    };

    PlayerSettingsView.prototype.onupdate = function () {
      this.update();
    };

    PlayerSettingsView.bindTeamList = function (teamlist) {
      function IndexTeamView(teamID, $view) {
        IndexTeamView.superconstructor.call(this, teamlist.get(teamID), $view);
      }
      extend(IndexTeamView, PlayerSettingsView);

      return IndexTeamView;
    };

    PlayerSettingsView.prototype.destroy = function () {
      this.controller.destroy();

      PlayerSettingsView.superclass.destroy.call(this);
    };

    return PlayerSettingsView;
  }
);