/**
 * CorrectionReferenceModel
 *
 * @return CorrectionReferenceModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/correctionmodel', 'core/resultreferencemodel'], function (
  extend, CorrectionModel, ResultReferenceModel) {
  /**
   * Constructor
   */
  function CorrectionReferenceModel (correction, teamlist) {
    CorrectionReferenceModel.superconstructor.call(this,
      new ResultReferenceModel(correction.before, teamlist),
      new ResultReferenceModel(correction.after, teamlist))

    this.correction = correction
  }
  extend(CorrectionReferenceModel, CorrectionModel)

  return CorrectionReferenceModel
})
