/**
 * RankingModel: A general ranking model, which can bind different
 * RankingComponents in order and sort using their compare function
 *
 * TODO cached update
 *
 * @return RankingModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './model', './rankingcomponentindex',
    './rankingdatalistenerindex'], function(extend, Model,
    RankingComponentIndex, RankingDataListenerIndex) {
  /**
   * Constructor
   *
   * @param components
   *          an array with sorting strings
   * @param size
   *          the number of teams/players
   * @param dependencies
   *          Optional. an array of additional dependencies, e.g. a games matrix
   *          for "have they played"-type questions
   */
  function RankingModel(components, size, dependencies) {
    RankingModel.superconstructor.call(this);

    if (!components || components.length === 0) {
      // FIXME CAN we NOT use THROW?
      throw new Error('RankingModel: no components provided');
    }

    if (size === undefined) {
      throw new Error('RankingModel: no size provided');
    }

    this.length = size;
    this.ranking = undefined;

    this.componentnames = components.slice(0);
    this.componentchain = RankingComponentIndex.createComponentChain(this,
        components);

    if (!this.componentchain) {
      // FIXME CAN we NOT use THROW?
      throw new Error('Cannot create RankingComponent chain.'
          + 'There should be an error message explaining what is missing.');
    }

    this.dependencies = this.componentchain.dependencies;
    if (dependencies) {
      dependencies.forEach(function(dependency) {
        this.dependencies.push(dependency);
      }, this);
    }
    this.dataListeners = RankingDataListenerIndex.registerDataListeners(this,
        this.dependencies);
  }
  extend(RankingModel, Model);

  /**
   * the different events
   */
  RankingModel.prototype.EVENTS = {
    'result': true, // insert a new game result
    'correct': true, // correct a game
    'recalc': true, // force a recalculation
    'update': true, // there has been an update
    'reset': true, // everything has to be reset
    'resize': true
  // the size of the ranking has been changed
  };

  /**
   * reset the ranking without resizing anything or removing
   */
  RankingModel.prototype.reset = function() {
    this.emit('reset');
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
    } else {
      console.error('RankingModel.resize: invalid size: ' + size);
      return false;
    }
  };

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
    var ranking, components;

    this.emit('recalc');

    ranking = {
      components: this.componentnames
    };

    ranking.displayOrder = getRankingOrder.call(this);
    ranking.ranks = getRanks.call(this, ranking.displayOrder);

    components = this.componentchain.getValues();
    components.forEach(function(component, index) {
      var name;
      if (component !== undefined) {
        name = this.componentnames[index];
        ranking[name] = component;
      }
    }, this);

    this.ranking = ranking;
  }

  return RankingModel;
});
