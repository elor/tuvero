/**
 * RankingComponent: The base class for every ranking component. Chaining them
 * (singly-linked list using this.nextcomponent) allows for any ranking
 * priorities, including nonsensical ones.
 *
 * Every RankingComponent has access to the ranking object, and references the
 * next component in the chain. The
 *
 * @return RankingComponent
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/**
 * Constructor
 *
 * @param ranking
 *          a Ranking instance for value referencing
 * @param nextcomponent
 *          the next RankingComponent in the chain
 */
class RankingComponent {
  constructor (ranking, nextcomponent) {
    this.ranking = ranking
    if (nextcomponent) {
      this.nextcomponent = nextcomponent
      this.dependencies = this.nextcomponent.dependencies
    } else {
      this.nextcomponent = RankingComponent.DUMMYCOMPONENT
      this.dependencies = []
    }

    // add dependencies to the dependencies list
    // Use hasOwnProperty because static fields are inherited in ES6 classes,
    // so checking === undefined would always find the base class's DEPENDENCIES=[].
    // Also treat explicit DEPENDENCIES=undefined as "use NAME as implicit dependency".
    const deps = this.constructor.hasOwnProperty('DEPENDENCIES') ? this.constructor.DEPENDENCIES : undefined
    if (deps === undefined) {
      this.dependencies.push(this.constructor.NAME)
    } else {
      deps.forEach(function (DEP) {
        this.dependencies.push(DEP)
      }, this)
    }
  }

  /**
   * Recursively output all values to a two-dimensional array. Ignore fully
   * undefined components (e.g. comparison-based components)
   *
   * @param outArray
   *          Optional. the output array. Will be created if undefined
   * @return outArray, an array of value arrays for every chain level. If a
   *          level does not have any values, its entry will be set to undefined
   */
  getValues (outArray) {
    let values, index
    if (outArray === undefined) {
      outArray = []
    }
    values = []
    for (index = 0; index < this.ranking.length; index += 1) {
      values[index] = this.value(index)
    }
    if (values.every(function (value) {
      return value === undefined
    })) {
      values = undefined
    }
    outArray.push(values)
    return this.nextcomponent.getValues(outArray)
  }

  /**
   * if the values for comparison are independent (points, as opposed to direct
   * comparison or coin tosses), retrieve and return the value. This can be the
   * number of wins, small points, saldo points, or whatever. It just has to be
   * bound to a single player/team
   *
   * If possible, please overload this function instead of overloading compare.
   *
   * @param i
   *          a team index
   * @return a point value (or whatever) for this team
   */
  value (i) {
    return undefined
  }

  /**
   * compare function for sort(). Is chained to the next component. Think before
   * overloading.
   *
   * The idea is to have an implicit sort order by chaining the sort functions.
   * Wins > Buchholz > Saldo > Whatever. That's reflected by a component chain.
   *
   * @param i
   *          index of a team
   * @param k
   *          index of another team
   * @return {Number} see Array.prototype.sort() for an explanation of compare
   *         functions
   */
  compare (i, k) {
    return this.value(k) - this.value(i) || this.nextcomponent.compare(i, k)
  }

  /**
   * the unique name for a ranking component, e.g. 'wins', 'saldo', 'coin'. To
   * be declared by every child class.
   *
   * This also is an implicit dependency, unless DEPENDENCIES is defined. If
   * there are no dependencies, set DEPENDENCIES to an empty array.
   */
  static NAME = 'undefined'

  /**
   * a list of dependencies, i.e. names, as in ranking.name.
   *
   * If this is undefined, the NAME is an implicit dependency.
   */
  static DEPENDENCIES = []

  /**
   * DUMMYCOMPONENT is the default "nextcomponent", so the sort function does
   * not fail. It makes sure that teams with equal points are assigned the
   * same place
   */
  static DUMMYCOMPONENT = {
    /**
     * @param i
     *          a team index
     * @param k
     *          another team index
     * @return 0. After this step, every team is equal, so multiple first
     *         places can happen.
     */
    compare: function (i, k) {
      return 0
    },
    /**
     * do nothing, just return the output array
     */
    getValues: function (outArray) {
      return outArray
    }
  }
}

export default RankingComponent
