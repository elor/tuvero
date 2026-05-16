/**
 * SwissVotePropView
 *
 * @return SwissVotePropView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import ClassView from '../core/classview.js';
import SwissVotePropController from './swissvotepropcontroller.js';
/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which has a boolean value
 * @param $view
 *          a '.swissvotes .prop' DOM element
 */
function SwissVotePropView(model, $view) {
  SwissVotePropView.superconstructor.call(this, model, $view, undefined, 'forbidden');
  this.controller = new SwissVotePropController(this);
}
extend(SwissVotePropView, ClassView);
export default SwissVotePropView;