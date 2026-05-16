/**
 * CorrectionReferenceModel
 *
 * @return CorrectionReferenceModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import CorrectionModel from './correctionmodel.js';
import ResultReferenceModel from './resultreferencemodel.js';
/**
 * Constructor
 */
function CorrectionReferenceModel(correction, teamlist) {
  CorrectionReferenceModel.superconstructor.call(this, new ResultReferenceModel(correction.before, teamlist), new ResultReferenceModel(correction.after, teamlist));
  this.correction = correction;
}
extend(CorrectionReferenceModel, CorrectionModel);
export default CorrectionReferenceModel;