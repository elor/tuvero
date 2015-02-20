/**
 * RankingComponentIndex: An object, which indexes the constructors of all
 * ranking components.
 *
 * @return RankingComponentIndex
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['./idrankingcomponent', './pointsrankingcomponent',
    './saldorankingcomponent', './winsrankingcomponent'], function() {
  var RankingComponentIndex, index, Component;

  // build the index from the XXXRankingComponent.NAME fields
  RankingComponentIndex = {};
  for (index = 0; index < arguments.length; index += 1) {
    Component = arguments[index];
    RankingComponentIndex[Component.NAME.toLowerCase()] = Component;
  }

  /**
   * from a list of components, create a chain of RankingComponent instances to
   * be used for sorting and comparison
   *
   * @param ranking
   *          a RankingModel instance
   * @param components
   *          an array of strings
   * @return the topmost element of the component chain, which corresponds to
   *         the first element in the components array
   */
  RankingComponentIndex.createComponentChain = function(ranking, components) {
    var chainfront, retval;

    chainfront = new RankingComponentIndex['id'](ranking);

    if (!components.every(function(component) {
      component = component.toLowerCase();
      var constructor = RankingComponentIndex[component];
      if (constructor === undefined) {
        console.error('RankingComponentIndex.createComponentChain error: '
            + 'unknown component name: ' + component);
        return false;
      }

      chainfront = new constructor(ranking, chainfront);

      return true;
    })) {
      // some component could not be created
      return undefined;
    }

    return chainfront;
  };

  return RankingComponentIndex;
});
