import Controller from '../core/controller.js';

/**
 * Constructor
 *
 * @param view
 *          a SwissVotePropView instance
 */
class SwissVotePropController extends Controller {
  constructor(view) {
    super(view);
    this.view.$view.click(this.toggleValue.bind(this));
  }

  /**
   * toggles the boolean value of the underlying model.
   */
  toggleValue() {
    this.model.set(!this.model.get());
  }
}

export default SwissVotePropController;