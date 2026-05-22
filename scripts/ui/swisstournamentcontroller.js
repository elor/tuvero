/**
 * SwissTournamentController
 *
 * @return SwissTournamentController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import extend from '../lib/extend.js';
import Controller from '../core/controller.js';
import Listener from '../core/listener.js';
import PropertyValueModel from '../core/propertyvaluemodel.js';
/**
 * Constructor
 *
 * @param view
 *          a SwissTournamentView instance
 */
function SwissTournamentController(view) {
  let $mode, tournament, noshuffle;
  SwissTournamentController.superconstructor.call(this, view);
  tournament = this.model.tournament;
  noshuffle = this.model.noshuffle;
  this.$options = this.view.$view.find('.tournamentoptions');
  $mode = this.$options.find('select.mode');
  $mode.change(function () {
    tournament.setProperty('swissmode', $(this).val());
    $mode.val($(this).val());
    tournament.setProperty('swisstranspose', tournament.getProperty('swissmode') === 'halves');
  });
  Listener.bind(noshuffle, 'update', function () {
    tournament.setProperty('swissshuffle', !noshuffle.get());
  });
  this.initSpecialWinsProperties();
}
extend(SwissTournamentController, Controller);

/**
 * update the visibility and properties
 */
SwissTournamentController.prototype.initSpecialWinsProperties = function () {
  let modevalue, votesenabled, byeafterbye;
  modevalue = new PropertyValueModel(this.model.tournament, 'swissmode');
  votesenabled = new PropertyValueModel(this.model.tournament,
  //
  'enableupdown');
  byeafterbye = new PropertyValueModel(this.model.tournament, 'byeafterbye');
  Listener.bind(modevalue, 'update', function () {
    votesenabled.set(modevalue.get() === 'wins');
    if (!votesenabled.get()) {
      byeafterbye.set(false);
    }
  });
};
export default SwissTournamentController;