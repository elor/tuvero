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
   */
  function RankingModel(components, size) {
    RankingModel.superconstructor.call(this);

    this.size = size;
    // TODO dependency system with the following components:
    //
    // TODO fullmatrix this.games (i beat k -> [i][k] += 1)
    // TODO vector this.wins (+1 for every win, can be calc'd from this.games)
    // TODO vector this.numgames (+1 for every finished game)
    // TODO vector this.ownpoints (+1 for every own point)
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

  // TODO finishGame(), correctGame(), get(), emit('update'), emit('reset'),
  // reset()

  return RankingModel;
});
