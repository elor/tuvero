/**
 * NewTournamentController
 *
 * @return NewTournamentController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery', 'lib/extend', 'core/controller', 'tournament/tournamentindex', 'ui/strings',
    'ui/tournamentcontroller', 'presets', 'ui/inputvalueview'], function($, extend, Controller,
    TournamentIndex, Strings, TournamentController, Presets, InputValueView) {
  /**
   * Constructor
   */
  function NewTournamentController(view) {
    var controller;
    NewTournamentController.superconstructor.call(this, view);

    controller = this;

    this.$interlacecount = this.view.$view.find('input.interlacecount');
    this.interlaceBinding = new InputValueView(
      this.model.tournaments.interlaceCount,
      this.$interlacecount
    );

    this.$tournamentsize = this.view.$view.find('input.tournamentsize');
    this.$buttons = this.view.$view.find('button[data-system]');

    this.$tournamentsize.attr('max', this.model.numTeams);
    this.$tournamentsize.val(this.model.numTeams);
    controller.updateViewHeight();

    this.$tournamentsize.on('change keypress mousewheel', function() {
      controller.updateViewHeight();
      window.setTimeout(controller.updateViewHeight.bind(controller), 1);
    });

    this.$buttons.click(function(e) {
      var $button, type, size;

      $button = $(this);
      type = $button.attr('data-system');

      size = Number(controller.$tournamentsize.val());

      controller.createTournament(type, size);
    });
  }
  extend(NewTournamentController, Controller);

  /**
   * @param size
   *          a tournament size
   * @return true if the size is valid for a tournament, false otherwise
   */
  NewTournamentController.prototype.validateSize = function(size) {
    return size >= 2 && size <= this.model.numTeams;
  };

  NewTournamentController.prototype.updateViewHeight = function() {
    var size;

    size = Number(this.$tournamentsize.val());

    if (this.validateSize(size)) {
      this.view.$view.attr('rowspan', size);
    }
  };

  NewTournamentController.prototype.createTournament = function(type, size) {
    var tournament, ranking, i, imax, rankingorder;

    if (!this.validateSize(size)) {
      return;
    }

    rankingorder = ['wins'];
    if (Presets.systems[type] && Presets.systems[type].ranking) {
      rankingorder = Presets.systems[type].ranking.slice(0);
    }

    tournament = TournamentIndex.createTournament(type, rankingorder);

    tournament.getName().set(Strings['defaultname' + tournament.SYSTEM]);

    ranking = this.model.tournaments.getGlobalRanking(this.model.teams.length);

    imax = Math.min(this.model.firstTeamID + size, //
    ranking.displayOrder.length);

    for (i = this.model.firstTeamID; i < imax; i += 1) {
      tournament.addTeam(ranking.displayOrder[i]);
    }

    if (tournament) {
      this.model.tournaments.push(tournament, this.model.firstTeamID);
    }

    TournamentController.initiateNameChange(tournament);
  };

  return NewTournamentController;
});
