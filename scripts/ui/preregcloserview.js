/**
 * hide a preregistration element as soon as the first team has been registered
 *
 * @return PreregCloserView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './view'], function(extend, View) {

  function PreregCloserView(model, $view) {
    PreregCloserView.superconstructor.call(this, model, $view);

    this.updateStatus();
  }
  extend(PreregCloserView, View);

  PreregCloserView.prototype.updateStatus = function() {
    if (this.model.length === 0) {
      this.$view.show();
    } else {
      this.$view.hide();
    }
  };

  PreregCloserView.prototype.onresize = function() {
    this.updateStatus();
  };

  return PreregCloserView;
});
