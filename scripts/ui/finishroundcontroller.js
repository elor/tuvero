/**
 * FinishRoundController
 *
 * @return FinishRoundController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import View from '../core/view.js';
import State from './state.js';
import Options from 'options';
import Random from '../core/random.js';
const rng = new Random();

/**
 * Constructor
 */
function FinishRoundController($button, random) {
  FinishRoundController.superconstructor.call(this, new View(undefined, $button));
  this.random = random;
  this.view.$view.click(this.finishRound.bind(this));
}
extend(FinishRoundController, Controller);

/**
 *
 */
FinishRoundController.prototype.finishRound = function () {
  State.tournaments.map(function (tournament) {
    let matches, finished;
    matches = tournament.getMatches();
    do {
      finished = true;
      matches.map(function (match) {
        if (match.isRunningMatch()) {
          match.finish(this.getScore(match.length));
          finished = false;
        }
      }, this);
    } while (!finished);
  }, this);
};
FinishRoundController.prototype.getScore = function (numTeams) {
  let score, min, max;
  min = Options.minpoints;
  max = Options.maxpoints;
  score = [];
  while (score.length < numTeams) {
    score.push(this.random ? rng.nextInt(min, max) : min);
  }
  if (this.random) {
    score[rng.nextInt(score.length)] = max;
  } else {
    score[0] = max;
  }
  return score;
};
export default FinishRoundController;