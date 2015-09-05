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
    'core/matchresult', 'core/byeresult'], function(extend, Model, State,
    TeamModel, PlayerModel, Options, TournamentIndex, MatchModel, MatchResult,
    ByeResult) {
  /**
   * Constructor
   */
  function LegacyLoaderModel() {
    LegacyLoaderModel.superconstructor.call(this);
  }
  extend(LegacyLoaderModel, Model);

  LegacyLoaderModel.prototype.load = function(blob) {
    var glob;

    glob = JSON.parse(blob);

    /*
     * Teams
     */
    this.loadTeams(glob.team);

    /*
     * Options
     */
    this.loadOptions(glob.options);

    /*
     * Tournaments
     */
    this.loadTournaments(glob.tournaments);

    /*
     * History
     */
    this.loadHistory(glob.history);

    return true;
  };

  LegacyLoaderModel.prototype.loadTeams = function(blob) {
    var teams = JSON.parse(blob);

    teams.forEach(function(team) {
      var players = team.names.map(function(playername) {
        return new PlayerModel(playername);
      });

      State.teams.push(new TeamModel(players));
    });
  };

  LegacyLoaderModel.prototype.loadOptions = function(blob) {
    Options.fromBlob(blob);
    State.teamsize.set(Options.teamsize);
  };

  LegacyLoaderModel.prototype.loadTournaments = function(blob) {
    var tournaments = JSON.parse(blob);

    tournaments.forEach(function(data) {
      var tournament, system, name, blob, teams, ranking, parent, //
      rankingorder, tournamentData;

      system = data[0];
      name = data[1];
      blob = data[2];
      teams = data[3];
      ranking = data[4];
      parent = data[5];

      if (blob) {
        tournamentData = JSON.parse(blob);
      }

      rankingorder = {
        swiss: ['wins', 'buchholz', 'finebuchholz', 'saldo'],
        ko: ['ko']
      }[system];

      // create tournament
      tournament = TournamentIndex.createTournament(system, rankingorder);
      if (!tournament) {
        // TODO support for KOTournamentModel
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
          tournament.round = 0;
        }

        // add matches
        tournamentData.games.forEach(function(data) {
          var teams, match, id;

          teams = [data.teams[0][0], data.teams[1][0]];
          id = data.id;

          match = new MatchModel(teams, id, tournament.round);

          tournament.matches.push(match);
        });

      } else {
        tournament.state.forceState('finished');
      }

      // TODO bind parent
      console.error('tournament hierarchy can not yet be restored');

      State.tournaments.push(tournament);
    });
  };

  LegacyLoaderModel.prototype.loadHistory = function(blob) {
    var history = JSON.parse(blob);

    history.forEach(function(tournamenthistory, index) {
      var tournament, round;

      tournament = State.tournaments.get(index);
      round = tournament.round;

      /*
       * Matches
       */
      if (tournamenthistory.games && tournamenthistory.games.length > 0) {
        if (tournament.state.get() === 'initial') {
          tournament.state.forceState('idle');
        }

        tournamenthistory.games.forEach(function(match) {
          var match, result, teams, score, id, group;

          teams = [match[0], match[1]];
          score = [match[2], match[3]];
          group = match[4];
          id = match[5];

          if (group > round) {
            round = group;
          }

          match = new MatchModel(teams, id, group);
          result = new MatchResult(match, score);

          tournament.history.push(result);
          tournament.ranking.result(result);
        });

        if (tournament.SYSTEM === 'swiss' && round > tournament.round) {
          tournament.round = round;
        }
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

      /*
       * Corrections
       */
    });

  };

  return LegacyLoaderModel;
});
