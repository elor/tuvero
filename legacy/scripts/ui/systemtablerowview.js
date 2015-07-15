/**
 * SystemTableRowView
 *
 * @return SystemTableRowView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './teamview', './generictournamentview'//
], function(extend, View, TeamView, GenericTournamentView) {
  /**
   * Constructor
   *
   * @param index
   * @param $view
   * @param teams
   * @param tournaments
   * @param tournamentViewFactory
   */
  function SystemTableRowView(index, $view, teams, tournaments,
      tournamentViewFactory) {
    SystemTableRowView.superconstructor.call(this, undefined, $view);

    this.index = index;
    this.teams = teams;
    this.tournaments = tournaments;
    this.teamView = new TeamView(teams.get(index), this.$view);

    this.tournamentRank = -1;
    this.globalRank = -1;

    this.$tournamentrank = this.$view.find('.tournamentrank');
    this.$globalrank = this.$view.find('.rank');
    this.tournamentView = undefined;
    this.tournamentViewFactory = tournamentViewFactory;

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
    var ranking, offset, tournamentID, rowspan, $view;

    ranking = this.tournaments.getGlobalRanking(this.teams.length);
    tournamentID = ranking.tournamentIDs[this.index];
    offset = ranking.globalRanks[this.index];
    if (this.index !== ranking.displayOrder[offset]) {
      // increase the offset to avoid a match, since another one is the
      // "first"
      // The offset cannot "overflow", or the global ranks would differ
      offset = undefined;
    }

    // TODO check if the IDs match and only update the rowspan.
    if (this.tournamentView) {
      this.tournamentView.$view.remove();
      this.tournamentView.destroy();
      this.tournamentView = undefined;
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

      $view = $('<td>').addClass('system');
      $view.attr('rowspan', rowspan);

      this.tournamentView = this.tournamentViewFactory.create(this.tournaments
          .get(tournamentID), $view);
      if (this.tournamentView) {
        this.$view.append($view);
        this.$view.addClass('firstrow');
      }
    }
  };

  SystemTableRowView.prototype.onupdate = function(emitter, event, data) {
    if (emitter === this.tournaments) {
      this.updateRankTexts();
      this.updateSystem();
    }
  };

  SystemTableRowView.prototype.oninsert = function(emitter, event, data) {
    if (emitter === this.teams) {
      this.updateSystem();
    }
  };

  SystemTableRowView.prototype.onremove = function(emitter, event, data) {
    if (emitter === this.teams) {
      this.updateSystem();
    }
  };

  /**
   *
   * @param teams
   * @param tournaments
   * @param tournamentViewFactory
   * @returns {Function}
   */
  SystemTableRowView.bindLists = function(teams, tournaments,
      tournamentViewFactory) {
    function BoundSystemTableRowView(index, $view) {
      BoundSystemTableRowView.superconstructor.call(this, index, $view, teams,
          tournaments, tournamentViewFactory);
    }
    extend(BoundSystemTableRowView, SystemTableRowView);

    return BoundSystemTableRowView;
  };

  return SystemTableRowView;
});
