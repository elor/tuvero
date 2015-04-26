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
    './statevaluemodel', './matchmodel', 'ui/listcollectormodel',
    './rankingmodel', './matchreferencelistmodel'], function(extend,
    PropertyModel, ListModel, UniqueListModel, StateValueModel, MatchModel,
    ListCollectorModel, RankingModel, MatchReferenceListModel) {
  var STATETRANSITIONS, INITIALSTATE;

  /*
   * STATES lists the possible states.The following states are possible:
   *
   * 'initial': for player/team registration before the first match. Can be
   * followed by 'running' and 'final'. Initial state. In some tournament
   * systems, registration is only possible during 'initial' state.
   *
   * 'running': there are open matches. Preceded by 'initial' or 'idle', can be
   * followed by 'idle' and 'final'
   *
   * 'idle': all previous matches have been final, but new matches can still be
   * generated. Preceded by 'running', followed by 'running' or 'final'.
   * Interaction required for state transition.
   *
   * all matches are final, no matches can be created anymore. No registration
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
   *
   * @param rankingorder
   *          an array of ranking orders, e.g. ['wins', 'buchholz']
   */
  function TournamentModel(rankingorder) {
    var collector;
    TournamentModel.superconstructor.call(this);
    // TODO initialize with properties

    // rankingorder default: sort by entry order
    rankingorder = rankingorder || ['id'];

    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS);
    this.teams = new UniqueListModel();
    this.matches = new ListModel();
    this.ranking = new RankingModel(rankingorder, 0, this.RANKINGDEPENDENCIES);
    // this.votes = new VotesModel();
    // this.history = new HistoryModel();

    // initial properties
    this.setProperty('addteamrunning', false);
    this.setProperty('addteamidle', false);

    // listen to the matches
    collector = new ListCollectorModel(this.matches, MatchModel);
    collector.registerListener(this);
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

  /**
   * Array of additional ranking dependencies, e.g. ['matchmatrix']
   */
  TournamentModel.prototype.RANKINGDEPENDENCIES = [];

  /**
   * add a team id to the tournament. Teams can only be entered once.
   *
   * Undefined behaviour if the tournament has already started.
   *
   * TODO use some configuration object to determine
   *
   * @param teamid
   *          the external id of a team
   * @return true on success, false if the team already exists. undefined if the
   *         team cannot be added in the current state
   */
  TournamentModel.prototype.addTeam = function(teamid) {
    // TODO isNumber() check
    switch (this.state.get()) {
    case 'initial':
      break;
    case 'running':
      if (!this.getProperty('addteamrunning')) {
        return undefined;
      }
      break;
    case 'idle':
      if (!this.getProperty('addteamidle')) {
        return undefined;
      }
      break;
    case 'finished':
      console.error('cannot enter add a team to a finished tournament');
      return undefined;
    }

    if (this.teams.insert(teamid) !== undefined) {
      this.ranking.resize(this.teams.length);
      return true;
    }

    return false;
  };

  /**
   * @return the current state of the tournament
   */
  TournamentModel.prototype.getState = function() {
    return this.state.get();
  };

  /**
   * @return a ListModel of the registered teams.
   */
  TournamentModel.prototype.getTeams = function() {
    // TODO use a singleton
    return new ReadonlyListModel(this.teams);
  };

  /**
   * @return ListModel of the running matches, with global team ids
   */
  TournamentModel.prototype.getMatches = function() {
    // TODO use a singleton
    return new MatchReferenceListModel(this.matches, this.teams);
  };

  /**
   * Validate a match result before accepting it. If validation fails, the
   * result is discarded and the match is supposed to stay open.
   *
   * @param matchresult
   *          a MatchResult instance
   * @return true if the result is valid, false otherwise
   */
  TournamentModel.prototype.validateMatchResult = function(matchresult) {
    var valid;

    valid = matchresult.score.every(function(score) {
      return score >= Options.minpoints && score <= Options.maxpoints;
    });

    return valid;
  };

  /**
   * perform additional functions, e.g. adding new matches, after a match has
   * been finished and its result has been written to history and ranking
   *
   * @param matchresult
   *          a valid and accepted match result
   */
  TournamentModel.prototype.postprocessMatch = function(matchresult) {
    // Default: Do nothing.
  };

  /**
   * validate and process a match result
   *
   * @param emitter
   *          the emitter, i.e. the collector. no use.
   * @param event
   *          the event, i.e. 'finish'. no use.
   * @param matchresult
   *          a matchresult instance, which has been enhanced with a 'source'
   *          attribute, which is a reference to the original MatchModel
   *          instance
   */
  TournamentModel.prototype.onfinish = function(emitter, event, matchresult) {
    if (this.matches.indexOf(matchresult.match) === -1) {
      console.error('onfinish: match is not open anymore or does not exist');
      return;
    }

    if (!this.validateMatchResult(matchresult)) {
      console.error('onfinish: match result fails validation test');
      return;
    }

    this.matches.erase(matchresult);
    // TODO add result to history
    this.ranking.result(matchresult);

    this.postprocessMatch(matchresult);

    if (this.state === 'running' && this.matches.length === 0) {
      this.state.set('idle');
    }
  };

  return TournamentModel;
});
