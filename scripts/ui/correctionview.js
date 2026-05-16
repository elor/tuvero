/**
 * CorrectionView
 *
 * @return CorrectionView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import MatchResultView from './matchresultview.js';
/**
 * Constructor
 *
 * @param model
 *          a CorrectionModel instance
 * @param $view
 *          a row of a correction table
 */
function CorrectionView(model, $view) {
  CorrectionView.superconstructor.call(this, model, $view);
  this.$before = this.$view.find('.before');
  this.$after = this.$view.find('.after');
  this.beforeview = new MatchResultView(model.before, this.$before);
  this.afterview = new MatchResultView(model.after, this.$after);
}
extend(CorrectionView, View);
export default CorrectionView;