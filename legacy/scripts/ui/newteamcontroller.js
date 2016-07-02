/**
 * Controller for adding a new player and handling invalid player names on input
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['jquery', 'lib/extend', 'core/controller', './playermodel',
    './teammodel'], function($, extend, Controller, PlayerModel, TeamModel) {
  /**
   * Constructor
   *
   * @param view
   *          the associated NewTeamView
   */
  function NewTeamController(view) {
    var controller;
    NewTeamController.superconstructor.call(this, view);

    controller = this;

    this.$players = this.view.$players;

    /*
     * add a new team at form submission
     */
    this.view.$view.submit(function(e) {
      controller.createNewTeam();
      e.preventDefault();
      return false;
    });
  }
  extend(NewTeamController, Controller);

  /**
   * reads the playernames from the newteam form
   *
   * @return an array of player names
   */
  NewTeamController.prototype.readPlayerNames = function() {
    var names;

    names = this.$players.map(function(id, player) {
      var $player;
      $player = $(player);

      if ($player.prop('disabled')) {
        return undefined;
      }
      return $player.val();
    }).get();

    while (names.length > 0 && names[names.length - 1] === undefined) {
      names.pop();
    }

    return names;
  };

  /**
   * Add a new team after reading the names from the registered input fields and
   * push it to this.model, which is supposed to be a ListModel.
   *
   * If a player name is invalid (whitespace-only or empty), team creation is
   * aborted and the first invalid input field is focused
   */
  NewTeamController.prototype.createNewTeam = function() {
    var names, players;

    names = this.readPlayerNames();

    if (names.length === 0) {
      console.error('NewTeamController: all input fields disabled?');
      return;
    }

    players = names.map(function(name) {
      var player;

      player = new PlayerModel(name);

      if (player.getName() === PlayerModel.NONAME) {
        return undefined;
      }

      return player;
    });

    if (players.indexOf(undefined) === -1) {
      this.model.push(new TeamModel(players));
      this.view.resetNames();
    }

    this.view.focusEmpty();
  };

  return NewTeamController;
});
