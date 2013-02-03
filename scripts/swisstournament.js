/**
 * Implementation of the swiss tournament system
 */
define(
    [ 'map', 'finebuchholzranking', 'game', 'result', 'random' ],
    function (Map, Finebuchholzranking, Game, Result, Random) {
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
        var res, wins, netto, bh, fbh, ids, i, rank;

        bh = [];
        fbh = [];
        ids = [];
        netto = [];
        wins = [];

        res = this.ranking.get();

        // rearrange the arrays from internal id indexing to ranked indexing
        for (i = 0; i < res.size; i += 1) {
          rank = res.ranking[i];

          bh[rank] = res.buchholz[i];
          fbh[rank] = res.finebuchholz[i];
          netto[rank] = res.netto[i];
          wins[rank] = res.wins[i];
        }

        return {
          bh : bh,
          fbh : fbh,
          ids : ids,
          netto : netto,
          wins : wins
        };
      };

      Swisstournament.prototype.randomizeGames = function () {
        var wins, wingroups, i, j, w, wgroup, tmparr, byevote, p, /*upvotes, */downvotes, invalidOpponents, downvote, k, q, arrsortfunc, visited, count, dsgsortfunc;
        if (this.games.length !== 0) {
          return undefined;
        }
        
        arrsortfunc = function (a, b) {
          return a.length - b.length;
        };

        dsgsortfunc = function (a, b) {
          return biggraph[a].length - biggraph[b].length;
        };

        // TODO implement an algorithm for getting new games
        // TODO verify internal ids
        // TODO remember that games uses external ids
        // TODO validate, of course
        // TODO DON'T exceed O(n^2)

        // Algorithm: for better understanding, read comments only.
        // create list of teams, ranked by wins (i.e. fbh ranking order)
        wins = this.ranking.get().wins;

        // create win groups
        wingroups = [];
        for (i = 0; i < ids.length; i += 1) {
          w = wins[i];

          if (wingroups[w] === undefined) {
            wingroups[w] = [];
          }

          wingroups[w].push(i);
        }

        byevote = undefined;
        upvotes = [];
        downvotes = [];

        // within the win groups:
        for (i = wingroups.length - 1; i >= 0; i -= 1) {
          wgroup = wingroups[i];

          // if uneven number of teams:
          if (wgroup.length % 2 === 1) {
            // find a random player that hasn't been up/down/byevoted
            // and move him to lower wingroup
            tmparr = [];

            for (j = 0; j < wgroup.length; j += 1) {
              p = wgroup[j];
              if (!this.byevote(p) && !this.upvote(p) && !this.downvote(p)
                  && downvotes.indexOf(p) === -1) {
                // player can be safely down/byevoted
                tmparr.push(wgroup[j]);
              }
            }

            // randomly pick the player
            p = tmparr[rng.nextInt(tmparr.length)];

            if (i === 0) {
              // already in lowest wingroup => byevote
              byevote = p;
            } else {
              // move player to lower wingroup
              wgroup.splice(wgroup.indexOf(p), 1);
              wingroups[i - 1].push(p);
              downvotes.push(p);
            }

          }

          // store the current downvote for later
          p = wgroup[wgroup.length - 1];
          if (downvotes.indexOf(p) !== -1) {
            downvote = p;
          } else {
            downvote = undefined;
          }

          // for every team:
          invalidOpponents = []; // pid-indexed true/false-list, true being
          for (j = 0; j < wgroup.length; j += 1) {
            invalidOpponents[p] = [];

            // invalid
            p = wgroup[j];

            // TODO find all previous opponents within the group

            // don't let a down/bye/upvote play against the current downvote
            // this avoids it being another upvote
            if (this.downvote[p] || this.upvote[p] || this.byevote[p]) {
              invalidOpponents[p][downvote] = true;
              invalidOpponents[downvote][p] = true;
            }
          }

          // invert the list, compressing it on the fly
          // -> graph: edges are possible games)
          biggraph = [];
          for (j = 0; j < wgroup.length; j += 1) {
            biggraph[j] = [];
            p = wgroup[j];
            for (k = j + 1; k < wgroup.length; k += 1) {
              q = wgroup[k];

              if (!invalidOpponents[p][q]) {
                biggraph[j].push(k);
                biggraph[k].push(j);
              }
            }
          }

          // // find all disconnected subgraphs (dsg)
          dsgs = [];
          tmparr = [];
          visited = [];
          for (j = wgroup.length - 1; j > 0; j -= 1) {
            if (tmparr.length === 0) {
              p = visited.indexOf(undefined);
              dsg = [];
              dsgs.push(dsg);
            } else {
              p = tmparr.shift();
            }

            visited[p] = true;

            dgs.push(p);

            for (k = 0; k < biggraph[j].length; k += 1) {
              q = biggraph[j][k];
              if (!visited[q]) {
                tmparr.push(q);
              }
            }
          }

          // // sort dsgs by size
          dsgs.sort(arrsortfunc);

          // critically abort if the size of two dsgs is odd
          count = 0;
          for (j = 0; j < dsgs.length; j += 1) {
            if (dsgs[j].length % 2 === 1) {
              count += 1;
            }
          }
          if (count > 1) {
            // TODO critically abort
            return undefined;
          }

          // for each dsg:
          for (j = 0; j < dsgs.length; j += 1) {
            dsg = dsgs[j];

            while (dsg.length > 0) {
              // sort nodes by number of edges
              dsg.sort(dsgsortfunc);

              // grab node with fewest edges
              p = dsg[0];

              if (biggraph[p].length < 1) {
                // TODO problem?
                return undefined;
              } else {
                // determine random edge
                r = this.rng.nextInt(biggraph[p].length);
                q = biggraph[p][r];

                // extract random edge along with both nodes
                // TODO continue here
              }
            }
          }

        }

        // //// extract edges until the size is less than 2:
        // ////// if node is out of edges:
        // //////// repeat for this dsg
        // //////// abort after 10 times
        // // store byevote

        return this.games;
      };

      return Swisstournament;
    });
