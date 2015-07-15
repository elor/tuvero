/**
 * NewTournamentController
 *
 * @return NewTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/tournamentindex'], function(
    extend, Controller, TournamentIndex) {
  /**
   * Constructor
   */
  function NewTournamentController(view) {
    var controller;
    NewTournamentController.superconstructor.call(this, view);

    controller = this;

    this.$buttons = this.view.$view.find('button[data-system]');

    this.$buttons.click(function(e) {
      var $button, type;

      $button = $(this);
      type = $button.attr('data-system');

      controller.createTournament(type);
    });
  }
  extend(NewTournamentController, Controller);

  NewTournamentController.prototype.createTournament = function(type) {
    var tournament, ranking, i, imax;

    tournament = TournamentIndex.createTournament(type, ['tac']);

    ranking = this.model.tournaments.getGlobalRanking(this.model.teams.length);

    imax = Math.min(this.model.firstTeamID + this.model.numTeams,
        ranking.displayOrder.length);

    if (tournament) {
      this.model.tournaments.push(tournament);
    }

    for (i = this.model.firstTeamID; i < imax; i += 1) {
      tournament.addTeam(ranking.displayOrder[i]);
    }
  }

  return NewTournamentController;
});
