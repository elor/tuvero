/**
 * RankingComponent: The base class for every ranking component. Chaining them
 * (singly-linked list using this.nextcomponent) allows for any ranking
 * priorities, including nonsensical ones.
 *
 * Every RankingComponent has access to the ranking object, and references the
 * next component in the chain. The
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

    if (nextcomponent) {
      this.nextcomponent = nextcomponent;
      this.dependencies = this.nextcomponent.dependencies;
    } else {
      this.nextcomponent = RankingComponent.DUMMYCOMPONENT;
      this.dependencies = [];
    }

    // add dependencies to the dependencies list
    if (this.constructor.DEPENDENCIES === undefined) {
      this.dependencies.push(this.constructor.NAME);
    } else {
      this.constructor.DEPENDENCIES.forEach(function(DEP) {
        this.dependencies.push(DEP);
      }, this);
    }
  }

  /**
   * the unique name for a ranking component, e.g. 'wins', 'saldo', 'coin'. To
   * be declared by every child class.
   *
   * This also is an implicit dependency, unless DEPENDENCIES is defined. If
   * there are no dependencies, set DEPENDENCIES to an empty array.
   */
  RankingComponent.NAME = 'undefined';

  /**
   * a list of dependencies, i.e. names, as in ranking.name.
   *
   * If this is undefined, the NAME is an implicit dependency.
   */
  RankingComponent.DEPENDENCIES = [];

  /**
   * DUMMYCOMPONENT is the default "nextcomponent", so the sort function does
   * not fail. It makes sure that players with equal points are assigned the
   * same place
   */
  RankingComponent.DUMMYCOMPONENT = {
    /**
     * @param i
     *          a player index
     * @param k
     *          another player index
     * @return 0. After this step, every player is equal, so multiple first
     *         places can happen.
     */
    compare: function(i, k) {
      return 0;
    }
  };

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
    return undefined;
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
   *         functions
   */
  RankingComponent.prototype.compare = function(i, k) {
    return this.value(k) - this.value(i) || this.nextcomponent.compare(i, k);
  };

  return RankingComponent;
});
