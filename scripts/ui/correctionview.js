import View from '../core/view.js'
import MatchResultView from './matchresultview.js'

/**
 * Constructor
 *
 * @param model
 *          a CorrectionModel instance
 * @param $view
 *          a row of a correction table
 */
class CorrectionView extends View {
  constructor (model, $view) {
    super(model, $view)
    this.$before = this.$view.find('.before')
    this.$after = this.$view.find('.after')
    this.beforeview = new MatchResultView(model.before, this.$before)
    this.afterview = new MatchResultView(model.after, this.$after)
  }
}

export default CorrectionView
