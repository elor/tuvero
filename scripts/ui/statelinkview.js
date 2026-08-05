import ClassView from '../core/classview.js'

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which implements get() and emits update
 * @param $view
 *          the associated DOM element
 */
class StateLinkView extends ClassView {
  constructor (model, $view, propertyPath) {
    super(model, $view, undefined, 'hidden')
    this.propertyPath = propertyPath || ''
    this.update()
  }

  /**
   * write the contents of get() to the DOM
   */
  update () {
    super.update()
    const serverlink = this.model.get()
    if (serverlink) {
      // /+<alias> is the canonical tournament URL on the web side;
      // /t/<id> is the int-only legacy fallback (not what the
      // variant has, since the API exposes tournaments by alias).
      const webOrigin = (window.TUVERO_WEB_ORIGIN || window.location.origin).replace(/\/$/, '')
      this.$view.attr('href', webOrigin + '/+' + serverlink + this.propertyPath)
    }
  }

  /**
   * Callback listener
   */
  onupdate (event, emitter, data) {
    this.update()
  }
}

export default StateLinkView
