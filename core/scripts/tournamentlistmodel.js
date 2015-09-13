/**
 * TournamentListModel: A list of tournaments, which can be used to determine
 * the current tournament and global rank for each player.
 *
 * @return TournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './indexedlistmodel', './listmodel', './uniquelistmodel',
    './tournamentindex', './listener', './model'], function(extend,
    IndexedListModel, ListModel, UniqueListModel, TournamentIndex, Listener,
    Model) {
  /**
   * Constructor
   */
  function TournamentListModel() {
    TournamentListModel.superconstructor.call(this);

    this.startIndex = new ListModel();
    this.closedTournaments = new UniqueListModel();

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

  /**
   * force a recalculation of the global Ranking and emit 'update'
   */
  TournamentListModel.prototype.invalidateGlobalRanking = function() {
    this.rankingCache = undefined;
    this.emit('update');
  };

  /**
   * @param tournamentID
   * @return true on success, false otherwise.
   */
  TournamentListModel.prototype.closeTournament = function(tournamentID) {
    if (this.get(tournamentID) === undefined) {
      console.error('tournament ID ' + tournamentID + ' is undefined');
      return false;
    }

    if (!this.closedTournaments.push(tournamentID)) {
      console.error('tournament ID ' + tournamentID + ' is already closed');
      return false;
    }

    this.invalidateGlobalRanking();

    return true;
  };

  /**
   * @return an array with a 'true' or 'false' entry for every tournament.
   */
  TournamentListModel.prototype.areTournamentsClosed = function() {
    var closed;

    closed = [];
    while (closed.length < this.length) {
      closed.push(false);
    }

    this.closedTournaments.map(function(tournamentID) {
      closed[tournamentID] = true;
    });

    return closed;
  };

  /**
   * create a global ranking object, which includes the tournament IDs, team
   * IDs, global display order, tournament ranks and global ranks.
   *
   * @param numTeams
   *          the number of teams
   * @return a globalRanking object
   */
  TournamentListModel.prototype.getGlobalRanking = function(numTeams) {
    var teams, undefinedTeams, zeroTeams;

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

    undefinedTeams = teams.map(function() {
      return undefined;
    });

    zeroTeams = teams.map(function() {
      return 0;
    });

    // initialize empty object, but with correct team sizes
    this.rankingCache = {
      // index: rank
      displayOrder: teams.slice(0),
      // index: teamid
      globalRanks: zeroTeams.slice(0),
      tournamentRanks: zeroTeams.slice(0),
      tournamentIDs: undefinedTeams.slice(0),
      tournamentOffsets: this.startIndex.asArray()
    };

    // apply all tournaments in order, just like they were played.
    this.map(function(tournament) {
      this.applyTournamentToRanks(tournament, this.rankingCache);
    }, this);

    this.calculateGlobalRanks(this.rankingCache);

    return this.rankingCache;
  };

  /**
   * apply a single tournament to a global ranking object, in order to
   * manipulate the ranking so that this tournament is considered part of it.
   * Sounds strange, but it mainly reorders the teams by the tournament ranks
   * and sets the tournament ranks. Doesn't take care of the global ranks.
   *
   * @param tournament
   *          a TournamentModel instance
   * @param globalRanking
   *          a globalRanking object.
   */
  TournamentListModel.prototype.applyTournamentToRanks = function(tournament,
      globalRanking) {
    var tournamentID, tournamentRanking, startIndex, isClosed;

    tournamentID = tournament.getID();
    tournamentRanking = tournament.getRanking().get();
    length = tournamentRanking.displayOrder.length;
    startIndex = this.startIndex.get(tournamentID);

    isClosed = this.closedTournaments.indexOf(tournamentID) !== -1;

    tournamentRanking.displayOrder.map(function(tournamentTeamID, displayID) {
      var globalTeamID, globalDisplayID, tournamentRank;

      globalTeamID = tournamentRanking.ids[tournamentTeamID];
      globalDisplayID = startIndex + displayID;
      tournamentRank = tournamentRanking.ranks[tournamentTeamID];

      globalRanking.displayOrder[globalDisplayID] = globalTeamID;
      globalRanking.tournamentRanks[globalTeamID] = tournamentRank;

      if (isClosed) {
        globalRanking.tournamentIDs[globalTeamID] = undefined;
      } else {
        globalRanking.tournamentIDs[globalTeamID] = tournamentID;
      }
    }, this);
  };

  /**
   * after all tournaments have been applied to a bare global ranking, this
   * function calculates the global ranks from the given information
   *
   * @param ranking
   *          a global ranking object, as will be returned by getGlobalRanking()
   */
  TournamentListModel.prototype.calculateGlobalRanks = function(ranking) {
    var lastTournamentID, lastTournamentRank, rank;

    lastTournamentID = undefined;
    lastTournamentRank = 0;
    rank = undefined;

    ranking.displayOrder.map(function(teamID, displayID) {
      var tournamentID, tournamentRank;

      tournamentID = ranking.tournamentIDs[teamID];
      tournamentRank = ranking.tournamentRanks[teamID];

      if (rank === undefined || tournamentID !== lastTournamentID
          || lastTournamentRank !== tournamentRank) {
        rank = displayID;
        lastTournamentRank = tournamentRank;
        lastTournamentID = tournamentID;
      }

      ranking.globalRanks[teamID] = rank;
    });
  };

  /**
   * add a new tournament to the list, but also remember its starting index. The
   * starting index is required for the calculation of the global ranking
   *
   * @param tournament
   *          a TournamentModel instance
   * @param startIndex
   *          the index of the first team in the global Ranking. Used for global
   *          ranking calculations
   * @return true on success, false or undefined otherwise. See ListModel.push()
   */
  TournamentListModel.prototype.push = function(tournament, startIndex) {
    if (this.length == this.startIndex.length) {
      this.startIndex.push(startIndex || 0);
    }

    return TournamentListModel.superclass.push.call(this, tournament);
  };

  /*
   * TODO don't allow insert, remove, clear and whatever else could mess up the
   * global ranking
   */

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

  /**
   * clear everything
   */
  TournamentListModel.prototype.clear = function() {
    this.startIndex.clear();
    this.closedTournaments.clear();
    TournamentListModel.superclass.clear.call(this);
  };

  TournamentListModel.prototype.save = function() {
    data = Model.prototype.save.call(this);

    data.tournaments = TournamentListModel.superclass.save.call(this);
    data.startIndex = this.startIndex.save();
    data.closedTournaments = this.closedTournaments.save();

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

    if (!this.startIndex.restore(data.startIndex)) {
      console.error('TournamentListModel: cannot restore closedTournaments');
      return false;
    }

    if (!this.closedTournaments.restore(data.closedTournaments)) {
      console.error('TournamentListModel: cannot restore closedTournaments');
      return false;
    }

    return TournamentListModel.superclass.restore.call(this, data.tournaments,
        TournamentIndex.createTournament);
  };

  TournamentListModel.prototype.SAVEFORMAT = {
    tournaments: [Object],
    startIndex: [Number],
    closedTournaments: [Number]
  };

  return TournamentListModel;
});
