/**
 * LegacyLoaderModel
 *
 * @return LegacyLoaderModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'ui/state', './teammodel',
    './playermodel', 'options', 'presets', 'core/tournamentindex',
    'core/matchmodel', 'core/matchresult', 'core/byeresult',
    'core/correctionmodel', './toast', 'core/rle'], function(extend, Model,
    State, TeamModel, PlayerModel, Options, Presets, TournamentIndex,
    MatchModel, MatchResult, ByeResult, CorrectionModel, Toast, RLE) {
  /**
   * Constructor
   */
  function LegacyLoaderModel() {
    LegacyLoaderModel.superconstructor.call(this);
  }
  extend(LegacyLoaderModel, Model);

  LegacyLoaderModel.prototype.load = function(glob) {
    var tournamentDataArray, tournamentRankingArray;

    State.clear();

    console.log('starting conversion');

    tournamentDataArray = [];
    tournamentRankingArray = [];

    /*
     * Options
     */
    this.loadOptions(glob.options);

    /*
     * Teams
     */
    this.loadTeams(glob.team);

    /*
     * Tournaments
     */
    this.loadTournaments(glob.tournaments, tournamentDataArray,
        tournamentRankingArray);

    /*
     * History
     */
    this.loadHistory(glob.history, tournamentDataArray);

    /*
     * Votes
     */
    this.loadVotes(tournamentDataArray, tournamentRankingArray);

    /*
     * additional missing objects, e.g. placeholder matches
     */
    this.createMissingObjects();
    console.log('conversion to format 1.5.0 successful');

    return true;
  };

  LegacyLoaderModel.prototype.loadTeams = function(blob) {
    var teams;

    console.log('converting teams');

    teams = JSON.parse(blob);

    teams.forEach(function(teamData) {
      var players, team;

      players = teamData.names.map(function(playername) {
        return new PlayerModel(playername);
      });

      team = new TeamModel(players);

      State.teams.push(team);

      console.log('converting team ' + team.getID() + ': '
          + teamData.names.join(', '));
    });

    console.log('conversion finished: ' + State.teams.length
        + ' teams converted');
  };

  LegacyLoaderModel.prototype.loadOptions = function(blob) {
    var optionsData;

    optionsData = JSON.parse(blob);
    if (optionsData.savefile === undefined) {
      if (Presets.target !== 'boule') {
        new Toast('cannot load pre-1.4 saves with this target: '
            + Presets.target, Toast.LONG);
        throw new Error('cannot load pre-1.4 saves with this target: '
            + Presets.target);
      }
    } else {
      if (optionsData.savefile !== Presets.target + '.json') {
        new Toast('cannot convert '
            + optionsData.savefile.replace(/.json$/, '') + ' to '
            + Presets.target, Toast.LONG);
        throw new Error('cannot convert '
            + optionsData.savefile.replace(/.json$/, '') + ' to '
            + Presets.target);
      }
    }

    console.log('converting options');

    Options.fromBlob(blob);

    console.log('converting teamsize');
    State.teamsize.set(Options.teamsize || 1);

    console.log('conversion finished: options');
  };

  LegacyLoaderModel.prototype.loadTournaments = function(blob,
      tournamentDataArray, tournamentRankingArray) {
    var tournaments, parents;

    console.log('converting tournaments');

    tournaments = JSON.parse(blob);
    parents = [];

    subtournamentOffsets = [];

    tournaments.forEach(function(data, tournamentID) {
      var tournament, system, name, blob, teams, ranking, parent, //
      rankingorder, tournamentData, startIndex;

      system = data[0];
      name = data[1];
      blob = data[2];
      teams = data[3];
      ranking = data[4];
      parent = data[5];

      console.log('converting tournament ' + tournamentID + ': ' + name);

      if (blob) {
        tournamentData = JSON.parse(blob);
      } else {
        tournamentData = undefined;
      }

      tournamentDataArray[tournamentID] = tournamentData;
      tournamentRankingArray[tournamentID] = ranking;

      rankingorder = {
        swiss: ['wins', 'buchholz', 'finebuchholz', 'saldo', 'votes'],
        ko: ['ko']
      }[system];

      // create tournament
      tournament = TournamentIndex.createTournament(system, rankingorder);
      if (!tournament) {
        console.error('TOURNAMENT SYSTEM NOT SUPPORTED YET: ' + system);
        return;
      }

      // name and teams
      tournament.getName().set(name);
      teams.forEach(tournament.addTeam.bind(tournament));

      if (tournamentData) {
        // set state
        if (tournamentData.games && tournamentData.games.length > 0) {
          tournament.state.forceState('running');
        } else {
          tournament.state.forceState('initial');
        }

        // set round
        if (system === 'swiss') {
          tournament.round = tournamentData.round - 1;
        } else {
          // no tournament round..
        }

        console.log('converting tournament matches');

        // add matches
        tournamentData.games.forEach(function(data) {
          var teams, match, id, group;

          teams = [data.teams[0][0], data.teams[1][0]];
          id = data.id;

          if (system === 'swiss') {
            group = tournament.round;
          } else {
            group = tournamentData.roundids[teams[0]];
            id += 1;
          }
          match = new MatchModel(teams, id, group);

          console.log('converting match ' + group + ':' + id + ': '
              + teams.join(' vs. '));

          tournament.matches.push(match);
        });

      } else {
        tournament.state.forceState('finished');
      }

      console.log('converted tournament state: ' + tournament.state.get());

      // convert the parent properties to startIndex
      if (parent === undefined || parent === null) {
        startIndex = 0;
      } else {
        console.log("converted tournament's parent: " + parent);
        startIndex = subtournamentOffsets[parent];
        subtournamentOffsets[parent] += tournament.getTeams().length;
      }
      subtournamentOffsets[tournamentID] = startIndex;

      console.log('converted tournament range: ' + startIndex + '-'
          + (startIndex + tournament.getTeams().length));

      // push tournaments. Also sets the ID. Arrays are dense (not sparse)
      State.tournaments.push(tournament, startIndex);

      // close tournament if necessary
      if (!blob) {
        console.log('closing tournament ' + tournamentID);
        State.tournaments.closeTournament(tournamentID);
      }
    });

    console.log('conversion finished: tournaments');
  };

  LegacyLoaderModel.prototype.loadHistory = function(blob, //
  tournamentDataArray) {
    var history = JSON.parse(blob);

    console.log('converting history');

    history.forEach(function(tournamenthistory, tournamentID) {
      var tournament, round, tournamentData, system;

      console.log('converting history for tournament ' + tournamentID);

      tournamentData = tournamentDataArray[tournamentID];
      tournament = State.tournaments.get(tournamentID);
      round = tournament.round;
      system = tournament.SYSTEM;

      function restoreMatchResult(match) {
        var result, teams, score, id, group;

        teams = [match[0], match[1]];
        score = [match[2], match[3]];
        group = match[4];
        id = match[5];

        if (group > round) {
          round = group;
        }

        if (system === 'ko') {
          id += 1;
        }

        teams = teams.map(tournament.teams.indexOf.bind(tournament.teams));

        match = new MatchModel(teams, id, group);
        result = new MatchResult(match, score);

        return result;
      }

      /*
       * Matches
       */
      if (tournamenthistory.games && tournamenthistory.games.length > 0) {
        if (tournament.state.get() === 'initial') {
          tournament.state.forceState('idle');
        }

        tournamenthistory.games.forEach(function(match) {
          var result = restoreMatchResult(match);

          console.log('converting match result ' + result.getID() + ': '
              + result.teams.join(' vs. ') + ':  ' + result.score.join(':'));

          tournament.history.push(result);
          tournament.ranking.result(result);
        });

        console.log('conversion: ' + tournament.history.length
            + ' results converted');

        // TODO restore half-filled KO matches

        // TODO fill in placeholder matches

        if (tournament.SYSTEM === 'swiss' && round > tournament.round) {
          tournament.round = round;
        }
      }

      /*
       * Corrections
       */
      if (tournamenthistory.corrections) {
        tournamenthistory.corrections.forEach(function(correctionData, id) {
          var before, after;

          before = restoreMatchResult(correctionData[0]);
          after = restoreMatchResult(correctionData[1]);

          correction = new CorrectionModel(before, after);

          console.log('converting correction ' + id + ': '
              + before.teams.join(' vs. ') + ': ');

          tournament.corrections.push(correction);
        });
      }

      console.log('conversion finished: ' + tournament.corrections.length
          + ' corrections converted');

      /*
       * Votes
       */
      tournamenthistory.votes.forEach(function(data) {
        var type, teamid, round, vote, id;

        type = data[0];
        teamid = data[1];
        round = data[2];
        id = tournament.getTeams().length >> 1;

        if (type === 0) {
          // bye
          vote = new ByeResult(teamid, [Options.byepointswon,
              Options.byepointslost], id, round);

          console.log('converting bye for team ' + teamid);

          tournament.history.push(vote);
          if (tournament.SYSTEM === 'swiss' //
              && round === tournament.getRound()) {
            tournament.votes.bye.push(teamid);
          }
          tournament.ranking.bye(teamid);
        }
      });
    });

    console.log('conversion finished: history');
  };

  LegacyLoaderModel.prototype.createMissingObjects = function() {
    console.log('conversion: creating missing tournament objects');

    State.tournaments.map(function(tournament) {
      this['createMissingObjects' + tournament.SYSTEM](tournament);
    }, this);

    console.log('conversion finished: missing tournament objects');
  };

  LegacyLoaderModel.prototype.createMissingObjectsko = function(tournament) {
    var teams, lastresults;

    console.log('conversion: creating missing objects for tournament '
        + tournament.getID() + ' (' + tournament.getName().get() + ')');

    console.log('conversion: finding dangling teams');
    tournament.createWaitingMatches();

    console.log('conversion: creating missing ko placeholder matches');
    tournament.createPlaceholderMatches();
  };

  LegacyLoaderModel.prototype.createMissingObjectsswiss = function(tournament) {
    console.log('conversion: no need missing objects for swiss tournament '
        + tournament.getID() + ' (' + tournament.getName().get() + ')');
  };

  LegacyLoaderModel.prototype.loadVotes = function(tournamentDataArray,
      tournamentRankingArray) {

    console.log('converting votes');

    tournamentDataArray.forEach(function(tournamentData, tournamentID) {
      var tournament, system, ranking, upvoteArray, downvoteArray;

      console.log('converting votes of tournament ' + tournamentID);

      tournament = State.tournaments.get(tournamentID);
      ranking = tournamentRankingArray[tournamentID];
      displayOrder = tournament.getRanking().get().displayOrder;

      system = tournament.SYSTEM;

      if (tournamentData) {
        console.log('converting votes from tournament data');

        if (tournamentData.upvote) {
          upvoteArray = RLE.decode(tournamentData.upvote);
        }

        if (tournamentData.downvote) {
          upvoteArray = RLE.decode(tournamentData.downvote);
        }

      } else if (ranking) {
        console.log('converting votes from ranking cache');

        upvoteArray = ranking.upvote;
        downvoteArray = ranking.downvote;

      } else {
        new Toast('tournament ' + tournamentID
            + ' contains neither tournament nor ranking blob', Toast.LONG);
        throw new Error('tournament ' + tournamentID
            + ' contains neither tournament nor ranking blob');
      }

      if (system === 'swiss') {
        if (tournament.ranking.upvotes && upvoteArray) {
          upvoteArray.forEach(function(upvotes, displayID) {
            var teamID = displayOrder[displayID];

            if (upvotes > 0) {
              console.log('converting ' + upvotes + ' upvotes for team '
                  + teamID);

              tournament.ranking.upvotes.set(teamID, tournament.ranking.upvotes
                  .get(teamID)
                  + upvotes);
            }
          });
        }

        if (tournament.ranking.downvotes && downvoteArray) {
          downvoteArray.forEach(function(downvotes, displayID) {
            var teamID = displayOrder[displayID];

            if (downvotes > 0) {
              console.log('converting ' + downvotes + ' downvotes for team '
                  + teamID);

              tournament.ranking.downvotes.set(teamID,
                  tournament.ranking.downvotes.get(teamID) + downvotes);
            }
          });
        }
      }

      console.log('conversion finished: votes of tournament ' + tournamentID);

      console.log('updating the ranking. You know... for safety and stuff.');
      console.log('');
      console.log('ok, I admit it. It is for the upvotes and downvotes.');

      tournament.ranking.emit('recalc');
      tournament.ranking.invalidate();
    });

    console.log('conversion finished: votes');
  };

  return LegacyLoaderModel;
});
