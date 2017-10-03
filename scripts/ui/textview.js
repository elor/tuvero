/**
 * Generic View for filling a DOM element with text
 *
 * @return TextView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/view'], function(extend, View) {

  /**
   * constructor
   *
   * @param text
   *          the initial text
   * @param $view
   *          the containing DOM element
   */
  function TextView(text, $view) {
    TextView.superconstructor.call(this, undefined, $view);

    this.setText(text);
  }
  extend(TextView, View);

  /**
   * change the text of this element
   *
   * @param text
   *          the new text
   */
  TextView.prototype.setText = function(text) {
    if (text === undefined) {
      this.model.text = 'undefined';
    } else {
      this.model.text = text;
    }
    this.model.emit('update');
  };

  /**
   * reset the text to an empty string
   */
  TextView.prototype.reset = function() {
    this.setText('');
  };

  /**
   * write the current text to the DOM element
   */
  TextView.prototype.update = function() {
    this.$view.text(this.model.text);
  };

  /**
   * Callback listener
   */
  TextView.prototype.onupdate = function() {
    this.update();
  };

  return TextView;
});
