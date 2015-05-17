/**
 * RankingModel: A general ranking model, which can bind different
 * RankingComponents in order and sort using their compare function
 *
 * @return RankingModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model', './rankingcomponentindex', './type',
    './rankingdatalistenerindex'], function(extend, Model,
    RankingComponentIndex, Type, RankingDataListenerIndex) {
  /**
   * order team ids by their ranking
   *
   * @return an array of ids, sorted by rank
   */
  function getRankingOrder() {
    var ids, chain;

    ids = [];
    while (ids.length < this.length) {
      ids.push(ids.length);
    }

    chain = this.componentchain;
    ids.sort(function(a, b) {
      return chain.compare(a, b) || (a - b);
    }, this);

    return ids;
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
  function getRanks(ids) {
    var ranks;

    ranks = new Array(this.length);

    ids.forEach(function(teamid, index) {
      if (index === 0) {
        ranks[teamid] = 0;
      } else {
        if (this.componentchain.compare(ids[index - 1], teamid) < 0) {
          ranks[teamid] = index;
        } else {
          ranks[teamid] = ranks[ids[index - 1]];
        }
      }
    }, this);

    return ranks;
  }

  /**
   * Update the ranking from its data fields. See get() for a description of the
   * ranking object.
   *
   * Private RankingModel function.
   */
  function updateRanking() {
    var newRanking, components;

    this.emit('recalc');

    newRanking = {
      components: this.componentnames
    };

    newRanking.displayOrder = getRankingOrder.call(this);
    newRanking.ranks = getRanks.call(this, newRanking.displayOrder);

    if (this.componentchain !== undefined) {
      components = this.componentchain.getValues();
      components.forEach(function(component, index) {
        var name;
        if (component !== undefined) {
          name = this.componentnames[index];
          newRanking[name] = component;
        }
      }, this);
    }

    this.ranking = newRanking;
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
  function RankingModel(components, size, externalDependencies) {
    var dependencies, dataListenerArray;
    RankingModel.superconstructor.call(this);

    components = components || [];
    size = size || 0;

    this.ranking = undefined;
    this.componentnames = components.slice(0) || [];
    this.componentchain = RankingComponentIndex.createComponentChain(this,
        components);
    this.length = 0;
    this.extDeps = [];
    this.dataListeners = {};

    if (this.componentchain) {
      dependencies = this.componentchain.dependencies;
    } else {
      dependencies = [];
    }

    if (externalDependencies) {
      this.extDeps.push.apply(this.extDeps, externalDependencies);
      dependencies.push.apply(dependencies, this.extDeps);
    }

    dataListenerArray = RankingDataListenerIndex.registerDataListeners(this,
        dependencies);
    if (dataListenerArray && dataListenerArray.length > 0) {
      dataListenerArray.forEach(function(dataListener, index) {
        this.dataListeners[dependencies[index]] = dataListener;
      }, this);
      this.resize(size);
    }
  }
  extend(RankingModel, Model);

  /**
   * the different events
   */
  RankingModel.prototype.EVENTS = {
    'result': true, // insert a new game result
    'bye': true, // insert a new bye
    'correct': true, // correct a game
    'recalc': true, // force a recalculation
    'update': true, // there has been an update
    'reset': true, // everything has to be reset
    'resize': true
  // the size of the ranking has been changed
  };

  /**
   * restore everything to an initial state, as provided by an empty
   * RankingModel construction
   */
  RankingModel.prototype.reset = function() {
    Object.keys(this.dataListeners).forEach(function(key) {
      this.dataListeners[key].destroy();
    }, this);

    // just let the constructor reset everything for us.
    RankingModel.call(this);
    this.emit('reset');

    // trigger an 'update' event
    this.invalidate();
  };

  /**
   * process a game result
   *
   * @param result
   *          a GameResult instance
   */
  RankingModel.prototype.result = function(result) {
    // TODO result verification?
    this.emit('result', result);
    this.invalidate();
  };

  /**
   * process a bye
   *
   * @param teams
   *          an array of affected teams
   */
  RankingModel.prototype.bye = function(teams) {
    if (Type.isNumber(teams)) {
      teams = [teams];
    }
    this.emit('bye', teams);
    this.invalidate();
  };

  RankingModel.prototype.correct = function(correction) {
    throw new Error('not implemented yet');
  };

  /**
   * force a full recalculation of the ranking from the data fields. This will
   * not replay the tournament from history, just update dependent data fields.
   */
  RankingModel.prototype.invalidate = function() {
    this.ranking = undefined;
    this.emit('update');
  };

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
  RankingModel.prototype.get = function() {
    if (this.ranking === undefined) {
      updateRanking.call(this);
    }

    return this.ranking;
  };

  /**
   * Resizes the ranking data structures
   *
   * WARNING: This operation can delete data when reducing the size. Be careful
   *
   * @param size
   *          the new size
   * @return true on success, false otherwise
   */
  RankingModel.prototype.resize = function(size) {
    if (size === this.length) {
      return true;
    }
    if (size >= 0) {
      this.length = size;
      this.emit('resize');
      this.invalidate();
      return true;
    }

    console.error('RankingModel.resize: invalid size: ' + size);
    return false;
  };

  /**
   * stores the necessary scores and points in a data object for serialization.
   * Only primary data containers are stored, as the other ones can be
   * recalculated.
   *
   * @return a serializable data object
   */
  RankingModel.prototype.save = function() {
    var data = RankingModel.superclass.save.call(this);

    data.len = this.length;
    data.comps = this.componentnames.slice(0);
    data.edep = this.extDeps.slice(0);
    data.vals = {};

    // only store primary dataListeners. Abort on error
    if (!Object.keys(this.dataListeners).every(function(name) {
      var listener;
      listener = this.dataListeners[name];

      if (listener.isPrimary(listener)) {
        if (this[name] && Type.isFunction(this[name].save)) {
          data.vals[name] = this[name].save();
        } else {
          console.error("datalistener cannot be saved: " + name);
          return false;
        }
      }
      return true;
    }, this)) {
      return undefined;
    }

    return data;
  };

  RankingModel.prototype.SAVEFORMAT = Object
      .create(RankingModel.superclass.SAVEFORMAT);
  RankingModel.prototype.SAVEFORMAT.len = Number;
  RankingModel.prototype.SAVEFORMAT.comps = [String];
  RankingModel.prototype.SAVEFORMAT.edep = [String];
  RankingModel.prototype.SAVEFORMAT.vals = Object;

  return RankingModel;
});
