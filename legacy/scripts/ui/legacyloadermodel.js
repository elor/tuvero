/**
 * LegacyLoaderModel
 *
 * @return LegacyLoaderModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', './state_new', './teammodel',
    './playermodel', 'options', 'core/tournamentindex', 'core/matchmodel',
    'core/matchresult', 'core/byeresult', 'core/correctionmodel'], function(
    extend, Model, State, TeamModel, PlayerModel, Options, TournamentIndex,
    MatchModel, MatchResult, ByeResult, CorrectionModel) {
  /**
   * Constructor
   */
  function LegacyLoaderModel() {
    LegacyLoaderModel.superconstructor.call(this);
  }
  extend(LegacyLoaderModel, Model);

  LegacyLoaderModel.prototype.load = function(blob) {
    var glob, tournamentDataArray;

    glob = JSON.parse(blob);
    tournamentDataArray = [];

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
    this.loadTournaments(glob.tournaments, tournamentDataArray);

    /*
     * History
     */
    this.loadHistory(glob.history, tournamentDataArray);

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

      team = new TeamModel(players)

      State.teams.push(team);

      console.log('converting team ' + team.getID() + ': '
          + teamData.names.join(', '));
    });

    console.log('conversion finished: ' + State.teams.length
        + ' teams converted');
  };

  LegacyLoaderModel.prototype.loadOptions = function(blob) {
    console.log('converting options');

    Options.fromBlob(blob);

    console.log('converting teamsize');
    State.teamsize.set(Options.teamsize);

    console.log('conversion finished: options');
  };

  LegacyLoaderModel.prototype.loadTournaments = function(blob,
      tournamentDataArray) {
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
        tournamentDataArray[tournamentID] = tournamentData
      }

      rankingorder = {
        swiss: ['wins', 'buchholz', 'finebuchholz', 'saldo'],
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

      if (blob) {
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

      // push tournaments. Also sets the ID. Arrays are dense (not sparse)
      State.tournaments.push(tournament);

      // convert the parent properties to startIndex
      if (parent === undefined || parent === null) {
        startIndex = 0;
      } else {
        console.log("converted tournament's parent: " + parent);
        startIndex = subtournamentOffsets[parent];
        subtournamentOffsets[parent] += tournament.getTeams().length;
      }
      subtournamentOffsets[tournamentID] = startIndex;
      State.tournaments.startIndex.push(startIndex);

      console.log('converted tournament range: ' + startIndex + '-'
          + (startIndex + tournament.getTeams().length));

      // close tournament if necessary
      if (!blob) {
        console.log('closing tournament ' + tournamentID)
        State.tournaments.closeTournament(tournamentID);
      }
    });

    console.log('conversion finished: tournaments');
  };

  LegacyLoaderModel.prototype.loadHistory = function(blob, //
  tournamentDataArray) {
    var history = JSON.parse(blob);

    history.forEach(function(tournamenthistory, index) {
      var tournament, round, tournamentData, system;

      tournamentData = tournamentDataArray[index];
      tournament = State.tournaments.get(index);
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

          tournament.history.push(result);
          tournament.ranking.result(result);
        });

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
        tournamenthistory.corrections.forEach(function(correctionData) {
          var before, after;

          before = restoreMatchResult(correctionData[0]);
          after = restoreMatchResult(correctionData[1]);

          correction = new CorrectionModel(before, after);

          tournament.corrections.push(correction);
        });
      }

      /*
       * Votes
       */
      tournamenthistory.votes.forEach(function(data) {
        var type, teamid, round, vote, id;

        type = data[0];
        teamid = data[1];
        round = data[2];
        id = tournament.getTeams().length >> 1;

        switch (type) {
        case 0: // bye
          vote = new ByeResult(teamid, [Options.byepointswon,
              Options.byepointslost], id, round);
          tournament.history.push(vote);
          if (tournament.SYSTEM === 'swiss' //
              && round === tournament.getRound()) {
            tournament.votes.bye.push(teamid);
          }
          tournament.ranking.bye(teamid);
          break;
        case 1: // upvote
          // TODO remember upvote
          console.error('upvote ignored');
          break;
        case -1: // downvote
          // TODO remember downvote
          console.error('downvote ignored');
          break;
        }
      });
    });

  };

  return LegacyLoaderModel;
});
