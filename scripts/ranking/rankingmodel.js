import Model from '../core/model.js'
import RankingComponentIndex from './rankingcomponentindex.js'
import Type from '../core/type.js'
import RankingDataListenerIndex from './rankingdatalistenerindex.js'
/**
 * create a list of IDs for reference
 *
 * @return an array of ids, where the index matches the value
 */
function getIDs () {
  const ids = []
  while (ids.length < this.length) {
    ids.push(ids.length)
  }
  return ids
}

/**
 * order team ids by their ranking
 *
 * @param ids
 *          an array of ids
 * @return an array of ids, sorted by rank
 */
function getRankingOrder (ids) {
  const order = ids.slice(0)
  const chain = this.componentchain
  order.sort(function (a, b) {
    return chain.compare(a, b) || a - b
  }, this)
  return order
}

/**
 * read the ranks of each team from their array position in the ordered array
 * and their relation to the previous team.
 *
 * @param ids
 *          the return value of getRankingOrder().
 *
 * @return an array of ranks, as retrieved from the ids
 */
function getRanks (ids) {
  const ranks = new Array(this.length)
  ids.forEach(function (teamid, index) {
    if (index === 0) {
      ranks[teamid] = 0
    } else {
      if (this.componentchain.compare(ids[index - 1], teamid) < 0) {
        ranks[teamid] = index
      } else {
        ranks[teamid] = ranks[ids[index - 1]]
      }
    }
  }, this)
  return ranks
}

/**
 * Update the ranking from its data fields. See get() for a description of the
 * ranking object.
 *
 * Private RankingModel function.
 *
 * @param norecalc
 *          true if the data listeners shouldn't be recalculated, undefined or
 *          false otherwise.
 */
function updateRanking (norecalc) {
  let components
  if (!norecalc) {
    this.emit('recalc')
  }
  const newRanking = {
    components: this.componentnames
  }
  newRanking.ids = getIDs.call(this)
  newRanking.displayOrder = getRankingOrder.call(this, newRanking.ids)
  newRanking.ranks = getRanks.call(this, newRanking.displayOrder)
  if (this.componentchain !== undefined) {
    components = this.componentchain.getValues()
    components.forEach(function (component, index) {
      let name
      if (component !== undefined) {
        name = this.componentnames[index]
        newRanking[name] = component
      }
    }, this)
  }
  this.ranking = newRanking
}

/**
 * Constructor
 *
 * @param components
 *          an array with sorting strings
 * @param size
 *          the number of teams/players
 * @param externalDependencies
 *          Optional. an array of additional dependencies, e.g. a games matrix
 *          for "have they played"-type questions
 */
class RankingModel extends Model {
  constructor (components, size, externalDependencies) {
    super()
    components = components || []
    size = size || 0
    this.ranking = undefined
    this.componentnames = []
    this.componentchain = undefined
    this.length = 0
    this.extDeps = []
    this.dataListeners = {}
    this.init(components, size, externalDependencies)
  }

  /**
   * initializes the ranking object
   *
   * @param components
   * @param size
   * @param extDependencies
   * @return true on success, false otherwise
   */
  init (components, size, extDependencies) {
    let dependencies

    // abort if the ranking object has not been reset
    if (this.componentchain || this.componentnames.length !== 0 || Object.keys(this.dataListeners).length !== 0) {
      return false
    }
    this.componentnames = components.slice(0)
    this.componentchain = RankingComponentIndex.createComponentChain(this, components)
    if (this.componentchain) {
      dependencies = this.componentchain.dependencies
    } else {
      dependencies = []
    }
    if (extDependencies) {
      this.extDeps.push.apply(this.extDeps, extDependencies)
      dependencies.push.apply(dependencies, this.extDeps)
    }
    const dataListenerArray = RankingDataListenerIndex.registerDataListeners(this, dependencies)
    if (dataListenerArray && components && components.length > 0) {
      dataListenerArray.forEach(function (dataListener, index) {
        this.dataListeners[dependencies[index]] = dataListener
      }, this)
      this.resize(size)
    }
    return true
  }

  /**
   * restore everything to an initial state, as provided by an empty
   * RankingModel construction
   */
  reset () {
    Object.keys(this.dataListeners).forEach(function (key) {
      this.dataListeners[key].destroy()
    }, this)

    this.ranking = undefined
    this.componentnames = []
    this.componentchain = undefined
    this.length = 0
    this.extDeps = []
    this.dataListeners = {}
    this.init([], 0)

    this.emit('reset')

    // trigger an 'update' event
    this.invalidate()
  }

  /**
   * process a game result
   *
   * @param result
   *          a GameResult instance
   */
  result (result) {
    // TODO result verification?
    this.emit('result', result)
    this.invalidate()
  }

