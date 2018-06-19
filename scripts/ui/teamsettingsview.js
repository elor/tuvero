/**
 * A teamView, which sets the .teamno and .name elements of the associated DOM
 * element
 *
 * @return TeamView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/view", "ui/teamsettingscontroller",
    "core/listener"
  ],
  function (extend, View, TeamSettingsController, Listener) {

    function rankingpointsplayersum(team) {
      return team.players.map(function (player) {
        return player.rankingpoints;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }

    function TeamSettingsView(model, $view) {
      TeamSettingsView.superconstructor.call(this, model, $view);

      this.controller = new TeamSettingsController(this);

      this.update();
    }
    extend(TeamSettingsView, View);

    TeamSettingsView.prototype.update = function () {
      this.$view.find(".teamid").text(this.model.getID() + 1);

      this.$view.find(".teamnumber").val(this.model.number);
      this.$view.find(".alias").val(this.model.alias);
      this.$view.find(".club").val(this.model.club);
      this.$view.find(".rankingpoints").val(this.model.rankingpoints);
      this.$view.find(".elo").val(this.model.elo);

      this.$view.find(".rankingpointsplayersum").text(rankingpointsplayersum(this.model));
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

      Listener.prototype.destroy.call(this);
    };

    return TeamSettingsView;
  }
);