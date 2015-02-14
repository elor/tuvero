/**
 * hide preregistration elements as soon as the first team has been registered
 *
 * @return PreregCloserView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './view'], function(extend, View) {

  /**
   * Constructor
   *
   * @param model
   *          a ListModel of the teams
   * @param $view
   *          a container for all affected DOM elements
   */
  function PreregCloserView(model, $view) {
    PreregCloserView.superconstructor.call(this, model, $view);

    this.updateStatus();
  }
  extend(PreregCloserView, View);

  /**
   * update the preregistration status
   */
  PreregCloserView.prototype.updateStatus = function() {
    if (this.model.length === 0) {
      this.$view.removeClass('noprereg');
    } else {
      this.$view.addClass('noprereg');
    }
  };

  /**
   * Callback function
   */
  PreregCloserView.prototype.onresize = function() {
    this.updateStatus();
  };

  return PreregCloserView;
});
