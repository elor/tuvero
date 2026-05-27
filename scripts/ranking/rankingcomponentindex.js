/**
 * RankingComponentIndex: An object, which indexes the constructors of all
 * ranking components.
 *
 * @return RankingComponentIndex
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import RankingIDComponent from './rankingidcomponent.js'
import RankingPointsComponent from './rankingpointscomponent.js'
import RankingLostPointsComponent from './rankinglostpointscomponent.js'
import RankingSaldoComponent from './rankingsaldocomponent.js'
import RankingBuchholzComponent from './rankingbuchholzcomponent.js'
import RankingFineBuchholzComponent from './rankingfinebuchholzcomponent.js'
import RankingSonnebornComponent from './rankingsonneborncomponent.js'
import RankingWinsComponent from './rankingwinscomponent.js'
import RankingHeadToHeadComponent from './rankingheadtoheadcomponent.js'
import RankingTacComponent from './rankingtaccomponent.js'
import RankingFormulexComponent from './rankingformulexcomponent.js'
import RankingVotesComponent from './rankingvotescomponent.js'
import RankingNumGamesComponent from './rankingnumgamescomponent.js'
import RankingKOComponent from './rankingkocomponent.js'
import RankingThreePointComponent from './rankingthreepointcomponent.js'
import RankingTwoPointComponent from './rankingtwopointcomponent.js'
import RankingPlacementComponent from './rankingplacementcomponent.js'
import RankingPouleIDComponent from './rankingpouleidcomponent.js'
import RankingPouleRankComponent from './rankingpoulerankcomponent.js'

let index, Component

const allComponentList = [
  RankingIDComponent,
  RankingPointsComponent,
  RankingLostPointsComponent,
  RankingSaldoComponent,
  RankingBuchholzComponent,
  RankingFineBuchholzComponent,
  RankingSonnebornComponent,
  RankingWinsComponent,
  RankingHeadToHeadComponent,
  RankingTacComponent,
  RankingFormulexComponent,
  RankingVotesComponent,
  RankingNumGamesComponent,
  RankingKOComponent,
  RankingThreePointComponent,
  RankingTwoPointComponent,
  RankingPlacementComponent,
  RankingPouleIDComponent,
  RankingPouleRankComponent
]

// build the index from the XXXRankingComponent.NAME fields
const RankingComponentIndex = {}
const allComponents = {}
for (index = 0; index < allComponentList.length; index += 1) {
  Component = allComponentList[index]
  allComponents[Component.NAME.toLowerCase()] = Component
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
  let chainfront
  chainfront = undefined

  // copy the array and revert it: we'll construct the chain from its end
  components = components.slice(0)
  components.reverse()

  // iterate over the components and chain them in order.
  // Abort if a component is not defined.
  if (!components.every(function (component) {
    component = component.toLowerCase()
    const constructor = allComponents[component]
    if (constructor === undefined) {
      console.error('RankingComponentIndex.createComponentChain error: ' + 'undefined component name: ' + component)
      return false
    }
    chainfront = new constructor(ranking, chainfront)
    return true
  })) {
    // some component could not be created. Abort.
    return undefined
  }
  return chainfront
}
RankingComponentIndex.components = Object.keys(allComponents).sort()
export default RankingComponentIndex
