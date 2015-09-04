/**
 * LegacyLoaderModel
 *
 * @return LegacyLoaderModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', './state_new', './teammodel',
    './playermodel', 'options', 'core/tournamentindex'], function(extend,
    Model, State, TeamModel, PlayerModel, Options, TournamentIndex) {
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
      var tournament, system, name, blob, teams, ranking, parent, rankingorder;

      system = data[0];
      name = data[1];
      blob = data[2];
      teams = data[3];
      ranking = data[4];
      parent = data[5];

      rankingorder = {
        swiss: ['wins', 'buchholz', 'finebuchholz', 'saldo'],
        ko: ['ko']
      }[system];

      tournament = TournamentIndex.createTournament(system, rankingorder);
      if (!tournament) {
        console.error('TOURNAMENT SYSTEM NOT SUPPORTED YET: ' + system);
        return;
      }

      tournament.getName().set(name);
      teams.forEach(tournament.addTeam.bind(tournament));

      if (blob) {
        // TODO read current state of the tournament
      } else {
        tournament.state.forceState('finished');
      }

      // TODO ranking? Nope. Just use the history.

      // TODO bind parent

      State.tournaments.push(tournament);
    });
  };

  LegacyLoaderModel.prototype.loadHistory = function(history) {
    // console.log(history);
  };

  return LegacyLoaderModel;
});
