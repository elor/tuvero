import MatchController from './matchcontroller.js'
import Strings from './strings.js'
import Toast from './toast.js'
import Options from 'options'

/**
 * Constructor
 */
class MatchResultController extends MatchController {
  constructor (view, $form, tournament) {
    super(view, $form)
    if (this.model.length !== 2) {
      console.error('corrections corrently only works with two teams.')
      return
    }
    this.tournament = tournament
    this.$match = this.$form.parents('.match').eq(0)
    this.$result = this.view.$result
    this.$result.click(this.enableCorrection.bind(this))
    this.updateScore()
  }

  updateScore () {
    this.$scores.eq(0).val(this.model.score[0])
    this.$scores.eq(1).val(this.model.score[1])
    this.$scores.attr('max', Options.maxpoints)
    this.$scores.attr('min', Options.minpoints)
  }

  enableCorrection () {
    this.updateScore()
    this.$match.addClass('correcting')
    this.$scores.eq(0).click()
  }

  disableCorrection () {
    this.$match.removeClass('correcting')
  }

  cancel () {
    Toast.once(Strings.pointchangeaborted)
    this.disableCorrection()
  }

  accept () {
    const score = []
    score.push(Number(this.$scores.eq(0).val()))
    score.push(Number(this.$scores.eq(1).val()))
    if (isNaN(score[0]) || isNaN(score[1])) {
      return
    } else if (score[0] < Options.minpoints || score[1] < Options.minpoints) {
      return
    } else if (score[0] > Options.maxpoints || score[1] > Options.maxpoints) {
      return
    } else if (score[0] === this.model.score[0] && score[1] === this.model.score[1]) {
      return
    }
    this.tournament.correct(this.model, score)
    Toast.once(Strings.pointchangeapplied)
    this.disableCorrection()
  }
}

export default MatchResultController
