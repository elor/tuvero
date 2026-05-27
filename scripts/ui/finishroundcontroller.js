import Controller from '../core/controller.js'
import View from '../core/view.js'
import State from './state.js'
import Options from 'options'
import Random from '../core/random.js'
const rng = new Random()

/**
 * Constructor
 */
class FinishRoundController extends Controller {
  constructor ($button, random) {
    super(new View(undefined, $button))
    this.random = random
    this.view.$view.click(this.finishRound.bind(this))
  }

  /**
   *
   */
  finishRound () {
    State.tournaments.map(function (tournament) {
      let matches, finished
      matches = tournament.getMatches()
      do {
        finished = true
        matches.map(function (match) {
          if (match.isRunningMatch()) {
            match.finish(this.getScore(match.length))
            finished = false
          }
        }, this)
      } while (!finished)
    }, this)
  }

  getScore (numTeams) {
    let score, min, max
    min = Options.minpoints
    max = Options.maxpoints
    score = []
    while (score.length < numTeams) {
      score.push(this.random ? rng.nextInt(min, max) : min)
    }
    if (this.random) {
      score[rng.nextInt(score.length)] = max
    } else {
      score[0] = max
    }
    return score
  }
}

export default FinishRoundController
