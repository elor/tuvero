/**
 * RankingComponentIndex: An object, which indexes the constructors of all
 * ranking components.
 *
 * @return RankingComponentIndex
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['ranking/rankingidcomponent', 'ranking/rankingpointscomponent',
  'ranking/rankinglostpointscomponent', 'ranking/rankingsaldocomponent',
  'ranking/rankingbuchholzcomponent', 'ranking/rankingfinebuchholzcomponent',
  'ranking/rankingsonneborncomponent', 'ranking/rankingwinscomponent',
  'ranking/rankingheadtoheadcomponent', 'ranking/rankingtaccomponent',
  'ranking/rankingvotescomponent', 'ranking/rankingnumgamescomponent',
  'ranking/rankingkocomponent', 'ranking/rankingthreepointcomponent'],
  function () {
    var RankingComponentIndex, index, Component, allComponents;

    // build the index from the XXXRankingComponent.NAME fields
    RankingComponentIndex = {};
    allComponents = {};
    for (index = 0; index < arguments.length; index += 1) {
      Component = arguments[index];
      allComponents[Component.NAME.toLowerCase()] = Component;
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
    RankingComponentIndex.createComponentChain = function (ranking, components) {
      var chainfront;

      chainfront = undefined;

      // copy the array and revert it: we'll construct the chain from its end
      components = components.slice(0);
      components.reverse();

      // iterate over the components and chain them in order.
      // Abort if a component is not defined.
      if (!components.every(function (component) {
        component = component.toLowerCase();
        var constructor = allComponents[component];
        if (constructor === undefined) {
          console.error('RankingComponentIndex.createComponentChain error: '
            + 'undefined component name: ' + component);
          return false;
        }

        chainfront = new constructor(ranking, chainfront);

        return true;
      })) {
        // some component could not be created. Abort.
        return undefined;
      }

      return chainfront;
    };

    RankingComponentIndex.components = Object.keys(allComponents).sort();

    return RankingComponentIndex;
  });
