/**
 * TournamentListModel: A list of tournaments, which can be used to determine
 * the current tournament and global rank for each player.
 *
 * @return TournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './indexedlistmodel', './tournamentindex', './listener',
    './model'], function(extend, IndexedListModel, TournamentIndex, Listener,
    Model) {
  /**
   * Constructor
   */
  function TournamentListModel() {
    TournamentListModel.superconstructor.call(this);

    this.rankingCache = undefined;

    this.setListeners();
  }
  extend(TournamentListModel, IndexedListModel);

  TournamentListModel.prototype.EVENTS = {
    'update': true,
    'reset': true,
    'insert': true,
    'remove': true,
    'resize': true
  };

  /**
   * TODO should use the event system. Benchmark first!
   *
   * @return an array of tournament IDs for every team in a tournament
   */
  TournamentListModel.prototype.tournamentIDsForEachTeam = function() {
    var ids = [];

    this.map(function(tournament) {
      if (tournament.getState().get() != 'finished') {
        tournament.getTeams().map(function(team) {
          ids[team] = tournament.getID();
        });
      }
    });

    return ids;
  };

  TournamentListModel.prototype.invalidateGlobalRanking = function() {
    this.rankingCache = undefined;
    this.emit('update');
  };

  /**
   *
   * @param numTeams
   *          the number of teams
   * @return a pseudo-ranking object
   */
  TournamentListModel.prototype.getGlobalRanking = function(numTeams) {
    var ranks, tournamentOffsets, lastrank, teams;

    if (numTeams === undefined || numTeams < 0) {
      console.error('invalid numTeams parameter');
      return undefined;
    }

    if (this.rankingCache && this.rankingCache.displayOrder
        && this.rankingCache.displayOrder.length === numTeams) {
      return this.rankingCache;
    }

    teams = [];
    while (teams.length < numTeams) {
      teams.push(teams.length);
    }

    // initialize empty object
    ranks = {
      displayOrder: [],
      globalRanks: [],
      tournamentRanks: [],
      tournamentIDs: this.tournamentIDsForEachTeam(),
      tournamentOffsets: {}
    };

    // calculate Offsets for globalRanks
    tournamentOffsets = [0];
    this.map(function(tournament, tournamentID) {
      tournamentOffsets[tournamentID + 1] = tournamentOffsets[tournamentID]
          + tournament.getTeams().length;
    });

    // write tournamentRanks and globalRanks
    teams.map(function(team, teamID) {
      var ranking, tournamentID;

      tournamentID = ranks.tournamentIDs[teamID];
      if (tournamentID !== undefined) {
        ranking = this.get(tournamentID).getRanking().get();

        ranks.tournamentRanks[teamID] = ranking.ranks[ranking.ids
            .indexOf(teamID)];
        ranks.globalRanks[teamID] = ranks.tournamentRanks[teamID]
            + tournamentOffsets[tournamentID];
      } else {
        ranks.tournamentIDs[teamID] = undefined;
        ranks.tournamentRanks[teamID] = 0;
        ranks.globalRanks[teamID] = ranks.tournamentRanks[teamID]
            + tournamentOffsets[tournamentOffsets.length - 1];
      }
    }, this);

    // correct ranking order
    lastrank = -1;
    while (ranks.displayOrder.length < teams.length) {
      ranks.displayOrder.push(ranks.displayOrder.length);
    }
    ranks.displayOrder.sort(function(a, b) {
      return ranks.globalRanks[a] - ranks.globalRanks[b] || a - b;
    });

    // adjust the global ranks to account for ignored teams, which are
    // already
    // playing in another subtournament
    lastrank = -1;
    lastid = -1;
    ranks.displayOrder.forEach(function(id, displayID) {
      var rank = ranks.globalRanks[id];
      if (rank > lastrank) {
        ranks.globalRanks[id] = displayID;
        lastid = id;
        lastrank = rank;
      } else {
        ranks.globalRanks[id] = ranks.globalRanks[lastid];
      }
    });

    lastid = -1;
    // don't use arrays.
    // arrays cannot be as sparse and don't support 'undefined' as a key
    ranks.displayOrder.forEach(function(id, displayID) {
      var tournamentID;

      tournamentID = ranks.tournamentIDs[id];
      if (tournamentID != lastid) {
        ranks.tournamentOffsets[tournamentID] = displayID;
        lastid = tournamentID;
      }
    });

    this.rankingCache = ranks;

    return this.rankingCache;
  };

  /**
   * forward ranking updates to external listeners
   *
   * @param emitter
   *          the emitter
   * @param event
   *          the event name
   * @param data
   *          an optional data object
   */
  TournamentListModel.prototype.onupdate = function(emitter, event, data) {
    this.invalidateGlobalRanking();
  };

  /**
   * helper function to set all anonymous Listeners
   *
   * @param list
   *          a TournamentListModel instance
   */
  TournamentListModel.prototype.setListeners = function() {
    Listener.bind(this, 'insert', function(emitter, event, data) {
      if (emitter === this) {
        data.object.getRanking().registerListener(this);
        data.object.getState().registerListener(this);
        this.invalidateGlobalRanking();
      }
    }, this);

    Listener.bind(this, 'remove', function(emitter, event, data) {
      if (emitter === this) {
        data.object.getRanking().unregisterListener(this);
        data.object.getState().unregisterListener(this);
        this.invalidateGlobalRanking();
      }
    }, this);
  };

  TournamentListModel.prototype.save = function() {
    data = Model.prototype.save.call(this);

    data.tournaments = TournamentListModel.superclass.save.call(this);
    data.startIndex = [];

    return data;
  };

  /**
   * restores tournaments from savedata objects. This function is used to
   * enforce the usage of TournamentIndex.createTournament as a factory. The
   * other logic is embedded into ListModel, which in turn constructs
   * TournamentModel instances.
   *
   * @param data
   *          a data object, as returned from this.save();
   * @return true on success, false otherwise
   */
  TournamentListModel.prototype.restore = function(data) {
    if (!Model.prototype.restore.call(this, data)) {
      return false;
    }

    // TODO restore startIndex

    TournamentListModel.superclass.restore.call(this, data.tournaments,
        TournamentIndex.createTournament);

    return true;
  };

  TournamentListModel.prototype.SAVEFORMAT = {
    tournaments: [Object],
    startIndex: [Number]
  };

  return TournamentListModel;
});
