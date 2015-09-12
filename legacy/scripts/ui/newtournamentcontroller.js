/**
 * NewTournamentController
 *
 * @return NewTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', 'core/tournamentindex', './strings',
    './tournamentcontroller'], function(extend, Controller, TournamentIndex,
    Strings, TournamentController) {
  /**
   * Constructor
   */
  function NewTournamentController(view) {
    var controller, $tournamentsize;
    NewTournamentController.superconstructor.call(this, view);

    controller = this;

    this.$tournamentsize = this.view.$view.find('input.tournamentsize');
    this.$buttons = this.view.$view.find('button[data-system]');

    this.$tournamentsize.attr('max', this.model.numTeams);
    this.$tournamentsize.val(this.model.numTeams);

    $tournamentsize = this.$tournamentsize;

    this.$buttons.click(function(e) {
      var $button, type, size;

      $button = $(this);
      type = $button.attr('data-system');

      size = Number($tournamentsize.val());

      controller.createTournament(type, size);
    });
  }
  extend(NewTournamentController, Controller);

  NewTournamentController.prototype.createTournament = function(type, size) {
    var tournament, ranking, i, imax;

    if (!(size >= 2 && size <= this.model.numTeams)) {
      this.$tournamentsize.val(this.model.numTeams);
      return;
    }

    tournament = TournamentIndex.createTournament(type, ['wins']);

    tournament.getName().set(Strings['defaultname' + tournament.SYSTEM]);

    ranking = this.model.tournaments.getGlobalRanking(this.model.teams.length);

    imax = Math.min(this.model.firstTeamID + size, //
    ranking.displayOrder.length);

    if (tournament) {
      this.model.tournaments.push(tournament);
    }

    for (i = this.model.firstTeamID; i < imax; i += 1) {
      tournament.addTeam(ranking.displayOrder[i]);
    }

    TournamentController.initiateNameChange(tournament);
  };

  return NewTournamentController;
});
