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
    './statevaluemodel', './matchmodel', 'ui/listcollectormodel'], function(
    extend, PropertyModel, ListModel, UniqueListModel, StateValueModel,
    MatchModel, ListCollectorModel) {
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
   */
  function TournamentModel() {
    var collector;

    TournamentModel.superconstructor.call(this);

    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS);
    this.teams = new UniqueListModel();
    this.matches = new ListModel();
    this.ranking = undefined;
    // this.votes = new VotesModel();
    // this.history = new HistoryModel();

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
   * @return ListModel of the running matches
   */
  TournamentModel.prototype.getMatches = function() {
    // TODO use MatchTranslationList or something
    return new ReadonlyListModel(this.matches);
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
  };

  return TournamentModel;
});
