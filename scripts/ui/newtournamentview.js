/**
 * NewTournamentView
 *
 * @return NewTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["jquery", "lib/extend", "core/view", "ui/newtournamentcontroller",
  "presets"
], function ($, extend, View, NewTournamentController, Presets) {
  /**
   * Constructor
   *
   * @param firstID
   * @param lastID
   * @param $view
   * @param tournaments
   * @param teams
   */
  function NewTournamentView(firstTeamID, numTeams, $view, tournaments, teams) {
    NewTournamentView.superconstructor.call(this, undefined, $view);

    this.$view.addClass("newsystem");

    if (numTeams < 2) {
      this.$view.addClass("notenoughteams");
    }

    // anonymous model
    this.model.firstTeamID = firstTeamID;
    this.model.numTeams = numTeams;
    this.model.tournaments = tournaments;
    this.model.teams = teams;

    this.$view.find("button").each(function () {
      var $button, system;

      $button = $(this);
      system = $button.attr("data-system");

      if (system && !Presets.systems[system]) {
        $button.hide();
      }
    });

    this.controller = new NewTournamentController(this);
  }
  extend(NewTournamentView, View);

  return NewTournamentView;
});