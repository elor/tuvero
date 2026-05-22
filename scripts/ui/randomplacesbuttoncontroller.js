import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import Toast from './toast.js';
import { random } from 'tuvero';
function RandomPlacesButtonController($button) {
  RandomPlacesButtonController.superconstructor.call(this, new View(undefined, $button));
  this.view.$view.click(this.randomizeplaces.bind(this));
}
extend(RandomPlacesButtonController, Controller);
RandomPlacesButtonController.prototype.randomizeplaces = function () {
  let allmatches, places;
  allmatches = [];
  State.tournaments.forEach(function (tournament) {
    tournament.matches.forEach(function (match) {
      allmatches.push(match);
    });
  });
  places = random.range(1, allmatches.length + 1);
  allmatches.forEach(function (match, index) {
    match.setPlace(places[index].toString());
  });
  return new Toast(allmatches.length + ' Bahnen/Plätze zugelost');
};
export default RandomPlacesButtonController;