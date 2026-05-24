import Controller from '../core/controller.js';

/**
 * Constructor, in which a click to the header is bound to sending a a toggle
 * event over the model.
 *
 * @param view
 *          the instance of BoxView which will be controlled
 */
class BoxController extends Controller {
  constructor(view) {
    super(view);
    this.view.$view.on('click', '> h3:first-child', this.toggle.bind(this));
  }

  toggle(evt) {
    if (evt.target.nodeName.toLowerCase() === 'input') {
      evt.preventDefault();
      return false;
    }
    this.model.emit('toggle');
  }
}

export default BoxController;