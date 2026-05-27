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
    State.tournaments.forEach(function (tournament) {
      let finished
      const matches = tournament.getMatches()
      do {
        finished = true
        matches.forEach(function (match) {
          if (match.isRunningMatch()) {
            match.finish(this.getScore(match.length))
            finished = false
          }
        }, this)
      } while (!finished)
    }, this)
  }

  getScore (numTeams) {
        const min = Options.minpoints
    const max = Options.maxpoints
    const score = []
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
