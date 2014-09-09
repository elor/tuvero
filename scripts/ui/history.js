/**
 * History of results, keyed by round and index.
 * 
 * @returns History
 */

/**
 * NOTES ON IMPLEMENTATION
 * 
 * A history consists of:
 * 
 * Tournaments - Multiple subsequent tournaments, which have been split from
 * larger tournaments. The order coincides with the tournament ids. Tournaments
 * are only added after the first game has finished
 * 
 * Games - consist of many (finished) games with one or more teams (players) on
 * either side, a result of two small integer values and information about its
 * round within the tournament and the original place in the games array (useful
 * for structured tournaments). A compact array is good enough for storage.
 * 
 * Votes - In a round of a tournament, a vote can be applied. It can be a bye
 * (0), an upvote (1) and a downvote (-1). For storage, the type, team and round
 * is required, in this order
 * 
 * Corrections - For bookkeeping and transparency, records of corrected games
 * are kept. Corrections change one finished Game into another finished Game,
 * and as such are perfectly represented by two Game objects. A change of the
 * round is not allowed. A compact array is good enough for storage.
 * 
 * An object-array structure is sufficient to store all information:
 */
// uncommented to avoid auto-format
// FIXME allow more than 1 player per team (Supermelee)
[ {
  votes : [ [ 0, 4, 0 ] ],
  games : [ [ 0, 2, 13, 7, 0, 0 ], [ 3, 1, 13, 12, 0, 1 ] ],
  corrections : [ [ [ 3, 1, 12, 13, 0, 1 ], [ 3, 1, 13, 12, 0, 1 ] ] ],
}, undefined, {
  votes : [],
  games : [ [ 2, 3, 13, 3, 0, 1 ] ],
  corrections : [],
} ];
/**
 * Yeah. That way, most of it is easily JSON-compressible, using a number-only
 * format. It can contain empty entries, if a still running tournament doesn't
 * have a finished game
 */

