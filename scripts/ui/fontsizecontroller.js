/**
 * Font Size Controller for adjusting the font size according to user input on
 * the FontSizeView widget
 * 
 * @exports FontSizeController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/controller' ], function (extend, Controller) {

  /**
   * Constructor
   * 
   * @param view
   *          the FontSizeView
   */
  function FontSizeController (view) {
    var model;
    FontSizeController.superconstructor.call(this, view);

    model = this.model;

    /**
     * adjust the font size at the click of a button
     */
    this.view.$view.on('click', '> button', function () {
      model.setFontSize($(this).attr('class').replace(/.*fontsize([a-z]+).*/, '$1'));
    });
  }
  extend(FontSizeController, Controller);

  return FontSizeController;
});
