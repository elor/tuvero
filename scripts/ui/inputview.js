/**
 * InputView, mainly for automatically resetting a text or file input to an empty state
 *
 * @return InputView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/view'], function (extend, View) {
  /**
   * Constructor
   *
   * @param $view
   *          a DOM input element
   */
  function InputView ($view) {
    InputView.superconstructor.call(this, undefined, $view)
  }
  extend(InputView, View)

  /**
   * 'reset' Callback function: set the content of the input field to an empty
   * string
   */
  InputView.prototype.onreset = function () {
    this.$view.val('')
  }

  return InputView
})
