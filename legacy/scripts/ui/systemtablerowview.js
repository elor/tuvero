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

    this.tournamentRank = -1;
    this.globalRank = -1;

    this.$tournamentrank = this.$view.find('.tournamentrank');
    this.$globalrank = this.$view.find('.rank');
    this.$system = undefined;

    this.tournaments.registerListener(this);

    this.updateRankTexts();
    this.updateSystem();

    this.teams.registerListener(this);
  }
  extend(SystemTableRowView, View);

  SystemTableRowView.prototype.updateRankTexts = function() {
    var ranking, globalRank, tournamentRank;

    ranking = this.tournaments.getGlobalRanking(this.teams.length);
    globalRank = ranking.globalRanks[this.index];
    tournamentRank = ranking.tournamentRanks[this.index];

    if (this.globalRank !== globalRank) {
      this.$globalrank.text(globalRank + 1);
      this.globalRank = globalRank;
    }

    if (this.tournamentRank !== tournamentRank) {
      this.$tournamentrank.text(tournamentRank + 1);
      this.tournamentRank = tournamentRank;
    }
  };

  SystemTableRowView.prototype.updateSystem = function() {
    var ranking, offset, tournamentID, rowspan;

    ranking = this.tournaments.getGlobalRanking(this.teams.length);
    tournamentID = ranking.tournamentIDs[this.index];
    offset = ranking.globalRanks[this.index];
    if (this.index !== ranking.displayOrder[offset]) {
      // increase the offset to avoid a match, since another one is the
      // "first"
      // The offset cannot "overflow", or the global ranks would differ
      offset = undefined;
    }

    if (this.$system) {
      this.$system.remove();
      this.$system = undefined;
      this.$view.removeClass('firstrow');
    }

    if (offset === ranking.tournamentOffsets[tournamentID]) {
      if (tournamentID === undefined) {
        rowspan = this.teams.length;
      } else if (ranking.tournamentOffsets[tournamentID + 1] === undefined) {
        rowspan = ranking.tournamentOffsets[undefined];
      } else {
        rowspan = ranking.tournamentOffsets[tournamentID + 1];
      }
      rowspan -= offset;

      this.$system = $('<td>').addClass('system');
      this.$system.text('Tournament ' + tournamentID);
      this.$system.attr('rowspan', rowspan);
      this.$view.append(this.$system);
      this.$view.addClass('firstrow');
    }
  };

  SystemTableRowView.prototype.onupdate = function(emitter, event, data) {
    if (emitter === this.tournaments) {
      this.updateRankTexts();
      this.updateSystem();
    }
  };

  SystemTableRowView.prototype.oninsert = function(emitter, event, data){
    if (emitter === this.teams) {
      this.updateSystem();
    }
  };

  SystemTableRowView.prototype.onremove = function(emitter, event, data){
    if (emitter === this.teams) {
      this.updateSystem();
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