define([ './tournaments' ], function (Tournaments) {
  var History, history;

  history = [];

  function getTournament (id, alloc) {
    if (alloc && !history[id]) {
      history[id] = {
        votes : [],
        games : [],
        corrections : [],
      };
    }
    return history[id];
  }

  History = {
    /**
     * 
     * @param tournamentid
     *          the id of the game's tournament
     * @param t1
     *          team 1
     * @param t2
     *          team 2
     * @param p1
     *          points of team 1
     * @param p2
     *          points of team 2
     * @param round
     *          (optional) the round within its subtournament
     * @param id
     *          (optional) the game id within its round
     * @returns: true on success, false otherwise
     */
    addResult : function (tournamentid, t1, t2, p1, p2, round, id) {
      var tournament;

      round = round || 0;
      id = id || 0;

      // TODO validate data types and results

      tournament = getTournament(tournamentid, true);
      if (!tournament) {
        return false;
      }

      tournament.games.push([ t1, t2, p1, p2, round, id ]);
      return true;
    },

    /**
     * 
     * @param tournamentid
     * @param before
     *          an object containing t1, t2, p1, p2, round and id
     * @param after
     *          an object containing t1, t2, p1, p2, round and id
     * @returns true on success, false otherwise
     */
    addCorrection : function (tournamentid, before, after) {
      var tournament;

      // TODO validate data types and values
      // TODO check whether the result really existed

      // Do not allocate. For a correction, a finished game is required.
      tournament = getTournament(tournamentid);
      if (!tournament) {
        return false;
      }

      tournament.corrections.push([ before.t1, before.t2, before.p1, before.p2,
          before.round || 0, before.id || 0 ], [ after.t1, after.t2, after.p1,
          after.p2, after.round || 0, after.id || 0 ]);
      return true;
    },

    addVote : function (tournamentid, type, team, round) {
      var tournament;

      // TODO validate data types and values
      // TODO check whether the result really existed

      tournament = getTournament(tournamentid, true);
      if (!tournament) {
        return false;
      }

      tournament.votes.push([ type, team, round ]);
      return true;
    },

    /**
     * 
     * @param tournamentid
     *          the tournament id
     * @returns undefined on failure, number of finished games in this
     *          tournament otherwise
     */
    numGames : function (tournamentid) {
      var tournament;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      return tournament.games.length;
    },

    /**
     * Return all votes, for the user to search. This is way simpler than some
     * artificial restriction
     * 
     * Do not manipulate!
     * 
     * @param tournamentid
     *          the tournament id
     * @returns the raw votes array of this tournament and round
     */
    getVotes : function (tournamentid) {
      var tournament;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      return tournament.votes;
    },

    /**
     * 
     * @param tournamentid
     *          the tournament id
     * @returns undefined on failure, number of corrections in this tournament
     *          otherwise
     */
    numCorrections : function (tournamentid) {
      var tournament;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      return tournament.corrections.length;
    },

    numRounds : function (tournamentid) {
      var tournament, games;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      return 1 + Math.max(Math.max.apply(this, tournament.games.map(function (val) {
        return val[4];
      })), Math.max.apply(this, tournament.votes.map(function (val) {
        return val[2];
      })));
    },

    /**
     * returns the raw data of this game for further viewing.
     * 
     * Do not manipulate! Use corrections instead!
     * 
     * @param tournamentid
     *          the id of the tournament
     * @param id
     *          the game id
     * @returns the array containing game information on success, undefined
     *          otherwise
     */
    getGame : function (tournamentid, id) {
      var tournament;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      return tournament.games[id];
    },

    /**
     * get all games of a specific round.
     * 
     * Do not manipulate!
     * 
     * @param tournamentid
     *          the tournament id
     * @param round
     *          the round within its tournament
     * @returns
     */
    getRound : function (tournamentid, round) {
      var tournament, game, roundgames;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      roundgames = [];

      for (game in tournament.games) {
        game = tournament.games[game];
        if (game[4] === round) {
          roundgames.push(game);
        }
      }

      return roundgames;
    },

    /**
     * get all games of a specific round.
     * 
     * Do not manipulate!
     * 
     * @param tournamentid
     *          the tournament id
     * @param t1
     *          team id 1
     * @param t2
     *          team id 2
     * @returns
     */
    findGames : function (tournamentid, t1, t2) {
      var tournament, round, game, matches;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      matches = [];

      for (game in tournament.games) {
        game = tournament.games[game];
        if ((game[0] === t1 && game[1] === t2) || (game[0] === t2 && game[1] === t1)) {
          matches.push(game);
        }
      }

      return matches;
    },

    /**
     * returns a raw correction object for further viewing
     * 
     * Do not manipulate! Use Tournaments.getTournament(tournamentid).correct()
     * for that!
     * 
     * @param tournamentid
     *          the tournament id
     * @param id
     *          the correction id
     * @returns a raw correction array on success, undefined otherwise
     */
    getCorrection : function (tournamentid, id) {
      var tournament;

      tournament = getTournament(tournamentid);
      if (!tournament) {
        return undefined;
      }

      return tournament.corrections[id];
    },

    numTournaments : function () {
      return history.length;
    },

    reset : function () {
      history = [];
    },

    /**
     * CSV exporter
     * 
     * Tournament Comment Line Format: 'name Round roundno'
     * 
     * Game Format:
     * 'No1,No2,Name1_1,Name1_2,Name1_3,Names2_1,Names2_2,Names2_3,Points1,Points2'
     * 
     * VoteFormat: 'No1,Name1,Name2,Name3,Type'
     * 
     * @returns a comma-separated-values compatible History representation
     */
    toCSV : function () {
      var lines, tournamentid, roundid, numrounds, votes, vote, game, games, line, names, hasvotes, Team, Tournaments;

      lines = [];

      Team = require('./team');
      Tournaments = require('./tournaments');

      for (tournamentid = 0; tournamentid < History.numTournaments(); tournamentid += 1) {
        numrounds = History.numRounds(tournamentid);
        votes = History.getVotes(tournamentid);
        for (roundid = 0; roundid < numrounds; roundid += 1) {
          // FIXME use Strings. Somehow.
          games = History.getRound(tournamentid, roundid);

          if (games && games.length) {
            lines.push('#' + Tournaments.getName(tournamentid) + ' Runde ' + (roundid + 1) + ' Spiele,');

            lines.push('No1,No2,Name1_1,Name1_2,Name1_3,Name2_1,Name2_2,Name2_3,Points1,Points2');

            for (game in games) {
              game = games[game];

              line = [];
              line.push(game[0] + 1);
              line.push(game[1] + 1);

              // Team 1, id
              names = Team.get(game[0]).names;

              // Team 1, names (escaped)
              line.push('"' + (names[0] || '').replace('"', '""') + '"');
              line.push('"' + (names[1] || '').replace('"', '""') + '"');
              line.push('"' + (names[2] || '').replace('"', '""') + '"');

              // Team 2, id
              names = Team.get(game[1]).names;

              // Team 2, names (escaped)
              line.push('"' + (names[0] || '').replace('"', '""') + '"');
              line.push('"' + (names[1] || '').replace('"', '""') + '"');
              line.push('"' + (names[2] || '').replace('"', '""') + '"');

              // points
              line.push(game[2]);
              line.push(game[3]);

              lines.push(line.join(','));
            }
          }

          // print votes
          firstvote = true;
          for (vote in votes) {
            vote = votes[vote];

            if (vote[2] === roundid) {
              if (firstvote) {
                firstvote = false;
                lines.push('#' + Tournaments.getName(tournamentid) + ' Runde ' + (roundid + 1) + ' Lose,');
                lines.push('No,Name1,Name2,Name3,Typ');
              }

              names = Team.get(vote[1]).names;
              line = [];

              line.push(vote[1] + 1);
              line.push('"' + (names[0] || '').replace('"', '""') + '"');
              line.push('"' + (names[1] || '').replace('"', '""') + '"');
              line.push('"' + (names[2] || '').replace('"', '""') + '"');
              switch (vote[0]) {
              case History.BYE:
                line.push('frei');
                break;
              case History.DOWNVOTE:
                line.push('hoch');
                break;
              case History.UPVOTE:
                line.push('runter');
                break;
              default:
                line.push(undefined);
              }

              lines.push(line.join(','));
            }
          }
        }
      }

      if (!lines.length) {
        lines.push('#No History yet');
      }

      return lines.join('\r\n');
    },

    /**
     * Serializer.
     * 
     * @returns a string representation of the data
     */
    toBlob : function () {
      return JSON.stringify(history);
    },

    /**
     * Deserializer.
     * 
     * @param blob
     *          a string represention with which to replace the current data
     */
    fromBlob : function (blob) {
      history = JSON.parse(blob);
      // TODO verify
    },
  };

  History.BYE = 0;
  History.UPVOTE = 1;
  History.DOWNVOTE = -1;

  return History;
});
