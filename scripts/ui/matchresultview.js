import MatchView from './matchview.js'
import MatchResultController from './matchresultcontroller.js'

/**
 * Constructor
 *
 * @param model
 *          a MatchResult instance
 * @param $view
 *          the container element
 * @param teamlist
 *          a ListModel of TeamModel instances
 * @param tournament
 *          a TournamentModel instance
 */
class MatchResultView extends MatchView {
  constructor (model, $view, teamlist, tournament) {
    super(model, $view, teamlist)
    this.$result = this.$view.find('.result')
    this.$scores = this.$result.find('.score')
    this.$correctionform = this.$view.find('.correct')
    if (this.model.isResult()) {
      if (this.model.isBye()) {
        this.$correctionform.remove()
        this.$correctionform = undefined
      } else {
        if (tournament) {
          this.controller = new MatchResultController(this, this.$correctionform, tournament)
        }
      }
    } else {
      this.$result.remove()
      this.$result = undefined
      this.$scores = undefined
      this.$correctionform.remove()
      this.$correctionform = undefined
    }
    this.updateScore()
  }

  /**
   * display the score of the MatchResult
   */
  updateScore () {
    if (this.model.isResult()) {
      this.model.score.forEach(function (score, index) {
        this.$scores.eq(index).text(score)
      }, this)
    }
  }
}

export default MatchResultView
