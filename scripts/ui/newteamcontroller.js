/**
 * Controller for adding a new player and handling invalid player names on input
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(["jquery", "lib/extend", "core/controller", "ui/playermodel",
  "ui/teammodel"
], function ($, extend, Controller, PlayerModel, TeamModel) {

  function NewTeamController(view) {
    NewTeamController.superconstructor.call(this, view);

    this.$players = this.view.$players;
    this.$rankingpoints = this.view.$rankingpoints;

    this.view.$view.find("input").keydown(this.filterEnterKeyDown.bind(this));
    this.view.$button.click(this.createNewTeam.bind(this));
  }
  extend(NewTeamController, Controller);

  NewTeamController.prototype.readPlayerNames = function () {
    var names;

    names = this.$players.map(function (id, player) {
      var $player;
      $player = $(player);

      if ($player.prop("disabled")) {
        return undefined;
      }
      return $player.val();
    }).get();

    while (names.length > 0 && names[names.length - 1] === undefined) {
      names.pop();
    }

    return names;
  };

  NewTeamController.prototype.filterEnterKeyDown = function (e) {
    if (e.which === 13) {
      this.createNewTeam();
      e.preventDefault();
      return false;
    }
  };

  NewTeamController.prototype.createNewTeam = function () {
    var names, players;

    names = this.readPlayerNames();

    if (names.length === 0) {
      console.error("NewTeamController: all input fields disabled?");
      return;
    }

    players = names.map(function (name) {
      var player, team;

      player = new PlayerModel(name);

      if (player.getName() === PlayerModel.NONAME) {
        return undefined;
      }

      return player;
    });

    if (players.indexOf(undefined) === -1) {
      team = new TeamModel(players);
      team.rankingpoints = this.$rankingpoints.val();

      this.model.push(team);
      this.view.resetFields();
    }

    this.view.focusEmpty();
  };

  return NewTeamController;
});