  recalculate (matchResults, votes) {
    this.resize(this.length)
    Object.keys(this.dataListeners).forEach(function (key) {
      this.dataListeners[key].zero()
    }, this)
    if (votes.up && this.upvotes) {
      votes.up.forEach(function (teamID) {
        this.upvotes.add(teamID, 1)
      }, this)
    }
    if (votes.down && this.downvotes) {
      votes.down.forEach(function (teamID) {
        this.downvotes.add(teamID, 1)
      }, this)
    }
    matchResults.forEach(function (result) {
      if (result.isBye()) {
        this.bye(result.getTeamID(0), result.group)
      } else {
        this.result(result)
      }
    }, this)
  }

  /**
   * process a bye
   *
   * @param teams
   *          an array of affected teams
   */
  bye (teams, round) {
    if (Type.isNumber(teams)) {
      teams = [teams]
    }
    this.emit('bye', {
      teams,
      round
    })
    this.invalidate()
  }

  correct (correction) {
    this.emit('correct', correction)
    this.invalidate()
  }

  /**
   * force a full recalculation of the ranking from the data fields. This will
   * not replay the tournament from history, just update dependent data fields.
   */
  invalidate () {
    this.ranking = undefined
    this.emit('update')
  }

  /**
   * Returns the current ranking as a ranking object. Recalculates as necessary.
   * This function can take up to several seconds for huge tournaments (> 2000)
   *
   * The returned ranking object contains the following fields:
   *
   * ranks: an array of ranks. Equal ranks are allowed
   *
   * displayOrder: an array of player/team indices, which is pre-sorted by rank.
   * The index in this array does reflect the rank ONLY if each rank is unique.
   *
   * components: an ordered array of RankingComponent names.
   *
   * For each component with not-undefined values, there's an equally-named
   * field, which contains the values.
   *
   * @return the current ranking, as a ranking object
   */
  get () {
    if (this.ranking === undefined) {
      updateRanking.call(this)
    }
    return this.ranking
  }

  getNoRecalc () {
    updateRanking.call(this, true)
    return this.ranking
  }

  /**
   * Resizes the ranking data structures
   *
   * WARNING: This operation can delete data when reducing the size. Be careful
   *
   * @param size
   *          the new size
   * @return true on success, false otherwise
   */
  resize (size) {
    if (size === this.length) {
      return true
    }
    if (size >= 0) {
      this.length = size
      this.emit('resize')
      this.invalidate()
      return true
    }
    console.error('RankingModel.resize: invalid size: ' + size)
    return false
  }

  /**
   * stores the necessary scores and points in a data object for serialization.
   * Only primary data containers are stored, as the other ones can be
   * recalculated.
   *
   * @return a serializable data object
   */
  save () {
    const data = super.save()
    data.len = this.length
    data.comps = this.componentnames.slice(0)
    data.edep = this.extDeps.slice(0)
    data.vals = {}

    // only store primary dataListeners. Abort on error
    if (!Object.keys(this.dataListeners).every(function (name) {
      const listener = this.dataListeners[name]
      if (listener.isPrimary(listener)) {
        if (this[name] && Type.isFunction(this[name].save)) {
          data.vals[name] = this[name].save()
        } else {
          console.error('datalistener cannot be saved: ' + name)
          return false
        }
      }
      return true
    }, this)) {
      return undefined
    }
    return data
  }

  /**
   * restores the ranking from a previously saved data object
   *
   * @param data
   *          a deserialized data object
   * @return true on success, false otherwise
   */
  restore (data) {
    if (!super.restore(data)) {
      return false
    }
    this.reset()
    if (!this.init(data.comps, data.len, data.edep)) {
      this.reset()
      return false
    }
    if (!Object.keys(data.vals).every(function (name) {
      if (this[name] && this[name].restore) {
        if (this[name].restore(data.vals[name])) {
          return true
        }
      }
      console.error('RankingModel.restore(): cannot restore listener ' + name)
      return false
    }, this)) {
      this.reset()
      return false
    }
    this.invalidate()
    return true
  }
}

/**
 * the different events
 */
RankingModel.prototype.EVENTS = {
  result: true,
  // insert a new game result
  bye: true,
  // insert a new bye
  correct: true,
  // correct a game
  recalc: true,
  // force a recalculation
  update: true,
  // there has been an update
  reset: true,
  // everything has to be reset
  resize: true
  // the size of the ranking has been changed
}

RankingModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT)
RankingModel.prototype.SAVEFORMAT.len = Number
RankingModel.prototype.SAVEFORMAT.comps = [String]
RankingModel.prototype.SAVEFORMAT.edep = [String]
RankingModel.prototype.SAVEFORMAT.vals = Object
export default RankingModel
