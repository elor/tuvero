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
define(['lib/extend', './model', './rankingcomponentindex'], function(extend,
    Model, RankingComponentIndex) {
  /**
   * Constructor
   *
   * @param components
   *          an array with sorting strings
   * @param size
   *          the number of teams/players
   * @param dependencies
   *          an object of additional dependencies, e.g. a games matrix for
   */
  function RankingModel(components, size, dependencies) {
    RankingModel.superconstructor.call(this);

    this.size = size;
    // TODO dependency system with the following components:
    //
    // TODO fullmatrix this.games (i beat k -> [i][k] += 1)
    // TODO vector this.numgames (+1 for every finished game)
    // TODO vector this.lostpoints (+1 for every opponent's point)
    // TODO vector this.saldopoints (calculated from ownpoints-lostpoints)
    // TODO array this.corrections (entry of every correction, for bookkeeping)
    // TODO vector? this.cointosses (method to account for coin tosses)
    //
    // TODO auto-update the following references:
    // TODO array this.buchholz (abs(this.games) * this.wins)
    // TODO array this.finebuchholz (abs(this.games) * this.buchholz)
    // TODO array this.ranks (for every player id, the respective rank)
    // TODO array this.ranking (player ids, in the order of ranking. Pre-sorted)

    this.componentchain = RankingComponentIndex.createComponentChain(this,
        components);
    if (!this.componentchain) {
      // FIXME can we NOT use THROW?
      throw new Error('Cannot create RankingComponent chain.'
          + 'There should be an error message explaining what is missing.');
    }
  }
  extend(RankingModel, Model);

  /**
   * the different events
   */
  RankingModel.prototype.EVENTS = {
    'insert': true, // insert a new game
    'correct': true, // correct a game
    'recalc': true, // force a recalculation
    'update': true, // there has been an update
    'reset': true, // everything has to be reset
    'resize': true // add players to the end, or truncate them
  };

  // TODO finishGame(), correctGame(), get(), emit('update'), emit('reset'),
  // reset()

  return RankingModel;
});
