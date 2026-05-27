/**
 * Font Size View: A widget for controlling the font size.
 *
 * The FontSizeModel is unique for every DOM element and can be retrieved and
 * controlled using a static function.
 *
 * TODO allow for arbitrary font sizes
 *
 * @return FontSizeView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import FontSizeController from './fontsizecontroller.js'
import FontSizeModel from './fontsizemodel.js'
let classprefix
classprefix = 'fontsize'

/**
 * Constructor, which also calls update() for the first time
 *
 * @param $view
 *          the container of the widget
 * @param $container
 *          the container of the size-adjusted text. If undefined, it defaults
 *          to <body>
 */
class FontSizeView extends View {
  constructor ($view, $container) {
    $container = $container || $('body')
    super(FontSizeView.getModelOfContainer($container), $view)
    this.$container = $container
    this.update()
    this.controller = new FontSizeController(this)
  }

  /**
   * removes all font size information
   */
  reset () {
    FontSizeModel.SIZES.forEach(function (size) {
      this.$container.removeClass(classprefix + size)
      this.$view.removeClass(classprefix + size)
    }, this)
  }

  /**
   * sets the current font size, as defined by the model
   */
  update () {
    this.reset()
    this.$container.addClass(classprefix + this.model.getFontSize())
    this.$view.addClass(classprefix + this.model.getFontSize())
  }

  /**
   * model.emit() callback function
   */
  onupdate () {
    this.update()
  }

  /**
   * Retrieves the model for the given container. Allocates a new FontSizeModel,
   * if not set yet.
   *
   * @param $container
   *          the container
   * @return the model for the given container
   */
  static getModelOfContainer ($container) {
    if (!$container.data('FontSizeModel')) {
      $container.data('FontSizeModel', new FontSizeModel())
    }
    return $container.data('FontSizeModel')
  }
}

export default FontSizeView
