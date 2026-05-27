import Model from '../core/model.js'

/**
 * FontSizeModel constructor
 */
class FontSizeModel extends Model {
  constructor () {
    super()
    this.fontsize = FontSizeModel.DEFAULT
  }

  /**
   * @return the current font size
   */
  getFontSize () {
    return this.fontsize
  }

  /**
   * Set the font size. Throws an error if the font size is invalid.
   *
   * @param fontsize
   */
  setFontSize (fontsize) {
    if (FontSizeModel.SIZES.indexOf(fontsize) === -1) {
      throw new Error('invalid font size')
    }
    this.fontsize = fontsize
    this.emit('update')
  }

  /**
   * list of possible font sizes
   */
  static SIZES = ['tiny', 'small', 'normal', 'large', 'huge']

  /**
   * default font size
   */
  static DEFAULT = FontSizeModel.SIZES[2]
}

export default FontSizeModel
