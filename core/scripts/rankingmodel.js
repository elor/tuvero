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

    // TODO dependency system with the following components:
    //
    // TODO fullmatrix this.games (i beat k -> [i][k] += 1)
    // TODO vector this.numgames (+1 for every finished game)
    // TODO array this.corrections (entry of every correction, for bookkeeping)
    //
    // TODO auto-update the following references:
    // TODO array this.buchholz (abs(this.games) * this.wins)
    // TODO array this.finebuchholz (abs(this.games) * this.buchholz)
    // TODO array this.ranks (for every player id, the respective rank)
    // TODO array this.ranking (player ids, in the order of ranking. Pre-sorted)

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
    'result': true, // insert a new game
    'correct': true, // correct a game
    'recalc': true, // force a recalculation
    'update': true, // there has been an update
    'reset': true, // everything has to be reset
    'resize': true // the size of the ranking has been changed
  };

  // TODO finishGame(), correctGame(), get(), emit('update'), emit('reset'),
  // reset()

  return RankingModel;
});
