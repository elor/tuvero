define(['lib/extend', 'core/view'], function (extend, View) {
  function PreregCloserView (model, $view) {
    PreregCloserView.superconstructor.call(this, model, $view)

    this.updateStatus()
  }
  extend(PreregCloserView, View)

  PreregCloserView.prototype.updateStatus = function () {
    if (this.model.length === 0) {
      this.$view.removeClass('noprereg')
    } else {
      this.$view.addClass('noprereg')
    }
  }

  PreregCloserView.prototype.onresize = function () {
    this.updateStatus()
  }

  return PreregCloserView
})
