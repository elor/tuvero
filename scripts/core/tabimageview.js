import View from './view.js';

/**
 * Constructor
 *
 * @param tabname
 *          the base name of the tab
 * @param model
 *          a ValueModel instance. The value will be appended to the base name
 *          to create the image descriptor
 * @param $view
 *          the associated view
 */
class TabImageView extends View {
  constructor(tabname, model, $view) {
    super(model, $view);
    this.tabname = tabname;
    this.update();
  }

  /**
   * update the image to the given parameters
   */
  update() {
    this.$view.attr('data-img', this.tabname + this.model.get());
  }

  /**
   * Callback function for the associated ValueModel
   */
  onupdate() {
    this.update();
  }
}

export default TabImageView;