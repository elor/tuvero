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

      button = $(this);
      type = $button.attr('data-system');

      controller.createTournament(type);
    });
  }
  extend(NewTournamentController, Controller);

  NewTournamentController.prototype.createTournament = function(type) {
    var tournament;

    tournament = TournamentIndex.createTournament(type, 'tac');

    if (tournament) {
      this.model.tournaments.push(tournament);
    }
  }

  return NewTournamentController;
});
