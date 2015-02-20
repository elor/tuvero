/**
 * RankingComponent
 *
 * @return RankingComponent
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  /**
   * Constructor
   *
   * @param ranking
   *          a Ranking instance for value referencing
   * @param nextcomponent
   *          the next RankingComponent in the chain
   */
  function RankingComponent(ranking, nextcomponent) {
    this.ranking = ranking;
    this.nextcomponent = nextcomponent;
    this.dependencies = {};
  }

  /**
   * the unique name for a ranking component, e.g. 'wins', 'saldo', 'coin'. To
   * be declared by every child class.
   */
  RankingComponent.NAME = 'undefined';

  /**
   * if the values for comparison are independent (points, as opposed to direct
   * comparison or coin tosses), retrieve and return the value. This can be the
   * number of wins, small points, saldo points, or whatever. It just has to be
   * bound to a single player/team
   *
   * If possible, please overload this function instead of overloading compare.
   *
   * @param i
   *          a player index
   * @return a point value (or whatever) for this player
   */
  RankingComponent.prototype.value = function(i) {
    return i;
  };

  /**
   * compare function for sort(). Is chained to the next component. Think before
   * overloading.
   *
   * The idea is to have an implicit sort order by chaining the sort functions.
   * Wins > Buchholz > Saldo > Whatever. That's reflected by a component chain.
   *
   * @param i
   *          index of a player
   * @param k
   *          index of another player
   * @return {Number} see Array.prototype.sort() for an explanation of compare
   *          functions
   */
  RankingComponent.prototype.compare = function(i, k) {
    return this.value(k) - this.value(i) || this.nextcomponent.compare(i, k);
  };

  return RankingComponent;
});
