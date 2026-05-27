import View from '../core/view.js'
import $ from 'jquery'

/**
 * Constructor
 */
class LoadedImagesView extends View {
  constructor ($view) {
    super(undefined, $view)
    this.appendImages($(document.body))
  }

  /**
   * finds and appends all images from the container
   *
   * @param $container
   */
  appendImages ($container) {
    const images = LoadedImagesView.imageList($container)
    images.forEach(function (image) {
      const $image = $('<div>').attr('data-img', image)
      this.$view.append($image)
    }, this)
  }

  /**
   * reads all sprite images from the page and returns them as a list
   *
   * @param $container
   *          a jquery element for which all images should be retrieved
   * @return an array of image names, e.g. 'new', 'boule'. For use with the
   *         data-img attribute
   */
  static imageList ($container) {
    const $images = $container.find('[data-img]')
    const images = {}
    $images.each(function () {
      images[$(this).attr('data-img')] = true
    })

    // don't use the sprite itself
    delete images.sprite
    return Object.keys(images).sort()
  }
}

export default LoadedImagesView
