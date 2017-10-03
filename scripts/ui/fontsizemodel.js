/**
 * Model for user-driven and programmatic font size changes
 *
 * @return FontSizeModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {

  /**
   * FontSizeModel constructor
   */
  function FontSizeModel() {
    FontSizeModel.superconstructor.call(this);

    this.fontsize = FontSizeModel.DEFAULT;
  }
  extend(FontSizeModel, Model);

  /**
   * list of possible font sizes
   */
  FontSizeModel.SIZES = ['tiny', 'small', 'normal', 'large', 'huge'];

  /**
   * default font size
   */
  FontSizeModel.DEFAULT = FontSizeModel.SIZES[2];

  /**
   * @return the current font size
   */
  FontSizeModel.prototype.getFontSize = function() {
    return this.fontsize;
  };

  /**
   * Set the font size. Throws an error if the font size is invalid.
   *
   * @param fontsize
   */
  FontSizeModel.prototype.setFontSize = function(fontsize) {
    if (FontSizeModel.SIZES.indexOf(fontsize) === -1) {
      throw 'invalid font size';
    }
    this.fontsize = fontsize;
    this.emit('update');
  };

  return FontSizeModel;
});
