/**
 * TournamentModel: An abstract tournament class which provides the basic
 * functions, such as ranking, team lists, invalidation, caching and a reference
 * name.
 *
 * @return TournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './propertymodel', './listmodel', './uniquelistmodel',
    './statevaluemodel'], function(extend, PropertyModel, ListModel,
    UniqueListModel, StateValueModel) {
  var STATETRANSITIONS, INITIALSTATE;

  /*
   * STATES lists the possible states.The following states are possible:
   *
   * 'initial': for player/team registration before the first match. Can be
   * followed by 'running' and 'final'. Initial state. In some tournament
   * systems, registration is only possible during 'initial' state.
   *
   * 'running': there are open games. Preceded by 'initial' or 'idle', can be
   * followed by 'idle' and 'final'
   *
   * 'idle': all previous games have been final, but new games can still be
   * generated. Preceded by 'running', followed by 'running' or 'final'.
   * Interaction required for state transition.
   *
   * all games are final, no games can be created anymore. No registration
   * possible. Preceded by 'running' or 'idle'. Final and constant state.
   *
   */
  STATETRANSITIONS = {
    'initial': ['running'],
    'running': ['idle', 'finished'],
    'idle': ['running', 'finished'],
    'final': []
  };
  INITIALSTATE = 'initial';

  /**
   * Constructor
   */
  function TournamentModel() {
    TournamentModel.superconstructor.call(this);

    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS);
    this.teams = new UniqueListModel();
    this.games = new ListModel();
    this.ranking = undefined; // best to create it here from some arguments?
    // this.votes = new VotesModel();
    // this.history = new HistoryModel();
  }
  extend(TournamentModel, PropertyModel);

  /**
   * a unique name for the tournament mode, e.g. 'ko' or 'tacteam'
   */
  TournamentModel.prototype.NAME = 'undefined';

  /**
   * send event on state change
   */
  TournamentModel.prototype.EVENTS = {
    'state': true,
    'error': true
  };

  TournamentModel.prototype.addTeam = function(teamid) {
    // TODO isNumber() check
    return this.teams.insert(teamid) !== undefined;
  };

  /**
   * @return a ListModel of the registered teams.
   */
  TournamentModel.prototype.getTeams = function() {
    // TODO use IndexTranslationList or something
    return new ReadonlyListModel(this.teams);
  };

  /**
   * @return ListModel of the running games
   */
  TournamentModel.prototype.getGames = function() {
    return new ReadonlyListModel(this.games);
  };

  return TournamentModel;
});
