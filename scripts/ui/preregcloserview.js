import extend from '../lib/extend.js';
import View from '../core/view.js';
function PreregCloserView(model, $view) {
  PreregCloserView.superconstructor.call(this, model, $view);
  this.updateStatus();
}
extend(PreregCloserView, View);
PreregCloserView.prototype.updateStatus = function () {
  if (this.model.length === 0) {
    this.$view.removeClass('noprereg');
  } else {
    this.$view.addClass('noprereg');
  }
};
PreregCloserView.prototype.onresize = function () {
  this.updateStatus();
};
export default PreregCloserView;