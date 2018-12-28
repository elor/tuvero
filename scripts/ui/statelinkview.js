/**
 * A ValueView, which updates the value of ValueModel to the DOM
 *
 * @return ValueView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'core/classview'], function (extend, ClassView) {
  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance, which implements get() and emits update
   * @param $view
   *          the associated DOM element
   */
  function StateLinkView (model, $view, propertyPath) {
    StateLinkView.superconstructor.call(this, model, $view, undefined, 'hidden')

    this.propertyPath = propertyPath || ''

    this.update()
  }
  extend(StateLinkView, ClassView)

  /**
   * write the contents of get() to the DOM
   */
  StateLinkView.prototype.update = function () {
    StateLinkView.superclass.update.call(this)
    var tournamentid = this.model.get()
    if (tournamentid) {
      this.$view.attr('href', 'https://www.tuvero.de/t/' + tournamentid + this.propertyPath)
    }
  }

  /**
   * Callback listener
   */
  StateLinkView.prototype.onupdate = function (event, emitter, data) {
    this.update()
  }

  return StateLinkView
})
