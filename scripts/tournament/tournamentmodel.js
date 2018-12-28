/**
 * TournamentModel: An abstract tournament class which provides the basic
 * functions, such as ranking, team lists, invalidation, caching and a reference
 * name.
 *
 * TournamentModel implements the IndexedModel interface, although it's no
 * direct descendant. This is to ensure the encapsulation in IndexedListModels.
 *
 * @return TournamentModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/propertymodel', 'list/listmodel', 'core/uniquelistmodel',
  'ranking/rankingmapper', 'core/statevaluemodel', 'core/matchmodel', 'core/matchresult',
  'ui/listcollectormodel', 'core/listener', 'ranking/rankingmodel',
  'list/referencelistmodel', 'list/maplistmodel', 'core/valuemodel',
  'list/readonlylistmodel', 'options', 'list/indexedmodel', 'core/correctionmodel',
  'core/matchreferencemodel', 'core/resultreferencemodel', 'core/type',
  'core/correctionreferencemodel', 'list/sortedreferencelistmodel',
  'list/combinedreferencelistmodel', 'core/byeresult'
], function (extend,
  PropertyModel, ListModel, UniqueListModel, RankingMapper, StateValueModel,
  MatchModel, MatchResult, ListCollectorModel, Listener, RankingModel,
  ReferenceListModel, MapListModel, ValueModel, ReadonlyListModel, Options,
  IndexedModel, CorrectionModel, MatchReferenceModel, ResultReferenceModel,
  Type, CorrectionReferenceModel, SortedReferenceListModel,
  CombinedReferenceListModel, ByeResult) {
  var STATETRANSITIONS, INITIALSTATE

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
  }
  INITIALSTATE = 'initial'

  /**
   * Constructor
   *
   * @param rankingorder
   *          an array of ranking orders, e.g. ['wins', 'buchholz']
   */
  function TournamentModel (rankingorder) {
    var collector

    TournamentModel.superconstructor.call(this)
    IndexedModel.call(this)

    // TODO initialize with properties

    // rankingorder default: sort by entry order
    rankingorder = rankingorder || ['id']

    this.state = new StateValueModel(INITIALSTATE, STATETRANSITIONS)
    this.teams = new UniqueListModel()
    this.matches = new ListModel()
    this.ranking = new RankingModel(rankingorder, 0, this.RANKINGDEPENDENCIES)
    this.votes = TournamentModel.initVoteLists(this.VOTES)
    this.totalvotes = TournamentModel.initVoteLists(this.VOTES)
    this.history = new ListModel()
    this.corrections = new ListModel()
    this.name = new ValueModel(this.SYSTEM)

    // singletons for the getters(), in order to not bloat the listener
    // arrays
    this.singletons = {}

    // initial properties
    this.setProperty('addteamrunning', false)
    this.setProperty('addteamidle', false)

    // listen to the matches
    collector = new ListCollectorModel(this.matches, MatchModel)
    collector.registerListener(this)

    // print error messages to the output
    Listener.bind(this, 'error', function (emitter, event, message) {
      console.error(message)
    })
  }
  extend(TournamentModel, PropertyModel)

  /**
   * a unique name for the tournament mode, e.g. 'ko' or 'tacteam'
   */
  TournamentModel.prototype.SYSTEM = 'undefined'

  /**
   * send event on state change
   */
  TournamentModel.prototype.EVENTS = {
    'state': true,
    'error': true,
    'update': true
  }

  /**
   * Array of additional ranking dependencies, e.g. ['matchmatrix']
   */
  TournamentModel.prototype.RANKINGDEPENDENCIES = []

  /**
   * an array of required vote lists
   */
  TournamentModel.prototype.VOTES = ['bye']

  /**
   * @param types
   *          an array of vote types
   * @return a dictionary of vote lists
   */
  TournamentModel.initVoteLists = function (types) {
    var votes

    votes = {}

    types.forEach(function (type) {
      votes[type] = new ListModel()
    })

    return votes
  }

  /**
   * automatically check if the tournament is supposed to be in an idle state
   * and transition to the idle state if necessary
   */
  TournamentModel.prototype.checkIdleState = function () {
    if (this.state.get() === 'running' && this.matches.length === 0) {
      // TODO add votes to history

      // clear votes
      Object.keys(this.votes).forEach(function (key) {
        this.votes[key].clear()
      }, this)

      // apply idle state
      this.state.set('idle')
    }
  }

  /**
   * change the ranking order after tournament creation
   *
   * TODO write unit test
   *
   * @param rankingorder
   *          an array of ranking order component names
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.setRankingOrder = function (rankingorder) {
    if (rankingorder === undefined || rankingorder.length === 0) {
      return false
    }

    this.ranking.reset()
    if (this.ranking.init(rankingorder, this.teams.length,
      this.RANKINGDEPENDENCIES)) {
      this.recalculateRanking()
      return true
    } else {
      return false
    }
  }

  TournamentModel.prototype.verifyRanking = function () {
    var rankingcopy

    rankingcopy = new RankingModel()
    rankingcopy.clone(this.ranking)

    rankingcopy.recalculate(this.history, this.totalvotes)

    return JSON.stringify(this.ranking.get()) === JSON.stringify(rankingcopy.get())
  }

  TournamentModel.prototype.recalculateRanking = function () {
    this.ranking.recalculate(this.history, this.totalvotes)
  }

  /**
   * add a team id to the tournament. Teams can only be entered once.
   *
   * Undefined behaviour if the tournament has already started.
   *
   * @param teamid
   *          the external id of a team
   * @return true on success, false if the team already exists. undefined if the
   *         team cannot be added in the current state
   */
  TournamentModel.prototype.addTeam = function (teamid) {
    switch (this.state.get()) {
      case 'initial':
        break
      case 'running':
        if (!this.getProperty('addteamrunning')) {
          return undefined
        }
        break
      case 'idle':
        if (!this.getProperty('addteamidle')) {
          return undefined
        }
        break
      case 'finished':
        this.emit('error', 'cannot enter add a team to a finished tournament')
        return undefined
    }

    if (this.teams.push(teamid) !== undefined) {
      this.ranking.resize(this.teams.length)
      return true
    }

    return false
  }

  /**
   * Retrieve the state of the tournament as a ValueModel instance, which emits
   * update events and provides a get() function for the state
   *
   * @return a readonly ValueModel instance of the state. use the get() function
   *         to retrieve the current value of the state
   */
  TournamentModel.prototype.getState = function () {
    if (this.singletons.state === undefined) {
      this.singletons.state = new ValueModel(this.state.get())
      this.singletons.state.bind(this.state)
    }
    return this.singletons.state
  }

  /**
   * @return a ListModel of the registered teams.
   */
  TournamentModel.prototype.getTeams = function () {
    if (this.singletons.teams === undefined) {
      this.singletons.teams = new ReadonlyListModel(this.teams)
    }
    return this.singletons.teams
  }

  /**
   * @return ListModel of the running matches, with global team ids
   */
  TournamentModel.prototype.getMatches = function () {
    if (this.singletons.matches === undefined) {
      this.singletons.matches = new ReferenceListModel(
        new SortedReferenceListModel(this.matches,
          TournamentModel.matchCompare), this.teams, MatchReferenceModel)
    }
    return this.singletons.matches
  }

  /**
   * compare the groups and ids of two matches
   *
   * @param a
   *          the first match
   * @param b
   *          the second match
   * @return the order relation: 0, >0 or <0
   */
  TournamentModel.matchCompare = function (a, b) {
    return (a.getGroup() - b.getGroup()) || (a.getID() - b.getID())
  }

  /**
   * @return ListModel of the running matches, with global team ids
   */
  TournamentModel.prototype.getHistory = function () {
    if (this.singletons.history === undefined) {
      this.singletons.history = new ReferenceListModel(
        new SortedReferenceListModel(this.history,
          TournamentModel.matchCompare), this.teams, ResultReferenceModel)
    }
    return this.singletons.history
  }

  /**
   * @return ListModel of the running matches, with global team ids
   */
  TournamentModel.prototype.getCombinedHistory = function () {
    // prepare this.singletons.sortedRawHistory

    if (this.singletons.combinedHistory === undefined) {
      // combine matches and history into a single list
      this.singletons.combinedRawHistory = new CombinedReferenceListModel(
        this.matches, this.history)
      // sort the combined list
      this.singletons.sortedCombinedRawHistory = new SortedReferenceListModel(
        this.singletons.combinedRawHistory, TournamentModel.matchCompare)
      // reference the combined list and map the teams
      this.singletons.combinedHistory = new ReferenceListModel(
        this.singletons.sortedCombinedRawHistory, this.teams,
        ResultReferenceModel)
    }
    return this.singletons.combinedHistory
  }

  /**
   * @return ListModel of the running matches, with global team ids
   */
  TournamentModel.prototype.getCorrections = function () {
    if (this.singletons.corrections === undefined) {
      this.singletons.corrections = new ReferenceListModel(this.corrections,
        this.teams, CorrectionReferenceModel)
    }
    return this.singletons.corrections
  }

  /**
   * retrieve vote lists for the current 'running' state (i.e. current round)
   *
   * @param type
   *          the vote type, i.e. 'bye', 'up', 'down', ...
   * @return a readonly listmodel of team ids which received the specified, or
   *         undefined if the vote type doesn't exist
   */
  TournamentModel.prototype.getVotes = function (type) {
    if (!type || this.votes[type] === undefined) {
      this.emit('error', 'vote type "' + type +
        '" does not exist for this tournament type')
      return undefined
    }

    if (this.singletons.votes === undefined) {
      this.singletons.votes = {}
    }

    if (this.singletons.votes[type] === undefined) {
      this.singletons.votes[type] = new MapListModel(this.votes[type],
        this.teams)
    }

    return this.singletons.votes[type]
  }

  TournamentModel.prototype.getName = function () {
    if (this.singletons.name === undefined) {
      this.singletons.name = new ValueModel()
      this.singletons.name.bind(this.name)
      this.name.bind(this.singletons.name)
    }

    return this.singletons.name
  }

  /**
   * retrieve a dynamic ranking object from which the ranking can be read with
   * global ids
   *
   * @return a RankingMapper instance, which emits 'update' and provides get()
   */
  TournamentModel.prototype.getRanking = function () {
    if (this.singletons.ranking === undefined) {
      this.singletons.ranking = new RankingMapper(this.ranking, this.teams)
    }
    return this.singletons.ranking
  }

  /**
   * runs the tournament by creating matches and transitioning into 'running'
   * state, if possible.
   *
   * @return true on success, undefined otherwise
   */
  TournamentModel.prototype.run = function () {
    switch (this.state.get()) {
      case 'initial':
        if (this.initialMatches()) {
          break
        }
        this.emit('error', 'initialMatches() failed')
        return undefined
      case 'idle':
        if (this.idleMatches()) {
          break
        }
        this.emit('error', 'idleMatches() failed')
        return undefined
      case 'running':
        this.emit('error', 'tournament is already running')
        return undefined
      case 'finished':
        this.emit('error', 'tournament is already finished')
        return undefined
    }

    this.VOTES.forEach(function (votetype) {
      this.votes[votetype].forEach(function (teamID) {
        this.totalvotes[votetype].push(teamID)
      }, this)
    }, this)

    if (this.matches.length > 0) {
      this.state.set('running')
    } else {
      throw new Error('tournament is running, but no games have been created')
    }
    return true
  }

  /**
   * manually finish a tournament, which is in 'idle' state (or 'initial' state)
   *
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.finish = function () {
    switch (this.state.get()) {
      case 'idle':
        this.state.set('finished')
        return true
      case 'finished':
        return true
      case 'initial':
        this.state.set('finished')
        return true
      case 'running':
        this.emit('error', 'cannot finish a running tournament')
        break
    }

    return false
  }

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
  TournamentModel.prototype.onfinish = function (emitter, event, matchresult) {
    var match

    match = matchresult.source

    if (this.matches.indexOf(match) === -1) {
      this.emit('error',
        'onfinish: match is not open anymore or does not exist')
      return
    }

    if (!this.validateMatchResult(matchresult)) {
      this.emit('error', 'onfinish: match result fails validation test')
      return
    }

    this.matches.erase(match)

    this.history.push(matchresult)

    this.ranking.result(matchresult)

    this.postprocessMatch(matchresult)

    this.checkIdleState()
  }

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
  TournamentModel.prototype.validateMatchResult = function (matchresult) {
    var valid

    valid = matchresult.score.every(function (score) {
      return score >= Options.minpoints && score <= Options.maxpoints
    })

    return valid
  }

  /**
   * Validate a result before accepting it. If the validation fails, the
   * correction is discarded and the result remains the way it was.
   *
   * @param correction
   *          a CorrectionModel instance
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.validateCorrection = function (correction) {
    return true
  }

  /**
   * perform additional functions after a match has been finished and its result
   * has been written to history and ranking. Can be used to start new matches
   * or adjust the tournament state to 'finished'.
   *
   * @param matchresult
   *          a valid and accepted match result
   */
  TournamentModel.prototype.postprocessMatch = function (matchresult) {
    // Default: Do nothing.
  }

  /**
   * perform additional functions after a result has been corrected. This may
   * include reverting to a previous state and re-rolling the entire tournament
   * from this point on, or doing nothing since most cases are already handled
   * by the ranking
   *
   * @param correction
   *          the applied correction
   */
  TournamentModel.prototype.postprocessCorrection = function (correction) {
    // Default: Do nothing.
  }

  /**
   * create matches from an initial state (first round)
   *
   * @return true on success (i.e. valid matches have been created), false or
   *         undefined otherwise
   */
  TournamentModel.prototype.initialMatches = function () {
    // create matches here

    if (this.teams.length < 3) {
      return false
    }

    this.matches.push(new MatchModel([0, 1], 1, 0))
    this.votes.bye.push(2)

    return true
  }

  /**
   * create matches from an idle state (subsequent rounds)
   *
   * @return true on success (i.e. valid matches have been created), false or
   *         undefined otherwise
   */
  TournamentModel.prototype.idleMatches = function () {
    // create matches here

    this.matches.push(new MatchModel([1, 2], 1, 0))
    this.votes.bye.push(0)

    return true
  }

  /**
   * Properly add a ByeResult to this.votes, this.ranking and this.history.
   *
   * @param byeResultOrTeamID
   *          Either a proper byeResult, or the team ID
   * @param matchID
   * @param round
   */
  TournamentModel.prototype.addBye = function (byeResultOrTeamID, matchID, //
    round) {
    var teamID, byeResult

    if (arguments.length === 1 && (Type instanceof ByeResult)) {
      byeResult = byeResultOrTeamID
    } else if (arguments.length === 3 && Type.isNumber(byeResultOrTeamID) &&
      Type.isNumber(matchID) && Type.isNumber(round)) {
      teamID = byeResultOrTeamID
      byeResult = new ByeResult(teamID, [Options.byepointswon,
        Options.byepointslost
      ], matchID, round)
    } else {
      console.error(arguments)
      throw new Error("addBye isn't provided the correct arguments")
    }

    this.votes.bye.push(teamID)
    this.ranking.bye(teamID)
    this.history.push(byeResult)

    return byeResult
  }

  /**
   * correct a previous result by replacing it with a new result and updating
   * all of the necessary data.
   *
   * @param result
   *          the external result, as read from the getHistory() list
   * @param newScore
   *          the new score. Right now, only scores can be changed. This might
   *          change with the support for more complicated tournament systems
   *
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.correct = function (result, newScore) {
    var index, correction, newResult, baseResult

    baseResult = result
    while (baseResult.result !== undefined) {
      if (baseResult.hasReversedTeams) {
        newScore.reverse()
      }
      baseResult = baseResult.result
    }

    index = this.history.indexOf(baseResult)
    if (index === -1) {
      this.emit('error', 'correct(): result does not exist in history')
      return false
    }

    newResult = new MatchResult(baseResult, newScore)
    if (!this.validateMatchResult(newResult)) {
      this.emit('error', 'correction has invalid score')
      return false
    }

    correction = new CorrectionModel(baseResult, newResult)

    if (!this.validateCorrection(correction)) {
      this.emit('error', 'correction is invalid, although the score is fine')
      return false
    }

    this.ranking.correct(correction)
    this.corrections.push(correction)
    this.history.set(index, correction.after)

    this.postprocessCorrection(correction)

    return true
  }

  /**
   * prepares a serializable data object, which can later be used for restoring
   * the current state using the restore() function
   *
   * @return a serializable data object, which can be used for restoring
   */
  TournamentModel.prototype.save = function () {
    var data = TournamentModel.superclass.save.call(this)

    data.sys = this.SYSTEM
    data.id = this.id
    data.name = this.name.get()
    data.state = this.state.get()
    data.teams = this.teams.asArray()
    data.matches = this.matches.save()
    data.history = this.history.save()
    data.corrections = this.corrections.save()
    data.ranking = this.ranking.save()
    data.votes = {}
    data.totalvotes = {}
    this.VOTES.forEach(function (votetype) {
      data.votes[votetype] = this.votes[votetype].save()
      data.totalvotes[votetype] = this.totalvotes[votetype].save()
    }, this)

    return data
  }

  /**
   * restore a previously saved state from a serializable data object
   *
   * @param data
   *          a data object, that was previously written by save()
   * @return true on success, false otherwise
   */
  TournamentModel.prototype.restore = function (data) {
    if (this.SYSTEM !== data.sys) {
      this.emit('error', 'TournamentModel.restore() error: System mismatch')
      return false
    }

    if (!TournamentModel.superclass.restore.call(this, data)) {
      return false
    }

    this.id = data.id

    this.name.set(data.name || this.SYSTEM)

    if (!this.state.forceState(data.state)) {
      this.emit('error', //
        'TournamentModel.restore(): invalid tournament state')
      return false
    }

    if (!this.teams.restore(data.teams)) {
      this.emit('error', //
        'TournamentModel.restore(): cannot restore teams')
      return false
    }

    if (!this.matches.restore(data.matches, MatchModel)) {
      this.emit('error', 'TournamentModel.restore(): cannot restore matches')
      return false
    }

    if (!this.history.restore(data.history, MatchResult)) {
      this.emit('error', 'TournamentModel.restore(): cannot restore history')
      return false
    }

    if (!this.corrections.restore(data.corrections, CorrectionModel)) {
      this.emit('error',
        'TournamentModel.restore(): cannot restore corrections')
      return false
    }

    if (!this.ranking.restore(data.ranking)) {
      this.emit('error', 'TournamentModel.restore(): cannot restore ranking')
      return false
    }

    if (!this.VOTES.every(function (votetype) {
      this.votes[votetype].clear()
      if (data.votes[votetype]) {
        this.votes[votetype].restore(data.votes[votetype])
      }
      return true
    }, this)) {
      this.emit('error', 'TournamentModel.restore(): cannot restore votes')
      return false
    }

    if (!this.VOTES.every(function (votetype) {
      this.totalvotes[votetype].clear()
      if (data.totalvotes[votetype]) {
        this.totalvotes[votetype].restore(data.totalvotes[votetype])
      }
      return true
    }, this)) {
      this.emit('error', 'TournamentModel.restore(): cannot restore totalvotes')
      return false
    }

    this.checkIdleState()

    return true
  }

  /**
   * mimic an IndexedModel
   */
  TournamentModel.prototype.getID = IndexedModel.prototype.getID
  TournamentModel.prototype.setID = IndexedModel.prototype.setID

  // TODO use constructor references (MatchModel.SAVEFORMAT) instead of
  // "Object"
  TournamentModel.prototype.SAVEFORMAT = Object
    .create(TournamentModel.superclass.SAVEFORMAT)
  TournamentModel.prototype.SAVEFORMAT.sys = String
  TournamentModel.prototype.SAVEFORMAT.id = Number
  TournamentModel.prototype.SAVEFORMAT.name = String
  TournamentModel.prototype.SAVEFORMAT.state = String
  TournamentModel.prototype.SAVEFORMAT.teams = [Number]
  TournamentModel.prototype.SAVEFORMAT.matches = [Object]
  TournamentModel.prototype.SAVEFORMAT.history = [Object]
  TournamentModel.prototype.SAVEFORMAT.corrections = [Object]
  TournamentModel.prototype.SAVEFORMAT.ranking = Object
  TournamentModel.prototype.SAVEFORMAT.votes = Object
  TournamentModel.prototype.SAVEFORMAT.totalvotes = Object

  return TournamentModel
})
