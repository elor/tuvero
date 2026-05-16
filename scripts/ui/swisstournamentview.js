/**
 * SwissTournamentView
 *
 * @return SwissTournamentView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import TournamentView from './tournamentview.js';
import SwissTournamentController from './swisstournamentcontroller.js';
import ValueModel from '../core/valuemodel.js';
import CheckBoxView from './checkboxview.js';
import SwissVotesView from './swissvotesview.js';
import SwissMaxRoundView from './swissmaxroundview.js';
/**
 * Constructor
 *
 * @param model
 *          a SwissTournamentModel instance
 * @param $view
 *          a jquery DOM element
 */
function SwissTournamentView(model, $view, tournaments) {
  SwissTournamentView.superconstructor.call(this, model, $view, tournaments);

  // set noshuffle
  this.model.noshuffle = new ValueModel(!this.model.tournament.getProperty('swissshuffle'));
  // use noshuffle checkboxes
  this.noshufflecheckboxview = {
    initial: new CheckBoxView(this.model.noshuffle, this.$view.find('.initial .tournamentoptions .option input.noshuffle')),
    idle: new CheckBoxView(this.model.noshuffle, this.$view.find('.idle .tournamentoptions .option input.noshuffle'))
  };
  this.maxroundview = new SwissMaxRoundView(this.model.tournament, $view.find('.swissmaxroundview'));

  // read the swiss mode
  this.$view.find('.tournamentoptions .option select.mode').val(this.model.tournament.getProperty('swissmode'));
  this.swissvotes = new SwissVotesView(this.model.tournament, this.$view.find('.option.swissvotes'));
  this.subcontroller = new SwissTournamentController(this);
}
extend(SwissTournamentView, TournamentView);
export default SwissTournamentView;