/**
 * SystemTableRowView
 *
 * @return SystemTableRowView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view', './teamview', './newtournamentview',
    './generictournamentview'], function(extend, View, TeamView,
    NewTournamentView, GenericTournamentView) {
  /**
   * Constructor
   *
   * @param index
   *          the team index for this line
   * @param $view
   *          the DOM element of a single table row
   * @param teams
   *          a ListModel of TeamModels
   * @param tournaments
   *          a ListModel of TournamentModels
   * @param viewPopulator
   *          a TournamentViewPopulator instance for creation of the ".system"
   *          cells
   */
  function SystemTableRowView(index, $view, teams, tournaments, viewPopulator,
      $newTournamentTemplate) {
    SystemTableRowView.superconstructor.call(this, undefined, $view);

    this.index = index;
    this.teams = teams;
    this.tournaments = tournaments;
    this.teamView = new TeamView(teams.get(index), this.$view);

    this.tournamentRank = -1;
    this.globalRank = -1;

    this.updatepending = undefined;

    this.$tournamentrank = this.$view.find('.tournamentrank');
    this.$globalrank = this.$view.find('.rank');
    this.tournamentView = undefined;
    this.viewPopulator = viewPopulator;

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
    var ranking, offset, tournamentID, rowspan, $view, tournament;

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
        rowspan = this.teams.length - offset;
      } else if (ranking.tournamentOffsets[tournamentID + 1] === undefined) {
        if (ranking.tournamentOffsets[undefined] == undefined) {
          rowspan = this.teams.length - offset;
        } else {
          rowspan = ranking.tournamentOffsets[undefined];
        }
      } else {
        rowspan = ranking.tournamentOffsets[tournamentID + 1];
      }
      rowspan -= offset;

      $view = $('<td>').addClass('system');
      $view.attr('rowspan', rowspan);

      tournament = this.tournaments.get(tournamentID);
      this.viewPopulator.populate(tournament, $view);

      if (tournament) {
        this.tournamentView = new GenericTournamentView(tournament, $view);
      } else {
        this.tournamentView = new NewTournamentView(offset, rowspan, $view,
            this.tournaments, this.teams);
      }

      this.$view.append($view);
      this.$view.addClass('firstrow');
    }
  };

  SystemTableRowView.prototype.onupdate = function(emitter, event, data) {
    var rowview = this;
    if (emitter === this.tournaments) {
      if (this.updatepending === undefined) {
        this.updatepending = true;
        window.setTimeout(function() {
          rowview.updateRankTexts();
          rowview.updateSystem();
          rowview.updatepending = undefined;
        }, 1);
      }
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
   * @param viewPopulator
   * @return {Function}
   */
  SystemTableRowView.bindLists = function(teams, tournaments, viewPopulator) {
    function BoundSystemTableRowView(index, $view) {
      BoundSystemTableRowView.superconstructor.call(this, index, $view, teams,
          tournaments, viewPopulator);
    }
    extend(BoundSystemTableRowView, SystemTableRowView);

    return BoundSystemTableRowView;
  };

  return SystemTableRowView;
});
