/**
 * CorrectionReferenceModel
 *
 * @return CorrectionReferenceModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './correctionmodel', './resultreferencemodel'], function(
    extend, CorrectionModel, ResultReferenceModel) {
  /**
   * Constructor
   */
  function CorrectionReferenceModel(correction, teamlist) {
    CorrectionReferenceModel.superconstructor.call(this,
        new ResultReferenceModel(correction.before, teamlist),
        new ResultReferenceModel(correction.after, teamlist));

    this.correction = correction;
  }
  extend(CorrectionReferenceModel, CorrectionModel);

  return CorrectionReferenceModel;
});