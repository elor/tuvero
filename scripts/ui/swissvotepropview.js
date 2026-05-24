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
class SwissVotePropView extends ClassView {
  constructor(model, $view) {
    super(model, $view, undefined, 'forbidden');
    this.controller = new SwissVotePropController(this);
  }
}

export default SwissVotePropView;