/**
 * LegacyLoaderModel
 *
 * @return LegacyLoaderModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', './state_new', './teammodel',
    './playermodel'], function(extend, Model, State, TeamModel, PlayerModel) {
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

  LegacyLoaderModel.prototype.loadOptions = function(options) {
    // console.log(options);
  };

  LegacyLoaderModel.prototype.loadTournaments = function(tournaments) {
    // console.log(tournaments);
  };

  LegacyLoaderModel.prototype.loadHistory = function(history) {
    // console.log(history);
  };

  return LegacyLoaderModel;
});
