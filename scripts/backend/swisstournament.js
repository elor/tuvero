/**
 * Implementation of the swiss tournament system where there's only one player.
 * If you need teams, first consider to enter a team as a single player before
 * rewriting for multi-player teams, which are only useful for random teams.
 */
define(
    [ './map', './finebuchholzranking', './game', './result', './random',
        './correction' ],
    function (Map, Finebuchholzranking, Game, Result, Random, Correction) {
      var Swisstournament;

      /**
       * constructor
       * 
       * @returns {Swisstournament}
       */
      Swisstournament = function () {
        this.players = new Map();
        this.ranking = new Finebuchholzranking();
        this.state = 0; // 0 always is the first state, regardless of its name
        this.games = [];
        this.upvote = []; // true, wenn jemand hochgelost wurde
        this.downvote = []; // true, wenn jemand runtergelost wurde
        this.byevote = []; // true, wenn jemand ein Freilos bekommen hat
        this.rng = new Random();
        this.round = 0; // 0 if not started yet, 1 is first valid round, ...
        this.roundvotes = {
          upvotes : [],
          downvotes : [],
          byevote : undefined
        };
      };

      /**
       * the three possible states
       */
      Swisstournament.state = {
        PREPARING : 0,
        RUNNING : 1,
        FINISHED : 2
      };

      /**
       * (implemented tournament function)
       * 
       * @param id
       * @returns
       */
      Swisstournament.prototype.addPlayer = function (id) {
        if (this.state !== Swisstournament.state.PREPARING) {
          return undefined;
        }

        this.players.insert(id);
        this.ranking.resize(this.players.size());
        return this;
      };

      /**
       * (implemented tournament function)
       * 
       * @returns
       */
      Swisstournament.prototype.start = function () {
        if (this.state !== Swisstournament.state.PREPARING) {
          return undefined;
        }

        if (this.players.size() < 2) {
          return undefined;
        }

        this.state = Swisstournament.state.RUNNING;
        this.newRound();

        return this;
      };

      /**
       * (implemented tournament function)
       * 
       * @returns
       */
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

      /**
       * (implemented tournament function)
       * 
       * @param game
       * @param points
       * @returns
       */
      Swisstournament.prototype.finishGame = function (game, points) {
        var i, invalid;
        if (this.state !== Swisstournament.state.RUNNING) {
          return undefined;
        }

        // abort if game has too many players
        if (game.teams[0].length !== 1 || game.teams[1].length !== 1) {
          return undefined;
        }

        // convert to internal pid
        game = new Game(this.players.find(game.teams[0][0]), this.players
            .find(game.teams[1][0]));

        // verify that the game is in the games list
        invalid = true;
        for (i = 0; i < this.games.length; i += 1) {
          if (game.equals(this.games[i])) {
            invalid = false;
            break;
          }
        }

        if (invalid === true) {
          return undefined;
        }

        // remove the game from the list
        this.games.splice(i, 1);

        // apply ranking
        this.ranking.add(new Result(game.teams[0], game.teams[1], points[0],
            points[1]));

        return this;
      };

      /**
       * (implemented tournament function)
       * 
       * @returns {Array}
       */
      Swisstournament.prototype.openGames = function () {
        // convert internal to external ids
        var games = [];
        this.games.forEach(function (game, i) {
          games[i] = new Game(this.players.at(game.teams[0][0]), this.players
              .at(game.teams[1][0]));
        }, this);

        return games;
      };

      /**
       * return the up/down/byevotes of the current round
       * 
       * @returns an object containing the three votes
       */
      // TODO test
      Swisstournament.prototype.getRoundVotes = function () {
        // convert internal to external ids
        var votes = {
          up : [],
          down : [],
          bye : undefined
        };

        this.roundvotes.upvotes.forEach(function (up) {
          votes.up.push(this.players.at(up));
        }, this);

        this.roundvotes.downvotes.forEach(function (down) {
          votes.down.push(this.players.at(down));
        }, this);

        if (this.roundvotes.byevote !== undefined) {
          votes.bye = this.players.at(this.roundvotes.byevote);
        }

        return votes;
      };

      /**
       * returns all up/down/byevotes ever granted
       * 
       * @returns an object containing arrays of the three votes
       */
      // TODO test
      Swisstournament.prototype.getAllVotes = function () {
        var votes = {
          up : [],
          down : [],
          bye : []
        };

        this.upvote.forEach(function (voted, pid) {
          if (voted) {
            votes.up.push(this.players.at(pid));
          }
        }, this);

        this.downvote.forEach(function (voted, pid) {
          if (voted) {
            votes.down.push(this.players.at(pid));
          }
        }, this);

        this.byevote.forEach(function (voted, pid) {
          if (voted) {
            votes.bye.push(this.players.at(pid));
          }
        }, this);

        return votes;
      };

      /**
       * (implemented tournament function)
       * 
       * @returns
       */
      Swisstournament.prototype.getRanking = function () {
        var res, wins, netto, bh, fbh, ids;

        bh = [];
        fbh = [];
        ids = [];
        netto = [];
        wins = [];

        res = this.ranking.get();
        
        // rearrange the arrays from internal id indexing to ranked indexing
        res.ranking.forEach(function (i, rank) {
          bh[rank] = res.buchholz[i];
          fbh[rank] = res.finebuchholz[i];
          netto[rank] = res.netto[i];
          wins[rank] = res.wins[i];
          ids[rank] = this.players.at(i);
        }, this);

        return {
          bh : bh,
          fbh : fbh,
          ids : ids,
          netto : netto,
          wins : wins
        };
      };

      /**
       * @returns current round or 0 if tournament hasn't been proberly started
       *          yet
       */
      Swisstournament.prototype.getRound = function () {
        return this.round;
      };

      /**
       * Start a new round. This function creates a randomized set of new games,
       * maintaining up/down/byevotes.
       * 
       * @returns this on success, undefined otherwise
       */
      Swisstournament.prototype.newRound = function () {
        var wingroups, votes, games, timeout;

        // abort if the tournament isn't running
        if (this.state !== Swisstournament.state.RUNNING) {
          return undefined;
        }
        // abort if there are unfinished games from a previous round
        if (this.games.length !== 0) {
          return undefined;
        }

        timeout = this.players.size() * 10;
        wingroups = this.winGroups();

        // abort if there are no consistent wingroups, which is a sign for too
        // many rounds
        if (wingroups === undefined) {
          return undefined;
        }

        votes = this.preliminaryDownVotes(wingroups);

        if (votes === undefined) {
          // abort. there's no way to downvote properly
          return undefined;
        }

        // Algorithm (copy of the comments below)
        // for each wingroup:
        // / exclude the downvote from this group, if any
        // / if player has been downvoted into this group:
        // / / create game with a random upvote candidate
        // / while there are players in this group:
        // / / pick any two random players
        // / / if they haven't already played against another
        // / / / create game

        games = [];

        // for each wingroup:
        wingroups.forEach(function (wingroup, wins) {
          var candidates, p1, p2;
          // exclude the downvote or byevote from this group, if any

          if (timeout <= 0) {
            return;
          }

          p1 = votes.downvotes[wins];
          if (wins === 0) {
            p1 = votes.byevote;
          }
          if (p1 !== undefined) {
            wingroup.splice(wingroup.indexOf(p1), 1);
          }

          // if player has been downvoted into this group:
          p1 = votes.downvotes[wins + 1];
          if (p1 !== undefined) {
            candidates = [];

            // create game with a random upvote candidate
            wingroup.forEach(function (pid2) {
              // canPlay: performance vs security?
              if (this.canUpVote(pid2) && this.canPlay(p1, pid2)) {
                candidates.push(pid2);
              }
            }, this);

            p2 = this.rng.pick(candidates);

            games.push(new Game(p1, p2));
            wingroup.splice(wingroup.indexOf(p2), 1);
            votes.upvotes[wins] = p2;
          }

          // while there are players in this group:
          while (wingroup.length > 0) {
            // pick any two random players
            p1 = this.rng.pick(wingroup);
            p2 = this.rng.pick(wingroup);
            if (p1 !== p2) {

              // if they haven't already played against another
              if (this.canPlay(p1, p2)) {
                // create game
                games.push(new Game(p1, p2));
                wingroup.splice(wingroup.indexOf(p1), 1);
                wingroup.splice(wingroup.indexOf(p2), 1);
              }

              timeout -= 1;
              if (timeout <= 0) {
                return;
              }
            }
          }
        }, this);

        if (timeout <= 0) {
          return undefined;
        }

        // apply the votes
        if (this.applyVotes(votes) === undefined) {
          // abort if something's wrong with the votes
          this.games = [];
          return undefined;
        }
        // apply the games
        this.games = games;

        // round increment
        this.round += 1;

        return this;
      };

      /**
       * @param votes
       *          processed votes structure as returned by
       *          preliminaryDownVotes() and processed by newRound()
       * @returns {Swisstournament} this
       */
      Swisstournament.prototype.applyVotes = function (votes) {
        var downcount, upcount, downvalid, upvalid;

        downcount = 0;
        downvalid = true;
        votes.downvotes.forEach(function (down) {
          if (down !== undefined) {
            downcount += 1;
          }
          if (!this.canDownVote(down)) {
            downvalid = false;
          }
        }, this);

        upcount = 0;
        upvalid = true;
        votes.upvotes.forEach(function (up) {
          if (up !== undefined) {
            upcount += 1;
          }
          if (!this.canUpVote(up)) {
            upvalid = false;
          }
        }, this);

        // abort if upvotes and downvotes differ or some vote was invalid
        if (downcount !== upcount || !downvalid || !upvalid) {
          return undefined;
        }

        if (votes.byevote !== undefined && !this.canByeVote(votes.byevote)) {
          return undefined;
        }

        // apply byevote
        this.byeVote(votes.byevote);

        // apply downvotes
        votes.downvotes.forEach(function (down) {
          this.downVote(down);
        }, this);

        votes.upvotes.forEach(function (up) {
          this.upVote(up);
        }, this);

        this.roundvotes = votes;

        return this;
      };

      /**
       * Build a 2d array of wingroups. Outer key is the number of wins (0+),
       * values in inner array are internal player ids
       * 
       * @returns 2d array of wingroups
       */
      Swisstournament.prototype.winGroups = function () {
        var wingroups, res, pid, numplayers, wins, highest;

        wingroups = [];

        highest = -1;

        res = this.ranking.get();

        numplayers = this.players.size();

        for (pid = 0; pid < numplayers; pid += 1) {
          wins = res.wins[pid] || 0;

          if (wins > highest) {
            highest = wins;
          }

          if (wingroups[wins] === undefined) {
            wingroups[wins] = [];
          }
          wingroups[wins].push(pid);
        }

        // verify that there's at least one player in every win group
        for (wins = 0; wins <= highest; wins += 1) {
          if (wingroups[wins] === undefined) {
            // there's a wingroup missing. The tournament lasts too long
            return undefined;
          }
        }

        return wingroups;
      };

      /**
       * create a list of players to downvote/byevote using the given wingroups
       * 
       * @param wingroups
       *          wingroups as returned by winGroups()
       * @returns An object containing byevote, downvotes and an empty array of
       *          upvotes. The key of the downvote array is the number of wins
       *          this player has been voted from.
       */
      Swisstournament.prototype.preliminaryDownVotes = function (wingroups) {
        // Due to the symmetric properties of a swiss tournament, we don't
        // verify possible upvotes. If the tournament has too many rounds, this
        // may fail someday.
        var byevote, downvotes, w, candidates, downvoted, fillCandidates;

        byevote = undefined;
        downvoted = false; // whether a player has been downvoted into the
        // current wingroup
        downvotes = [];
        candidates = [];

        // forEach-function to fill the candidates array. DownVote version.
        fillCandidates = function (pid) {
          if (this.canDownVote(pid)) {
            candidates.push(pid);
          }
        };

        // iterate over all wingroups, starting with the highest one, thereby
        // ensuring that all groups except the lowest one are even in player
        // count.
        for (w = wingroups.length - 1; w > 0; w -= 1) {
          // only downvote a player if the current group has an odd number of
          // players
          if ((wingroups[w].length + (downvoted ? 1 : 0)) & 0x1) {
            // create a dense list of candidates
            candidates = [];
            wingroups[w].forEach(fillCandidates, this);

            // abort if no player can be downvoted
            if (candidates.length === 0) {
              return undefined;
            }

            // select a random player from the candidates array
            downvotes[w] = this.rng.pick(candidates);
            downvoted = true;
          } else {
            downvoted = false;
          }
        }

        // byevote from the lowest group, if necessary. Same procedure as with
        // the downvotes
        if ((wingroups[0].length + (downvoted ? 1 : 0)) & 0x1) {
          candidates = [];
          // forEach-function to fill the candidates array. ByeVote version.
          fillCandidates = function (pid) {
            if (this.canByeVote(pid)) {
              candidates.push(pid);
            }
          };

          wingroups[0].forEach(fillCandidates, this);

          if (candidates.length === 0) {
            return undefined;
          }

          byevote = this.rng.pick(candidates);
        }

        // finally, return
        return {
          byevote : byevote,
          downvotes : downvotes,
          upvotes : []
        };
      };

      /**
       * @param id
       *          internal player id
       * @returns {Boolean} whether the player can be downvoted
       */
      Swisstournament.prototype.canDownVote = function (id) {
        return id < this.players.size() && !this.byevote[id]
            && !this.downvote[id];
      };

      /**
       * @param id
       *          internal player id to downvote
       * @returns {Swisstournament} this
       */
      Swisstournament.prototype.downVote = function (id) {
        if (this.canDownVote(id)) {
          this.downvote[id] = true;
        }

        return this;
      };

      /**
       * @param id
       *          internal player id
       * @returns {Boolean} whether the player can be upvoted
       */
      Swisstournament.prototype.canUpVote = function (id) {
        return id < this.players.size() && !this.upvote[id];
      };

      /**
       * @param id
       *          internal player id to be upvoted
       * @returns {Swisstournament} this
       */
      Swisstournament.prototype.upVote = function (id) {
        if (this.canUpVote(id)) {
          this.upvote[id] = true;
        }

        return this;
      };

      /**
       * @param id
       *          internal player id
       * @returns {Boolean} whether the player can be byevoted
       */
      Swisstournament.prototype.canByeVote = function (id) {
        return id < this.players.size() && !this.byevote[id]
            && !this.downvote[id];
      };

      /**
       * @param id
       *          internal player id to be byevoted
       * @returns {Swisstournament} this
       */
      Swisstournament.prototype.byeVote = function (id) {
        if (this.canByeVote(id)) {
          this.byevote[id] = true;
          this.ranking.grantBye(id);
        }

        return this;
      };

      /**
       * Verify whether two players can play against another
       * 
       * @param pid1
       *          internal id of first player
       * @param pid2
       *          iternal id of second player
       * @returns {Boolean} true if they would form a valid game, false
       *          otherwise
       */
      Swisstournament.prototype.canPlay = function (pid1, pid2) {
        return pid1 < this.players.size() && pid2 < this.players.size()
            && pid1 !== pid2
            && this.ranking.added(new Game(pid1, pid2)) === false;
      };

      /**
       * correct the result of a game. Since the games are determined by the
       * tournament itself, there's no need to correct the team
       * 
       * @param game
       *          the game
       * @param oldpoints
       *          array of faulty points
       * @param newpoints
       *          array of corrected points
       * @returns {Swisstournament} undefined on failure, this otherwise
       */
      // TODO test
      Swisstournament.prototype.correct = function (game, oldpoints, newpoints) {
        var res1, res2;

        // map to internal ids
        game = new Game(this.players.find(game.teams[0][0]), this.players
            .find(game.teams[1][0]));

        // create results
        res1 = new Result(game.teams[0], game.teams[1], oldpoints[0],
            oldpoints[1]);
        res2 = new Result(game.teams[0], game.teams[1], newpoints[0],
            newpoints[1]);

        // apply correction
        this.ranking.correct(new Correction(res1, res2));

        return this;
      };

      /**
       * build a list of corrections which are consistent in format with the
       * correct() function
       * 
       * @returns
       */
      // TODO test
      Swisstournament.prototype.getCorrections = function () {
        return this.ranking.getCorrections().map(
            function (corr) {
              var g;
              g = corr.pre.getGame();
              if (corr.post.getGame().equals(g)) {
                g = new Game(this.players.at(g.teams[0][0]), this.players
                    .at(g.teams[1][0]));
              } else {
                g = undefined;
              }

              return {
                game : g,
                oldpoints : [ corr.pre.points1, corr.pre.points2 ],
                newpoints : [ corr.post.points1, corr.post.points2 ]
              };
            }, this);
      };

      /**
       * stores the current state in a blob, mostly using JSON (
       * 
       * @returns the blob
       */
      Swisstournament.prototype.toBlob = function () {
        var ob;

        ob = {
          byevote : this.byevote,
          downvote : this.downvote,
          games : this.games,
          players : this.players.toBlob(),
          ranking : this.ranking.toBlob(),
          round : this.round,
          roundvotes : this.roundvotes,
          state : this.state,
          upvote : this.upvote
        };

        return JSON.stringify(ob);
      };

      /**
       * restores a state from the blob
       * 
       * @param blob
       *          the blob
       */
      Swisstournament.prototype.fromBlob = function (blob) {
        var ob = JSON.parse(blob);

        function copyGame (game) {
          return Game.copy(game);
        }

        this.byevote = ob.byevote;
        this.downvote = ob.downvote;
        this.round = ob.round;
        this.roundvotes = ob.roundvotes;
        this.state = ob.state;
        this.upvote = ob.upvote;

        this.games = ob.games.map(copyGame);

        this.players.fromBlob(ob.players);
        this.ranking.fromBlob(ob.ranking);
      };

      return Swisstournament;
    });

// TODO hide internal functions
