/**
 * TournamentListModel: A list of tournaments, which can be used to determine
 * the current tournament and global rank for each player.
 *
 * @return TournamentListModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './indexedlistmodel', './tournamentindex', './listener'//
], function(extend, IndexedListModel, TournamentIndex, Listener) {
  function setListeners(list) {
    Listener.bind(list, 'insert', function(emitter, event, data) {
      if (emitter === list) {
        data.object.getRanking().registerListener(list);
        data.object.getState().registerListener(list);
        list.emit('update');
      }
    });

    Listener.bind(list, 'remove', function(emitter, event, data) {
      if (emitter === list) {
        data.object.getRanking().unregisterListener(list);
        data.object.getState().unregisterListener(list);
        list.emit('update');
      }
    });
  }

  /**
   * Constructor
   */
  function TournamentListModel() {
    TournamentListModel.superconstructor.call(this);

    setListeners(this);
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
   *
   * @param teams
   * @return a pseudo-ranking object
   */
  TournamentListModel.prototype.getGlobalRanking = function(teams) {
    var ranks, tournamentOffsets, lastrank;

    if (teams === undefined) {
      console.error('teams parameter has not been passed');
      return undefined;
    }

    // initialize empty object
    ranks = {
      displayOrder: [],
      globalRanks: [],
      tournamentRanks: [],
      tournamentIDs: this.tournamentIDsForEachTeam()
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
      } else {
        ranks.tournamentRanks[teamID] = 0;
      }
      ranks.globalRanks[teamID] = ranks.tournamentRanks[teamID]
          + tournamentOffsets[tournamentID];
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

    return ranks;
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
    this.emit('update');
  };

  // TournamentListModel.prototype.save is directly inherited from ListModel

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
    return TournamentListModel.superclass.restore.call(this, data,
        TournamentIndex.createTournament);
  };

  TournamentListModel.prototype.SAVEFORMAT = [Object];

  return TournamentListModel;
});
