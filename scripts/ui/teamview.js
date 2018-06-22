/**
 * A teamView, which sets the .teamno and .name elements of the associated DOM
 * element
 *
 * @return TeamView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["lib/extend", "core/view", "core/type", "ui/teamcontroller"], //
  function (extend, View, Type, TeamController) {
    function TeamView(model, $view, teamlist) {
      if (Type.isNumber(model) && teamlist !== undefined) {
        model = teamlist.get(model);
      }
      TeamView.superconstructor.call(this, model, $view);

      this.teamController = new TeamController(this);

      this.update();
    }
    extend(TeamView, View);

    TeamView.prototype.update = function () {
      var $names, i, $name, $teamno, player, $rankingpoints;

      $teamno = this.$view.find(".teamno");
      if ($teamno.length === 0) {
        $teamno = this.$view.filter(".teamno");
      }
      $teamno.text(this.model.getNumber());

      $rankingpoints = this.$view.find(".rankingpoints");
      $rankingpoints.text(this.model.rankingpoints);

      $names = this.$view.find(".name");
      if ($names.length === 0) {
        $names = this.$view.filter(".name");
      }

      // FIXME read maxteamsize from options or something
      for (i = 0; i < 3; i += 1) {
        $name = $names.eq(i);
        player = this.model.getPlayer(i);

        if (player) {
          $name.text(player.getName());
        } else {
          $name.remove();
        }
      }
    };

    TeamView.prototype.onupdate = function () {
      this.update();
    };

    TeamView.bindTeamList = function (teamlist) {
      function IndexTeamView(teamID, $view) {
        IndexTeamView.superconstructor.call(this, teamlist.get(teamID), $view);
      }
      extend(IndexTeamView, TeamView);

      return IndexTeamView;
    };

    TeamView.destroy = function () {
      this.teamController.destroy();

      TeamView.superclass.destroy.call(this);
    };

    return TeamView;
  });