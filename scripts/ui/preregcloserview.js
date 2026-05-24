import View from '../core/view.js';

class PreregCloserView extends View {
  constructor(model, $view) {
    super(model, $view);
    this.updateStatus();
  }

  updateStatus() {
    if (this.model.length === 0) {
      this.$view.removeClass('noprereg');
    } else {
      this.$view.addClass('noprereg');
    }
  }

  onresize() {
    this.updateStatus();
  }
}

export default PreregCloserView;