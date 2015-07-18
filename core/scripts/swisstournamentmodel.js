/**
 * SwissTournamentModel
 *
 * @return SwissTournamentModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './roundtournamentmodel'], function(extend,
    RoundTournamentModel) {
  /**
   * Constructor
   *
   * @param rankingorder
   */
  function SwissTournamentModel(rankingorder) {
    SwissTournamentModel.superconstructor.call(this, rankingorder);

    this.setProperty('initialorder', 'random');
    this.setProperty('idleorder', 'order');
  }
  extend(SwissTournamentModel, RoundTournamentModel);

  SwissTournamentModel.prototype.SYSTEM = 'swiss';

  SwissTournamentModel.prototype.ORDERS = ['order', 'halves', 'wingroups',
      'random'];

  /**
   * creates new matches depending on the current ranking within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.idleMatches = function() {
  };

  /**
   * creates new matches depending on the initial within the tournament
   *
   * @return true on success, false otherwise
   */
  SwissTournamentModel.prototype.initialMatches = function() {
  };

  return SwissTournamentModel;
});
