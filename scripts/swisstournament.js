/**
 * Implementation of the swiss tournament system
 */
define(
    [ 'map', 'finebuchholzranking', 'game', 'result', 'random', 'halfmatrix' ],
    function (Map, Finebuchholzranking, Game, Result, Random, Halfmatrix) {
      var Swisstournament;

      Swisstournament = function () {
        this.players = new Map();
        this.ranking = new Finebuchholzranking();
        this.state = 0; // 0 always is the first state, regardless of its name
        this.games = [];
        this.upvote = []; // true, wenn jemand hochgelost wurde
        this.downvote = []; // true, wenn jemand runtergelost wurde
        this.byevote = []; // true, wenn jemand ein Freilos bekommen hat
        this.rng = new Random();
      };

      Swisstournament.state = {
        PREPARING : 0,
        RUNNING : 1,
        FINISHED : 2
      };

      Swisstournament.prototype.addPlayer = function (id) {
        if (this.state !== Swisstournament.state.PREPARING) {
          return undefined;
        }

        this.players.insert(id);
        return this;
      };

      Swisstournament.prototype.start = function () {
        if (this.state !== Swisstournament.state.PREPARING) {
          return undefined;
        }

        this.state = Swisstournament.state.RUNNING;
        this.randomizeGames();

        return this;
      };

      Swisstournament.prototype.end = function () {
        if (this.state !== Swisstournament.state.RUNNING) {
          return undefined;
        }

        // check for running games
        if (this.games.length !== 0) {
          return undefined;
        }

        this.state = Swisstournament.state.FINISHED;
        return this.getRanking();
      };

      Swisstournament.prototype.finishGame = function (game, points) {
        var t1, t2, i, invalid;
        if (this.state !== Swisstournament.state.RUNNIG) {
          return undefined;
        }

        // verify that the game is in the games list
        invalid = true;
        for (i = 0; i < this.games.length; i += 1) {
          if (game.equal(this.games[i])) {
            invalid = false;
            break;
          }
        }

        if (invalid === true) {
          return undefined;
        }

        t1 = [];
        t2 = [];

        // ids are external. Convert them to internal ids
        for (i = 0; i < game.teams[0].length; i += 1) {
          t1[i] = this.players.find(game.teams[0][i]);
          t2[i] = this.players.find(game.teams[1][i]);
        }

        // apply ranking
        this.ranking.add(new Ranking(t1, t2, points[0], points[1]));

        return this;
      };

      Swisstournament.prototype.openGames = function () {
        // return array of open games. Referenced, because bad code
        return this.games;
      };

      Swisstournament.prototype.getRanking = function () {
        var res, wins, netto, bh, fbh, ids;

        bh = [];
        fbh = [];
        ids = [];
        netto = [];
        wins = [];

        res = this.ranking.get();

        // rearrange the arrays from internal id indexing to ranked indexing
        res.ranking.forEach(function (rank, i) {
          bh[rank] = res.buchholz[i];
          fbh[rank] = res.finebuchholz[i];
          netto[rank] = res.netto[i];
          wins[rank] = res.wins[i];
        });

        return {
          bh : bh,
          fbh : fbh,
          ids : ids,
          netto : netto,
          wins : wins
        };
      };

      Swisstournament.prototype.randomizeGames = function () {
        var wingroups, votes;

        if (this.state !== Swisstournament.state.RUNNING) {
          return undefined;
        }
        if (this.games.length !== 0) {
          return undefined;
        }

        // TODO implement an algorithm for getting new games
        // TODO remember that games uses external ids
        // TODO validate, of course
        // TODO DON'T exceed O(n^2)

        // / Algorithm: for better understanding, read comments only.
        // / create win groups
        wingroups = this.winGroups();
        // ensure even win group sizes
        votes = this.preliminaryDownVotes(wingroups);

        // randomize every win group by itself
        // direction of iteration doesn't matter anymore
        wingroups.forEach(function (wg, wins) {
          // for every player:
          // // count previous games
          // // avoid accidental upvote
          // // exclude players that have already been voted
          // randomly pick one player with highest invalid count
          // construct list of possible opponents
          // randomly pick from it
          // -> new game
          // increase count for previously possible opponents
          // repeat until failure

          invalid = new Halfmatrix(wg.length);
          // store byevote
        }, this);

        this.applyVotes(votes);

        return this.games;
      };

      Swisstournament.prototype.winGroups = function () {
        var wingroups, res;

        wingroups = [];

        res = this.ranking.get();

        res.wins.forEach(function (wins, i) {
          if (wingroups[wins] === undefined) {
            wingroups[wins] = [];
          }
          wingroups[wins].push(i);
        });

        return wingroups;
      };

      Swisstournament.prototype.preliminaryDownVotes = function (wingroups) {
        var i, downvotes, byevote, tmparr, candidateFunc, p, wg;
        if (wingroups === undefined) {
          return undefined;
        }

        i = 0;
        tmparr = [];
        downvotes = [];
        byevote = undefined;

        candidateFunc = function (id) {
          // find a random player that hasn't been up/down/byevoted
          if (this.wasVoted(id)) {
            return;
          }
          if (downvotes[i + 1] === id) {
            return;
          }

          tmparr.push(id);
        };

        // within the win groups:
        for (i = wingroups.length - 1; i >= 0; i -= 1) {
          wg = wingroups[i];
          if (wg.length % 2 === 1) {
            // if uneven number of teams:

            // find all players that haven't been up/down/byevoted
            tmparr = [];
            wg.forEach(candidateFunc, this);

            // critically abort if there's none
            if (tmparr.size === 0) {
              return undefined;
            }

            // randomly pick one
            p = rng.pick(tmparr);

            // move player to lower wingroup
            wg.splice(wg.indexOf(p), 1);
            if (i === 0) {
              // already in lowest wingroup? byevote.
              byevote = p;
            } else {
              wingroups[i - 1].push(p);

              // remember the downvote
              downvotes[i - 1] = p;
            }
          }
        }

        return {
          byevote : byevote,
          downvotes : downvotes,
          upvotes : []
        };
      };

      Swisstournament.prototype.wasVoted = function (id) {
        return this.byevote[id] || this.upvote[id] || this.downvote[id]
            || false;
      };

      return Swisstournament;
    });

// TODO hide internal functions
// TODO teams contain one player only (manage team vs. player externally)
