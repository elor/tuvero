import CorrectionModel from './correctionmodel.js'
import ResultReferenceModel from './resultreferencemodel.js'

/**
 * Constructor
 */
class CorrectionReferenceModel extends CorrectionModel {
  constructor (correction, teamlist) {
    super(
      new ResultReferenceModel(correction.before, teamlist),
      new ResultReferenceModel(correction.after, teamlist)
    )
    this.correction = correction
  }
}

export default CorrectionReferenceModel
