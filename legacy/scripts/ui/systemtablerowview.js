/**
 * SystemTableRowView
 *
 * @return SystemTableRowView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './teamview'], function(extend, View,
    TeamView) {
  /**
   * Constructor
   *
   * @param index
   * @param $view
   * @param teams
   * @param tournaments
   */
  function SystemTableRowView(index, $view, teams, tournaments) {
    SystemTableRowView.superconstructor.call(this, undefined, $view);

    this.index = index;
    this.teams = teams;
    this.tournaments = tournaments;
    this.teamView = new TeamView(teams.get(index), this.$view);

    this.$tournamentrank = this.$view.find('.tournamentrank');
    this.$globalrank = this.$view.find('.rank');

    this.tournaments.registerListener(this);

    this.updateRankTexts();
  }
  extend(SystemTableRowView, View);

  SystemTableRowView.prototype.updateRankTexts = function() {
    ranking = this.tournaments.getGlobalRanking(this.teams);

    this.$tournamentrank.text(ranking.tournamentRanks[this.index] + 1);
    this.$globalrank.text(ranking.globalRanks[this.index] + 1);
  };

  SystemTableRowView.prototype.onupdate = function(emitter, event, data) {
    if (emitter === this.tournaments) {
      this.updateRankTexts();
    }
  };

  SystemTableRowView.bindLists = function(teams, tournaments) {
    function BoundSystemTableRowView(index, $view) {
      BoundSystemTableRowView.superconstructor.call(this, index, $view, teams,
          tournaments);
    }
    extend(BoundSystemTableRowView, SystemTableRowView);

    return BoundSystemTableRowView;
  };

  return SystemTableRowView;
});
