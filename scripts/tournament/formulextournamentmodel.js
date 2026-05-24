import SwissTournamentModel from './swisstournamentmodel.js';
import Presets from 'presets';

/**
 * Constructor
 *
 * @param rankingorder
 */
class FormuleXTournamentModel extends SwissTournamentModel {
  constructor(rankingorder) {
    super(rankingorder);
    this.setProperty('swissmode', Presets.systems.formulex && Presets.systems.formulex.mode || FormuleXTournamentModel.MODES.ranks);
  }

  static MODES = {
    ranks: 'ranks'
  };
}

FormuleXTournamentModel.prototype.SYSTEM = 'formulex';

/**
 * an array of required vote lists
 */
FormuleXTournamentModel.prototype.VOTES = ['bye', 'up', 'down'];
export default FormuleXTournamentModel;