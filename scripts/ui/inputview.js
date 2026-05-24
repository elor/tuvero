import View from '../core/view.js';

/**
 * Constructor
 *
 * @param $view
 *          a DOM input element
 */
class InputView extends View {
  constructor($view) {
    super(undefined, $view);
  }

  /**
   * 'reset' Callback function: set the content of the input field to an empty
   * string
   */
  onreset() {
    this.$view.val('');
  }
}

export default InputView;