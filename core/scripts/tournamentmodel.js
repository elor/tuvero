/**
 * TournamentModel: An abstract tournament class which provides the basic
 * functions, such as ranking, team lists, invalidation, caching and a reference
 * name.
 *
 * TournamentModel implements the IndexedModel interface, although it's no
 * direct descendant. This is to ensure the encapsulation in IndexedListModels.
 *
 * @return TournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './propertymodel', './listmodel', './uniquelistmodel',
    './rankingmapper', './statevaluemodel', './matchmodel',
    'ui/listcollectormodel', './listener', './rankingmodel',
    './matchreferencelistmodel', './maplistmodel', './valuemodel',
    './readonlylistmodel', 'options', './indexedmodel'], function(extend,
    PropertyModel, ListModel, UniqueListModel, RankingMapper, StateValueModel,
    MatchModel, ListCollectorModel, Listener, RankingModel,
    MatchReferenceListModel, MapListModel, ValueModel, ReadonlyListModel,
    Options, IndexedModel) {
  var STATETRANSITIONS, INITIALSTATE;

  /*
   * STATES lists the possible states.The following states are possible:
   *
   * 'initial': for player/team registration before the first match. Can be
   * followed by 'running' and 'finished'. Initial state. In some tournament
   * systems, registration is only possible during 'initial' state.
   *
   * 'running': there are open matches. Preceded by 'initial' or 'idle', can be
   * followed by 'idle' and 'finished'
   *
   * 'idle': all previous matches have been finished, but new matches can still
   * be generated. Preceded by 'running', followed by 'running' or 'finished'.
   * Interaction required for state transition.
   *
   * 'finished': all matches are finished, no matches can be created anymore. No
   * registration possible. Preceded by 'running' or 'idle'. Final and constant
   * state.
   *
   */
  STATETRANSITIONS = {
    'initial': ['running'],
    'running': ['idle', 'finished'],
    'idle': ['running', 'finished'],
    'finished': []
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
    IndexedModel.call(this);

    // TODO initialize with properties

    // rankingorder default: sort by entry order
    rankingorder = rankingorder || ['id'];

    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS);
    this.teams = new UniqueListModel();
    this.matches = new ListModel();
    this.ranking = new RankingModel(rankingorder, 0, this.RANKINGDEPENDENCIES);
    this.votes = TournamentModel.initVoteLists(this.VOTES);
    this.history = new ListModel();

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
  TournamentModel.prototype.SYSTEM = 'undefined';

  /**
   * send event on state change
   */
  TournamentModel.prototype.EVENTS = {
    'state': true,
    'error': true,
    'update': true
  };

  /**
   * Array of additional ranking dependencies, e.g. ['matchmatrix']
   */
  TournamentModel.prototype.RANKINGDEPENDENCIES = [];

  /**
   * an array of required vote lists
   */
  TournamentModel.prototype.VOTES = ['bye'];

  /**
   * @param types
   *          an array of vote types
   * @return a dictionary of vote lists
   */
  TournamentModel.initVoteLists = function(types) {
    var votes;

    votes = {};

    types.forEach(function(type) {
      votes[type] = new ListModel();
    });

    return votes;
  };

  /**
   * Whenever a bye is added to the this.votes.bye ListModel instance, it's
   * automatically submitted to the results
   *
   * @param tournament
   */
  TournamentModel.initByeListener = function(tournament) {
    if (tournament.votes.bye) {
      Listener.bind(tournament.votes.bye, 'insert', function(emitter, event,
          data) {
        this.ranking.bye(data.object);
      }, tournament);
    }
  };

  /**
   * automatically check if the tournament is supposed to be in an idle state
   * and transition to the idle state if necessary
   */
  TournamentModel.prototype.checkIdleState = function() {
    if (this.state.get() === 'running' && this.matches.length === 0) {

      // TODO add votes to history

      // clear votes
      Object.keys(this.votes).forEach(function(key) {
        this.votes[key].clear();
      }, this);

      // apply idle state
      this.state.set('idle');
    }
  };

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

    if (this.teams.push(teamid) !== undefined) {
      this.ranking.resize(this.teams.length);
      return true;
    }

    return false;
  };

  /**
   * Retrieve the state of the tournament as a ValueModel instance, which emits
   * update events and provides a get() function for the state
   *
   * @return a readonly ValueModel instance of the state. use the get() function
   *         to retrieve the current value of the state
   */
  TournamentModel.prototype.getState = function() {
    var value = new ValueModel(this.state.get());
    value.bind(this.state);
    return value;
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
   * retrieve vote lists for the current 'running' state (i.e. current round)
   *
   * @param type
   *          the vote type, i.e. 'bye', 'up', 'down', ...
   * @return a readonly listmodel of team ids which received the specified, or
   *         undefined if the vote type doesn't exist
   */
  TournamentModel.prototype.getVotes = function(type) {
    if (!type || this.votes[type] === undefined) {
      console.error('vote type "' + type
          + '" does not exist for this tournament type');
      return undefined;
    }

    // TODO use a singleton
    return new MapListModel(this.votes[type], this.teams);
  };

  /**
   * retrieve a dynamic ranking object from which the ranking can be read with
   * global ids
   *
   * @return a RankingMapper instance, which emits 'update' and provides get()
   */
  TournamentModel.prototype.getRanking = function() {
    return new RankingMapper(this.ranking, this.teams);
  };

  /**
   * runs the tournament by creating matches and transitioning into 'running'
   * state, if possible.
   *
   * @return true on success, undefined otherwise
   */
  TournamentModel.prototype.run = function() {
    switch (this.state.get()) {
    case 'initial':
      if (this.initialMatches()) {
        break;
      }
      console.error('initialMatches() failed');
      return undefined;
    case 'idle':
      if (this.idleMatches()) {
        break;
      }
      console.error('idleMatches() failed');
      return undefined;
    case 'running':
      console.error('tournament is already running');
      return undefined;
    case 'finished':
      console.error('tournament is already finished');
      return undefined;
    }

    if (this.matches.length > 0) {
      this.state.set('running');
    } else {
      throw new Error('tournament is running, but no games have been created');
    }
    return true;
  };

  /**
   * manually finish a tournament, which is in 'idle' state (or 'initial' state)
   *
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.finish = function() {
    switch (this.state.get()) {
    case 'idle':
      this.state.set('finished');
      return true;
    case 'finished':
      return true;
    case 'initial':
      this.state.set('finished');
      return true;
    case 'running':
      console.error('cannot finish a running tournament');
      break;
    }

    return false;
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

    this.matches.erase(matchresult.match);

    this.history.push(matchresult);

    this.ranking.result(matchresult);

    this.postprocessMatch(matchresult);

    this.checkIdleState();
  };

  /*****************************************************************************
   * ABSTRACT FUNCTIONS
   ****************************************************************************/

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
   * perform additional functions after a match has been finished and its result
   * has been written to history and ranking. Can be used to start new matches
   * or adjust the tournament state to 'finished'.
   *
   * @param matchresult
   *          a valid and accepted match result
   */
  TournamentModel.prototype.postprocessMatch = function(matchresult) {
    // Default: Do nothing.
  };

  /**
   * create matches from an initial state (first round)
   *
   * @return true on success (i.e. valid matches have been created), false or
   *         undefined otherwise
   */
  TournamentModel.prototype.initialMatches = function() {
    // create matches here

    if (this.teams.length < 3) {
      return false;
    }

    this.matches.push(new MatchModel([0, 1], 1, 0));
    this.votes.bye.push(2);

    return true;
  };

  /**
   * create matches from an idle state (subsequent rounds)
   *
   * @return true on success (i.e. valid matches have been created), false or
   *         undefined otherwise
   */
  TournamentModel.prototype.idleMatches = function() {
    // create matches here

    this.matches.push(new MatchModel([1, 2], 1, 0));
    this.votes.bye.push(0);

    return true;
  };

  /**
   * Query whether a match result is in the history
   *
   * @param matchResult
   *          a MatchResult instance
   * @returns true if the result is in the history, false otherwise
   */
  TournamentModel.prototype.isInHistory = function(matchResult) {
    var i;

    for (i = 0; i < this.history.length; i += 1) {
      if (this.history.get(i).equals(matchResult)) {
        return true;
      }
    }

    return false;
  };

  /**
   *
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.correct = function(oldResult, newResult) {
    if (!this.isInHistory(matchResult)) {
      return false;
    }

    this.ranking.correct(oldResult, newResult);
    // TODO update all subsequent games
    // TODO update history
    // TODO emit appropriate events

    return true;
  };

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  TournamentModel.prototype.save = function() {
    var data = TournamentModel.superclass.save.call(this);

    data.id = this.id;
    data.sys = this.SYSTEM;
    data.state = this.state.get();
    data.teams = this.teams.asArray();
    data.matches = this.matches.save();
    data.history = this.history.save();
    data.ranking = this.ranking.save();
    data.votes = {};
    this.VOTES.forEach(function(votetype) {
      data.votes[votetype] = this.votes[votetype].save();
    }, this);

    return data;
  };

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.restore = function(data) {
    if (this.SYSTEM !== data.sys) {
      console.error('TournamentModel.restore() error: System mismatch');
      return false;
    }

    if (!TournamentModel.superclass.restore.call(this, data)) {
      return false;
    }

    this.id = data.id;

    if (!this.state.forceState(data.state)) {
      console.error('TournamentModel.restore(): invalid tournament state');
      return false;
    }

    if (!this.teams.restore(data.teams)) {
      console.error('TournamentModel.restore(): cannot restore teams');
      return false;
    }

    if (!this.matches.restore(data.matches, MatchModel)) {
      console.error('TournamentModel.restore(): cannot restore matches');
      return false;
    }

    if (!this.history.restore(data.history, MatchResult)) {
      console.error('TournamentModel.restore(): cannot restore history');
      return false;
    }

    if (!this.ranking.restore(data.ranking)) {
      console.error('TournamentModel.restore(): cannot restore ranking');
      return false;
    }

    if (!this.VOTES.every(function(votetype) {
      this.votes[votetype].clear();
      if (data.votes[votetype]) {
        this.votes[votetype].restore(data.votes[votetype]);
      }
      return true;
    }, this)) {
      console.error('TournamentModel.restore(): cannot restore votes');
      return false;
    }

    return true;
  };

  TournamentModel.prototype.getID = IndexedModel.prototype.getID;
  TournamentModel.prototype.setID = IndexedModel.prototype.setID;

  // TODO use constructor references (MatchModel.SAVEFORMAT) instead of "Object"
  TournamentModel.prototype.SAVEFORMAT = Object
      .create(TournamentModel.superclass.SAVEFORMAT);
  TournamentModel.prototype.SAVEFORMAT.id = Number;
  TournamentModel.prototype.SAVEFORMAT.sys = String;
  TournamentModel.prototype.SAVEFORMAT.state = String;
  TournamentModel.prototype.SAVEFORMAT.teams = [Number];
  TournamentModel.prototype.SAVEFORMAT.matches = [Object];
  TournamentModel.prototype.SAVEFORMAT.history = [Object];
  TournamentModel.prototype.SAVEFORMAT.ranking = Object;
  TournamentModel.prototype.SAVEFORMAT.votes = Object;

  return TournamentModel;
});
