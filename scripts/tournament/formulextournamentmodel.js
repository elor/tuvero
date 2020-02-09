/**
 * FormuleXTournamentModel
 *
 * @return FormuleXTournamentModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'tournament/swisstournamentmodel', 'presets'
], function (extend, SwissTournamentModel, Presets) {
  /**
   * Constructor
   *
   * @param rankingorder
   */
  function FormuleXTournamentModel (rankingorder) {
    FormuleXTournamentModel.superconstructor.call(this, rankingorder)
    this.setProperty('swissmode',
      (Presets.systems.formulex && Presets.systems.formulex.mode) ||
      FormuleXTournamentModel.MODES.ranks)
  }
  extend(FormuleXTournamentModel, SwissTournamentModel)

  FormuleXTournamentModel.prototype.SYSTEM = 'formulex'

  /**
   * an array of required vote lists
   */
  FormuleXTournamentModel.prototype.VOTES = ['bye', 'up', 'down']

  FormuleXTournamentModel.MODES = {
    ranks: 'ranks'
  }

  return FormuleXTournamentModel
})
