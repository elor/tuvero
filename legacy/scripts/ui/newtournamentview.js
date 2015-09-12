/**
 * NewTournamentView
 *
 * @return NewTournamentView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './newtournamentcontroller'], function(
    extend, View, NewTournamentController) {
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

    this.$view.addClass('newsystem');

    // anonymous model
    this.model.firstTeamID = firstTeamID;
    this.model.numTeams = numTeams;
    this.model.tournaments = tournaments;
    this.model.teams = teams;

    this.controller = new NewTournamentController(this);
  }
  extend(NewTournamentView, View);

  return NewTournamentView;
});
