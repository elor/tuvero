/**
 * BrowserInfoController
 *
 * @return BrowserInfoController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller'], function(extend, Controller) {
  /**
   * Constructor
   */
  function BrowserInfoController(view) {
    var model;

    BrowserInfoController.superconstructor.call(this, view);

    this.$updateButton = this.view.$view.find('button.update');
    model = this.model;

    this.$updateButton.click(function() {
      model.emit('update');
    });
  }
  extend(BrowserInfoController, Controller);

  return BrowserInfoController;
});
