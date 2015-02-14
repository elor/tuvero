/**
 * Box Controller for catching collapse-by-click events
 *
 * @return BoxController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './controller'], function(extend, Controller) {
  /**
   * Constructor, in which a click to the header is bound to sending a a toggle
   * event over the model.
   *
   * @param view
   *          the instance of BoxView which will be controlled
   */
  function BoxController(view) {
    var model;
    BoxController.superconstructor.call(this, view);

    model = this.model;

    this.view.$view.on('click', '> h3:first-child', function() {
      model.emit('toggle');
    });
  }
  extend(BoxController, Controller);

  return BoxController;
});
