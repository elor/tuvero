import ClassView from '../core/classview.js';

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which implements get() and emits update
 * @param $view
 *          the associated DOM element
 */
class StateLinkView extends ClassView {
  constructor(model, $view, propertyPath) {
    super(model, $view, undefined, 'hidden');
    this.propertyPath = propertyPath || '';
    this.update();
  }

  /**
   * write the contents of get() to the DOM
   */
  update() {
    super.update();
    const tournamentid = this.model.get();
    if (tournamentid) {
      this.$view.attr('href', 'https://www.tuvero.de/t/' + tournamentid + this.propertyPath);
    }
  }

  /**
   * Callback listener
   */
  onupdate(event, emitter, data) {
    this.update();
  }
}

export default StateLinkView;