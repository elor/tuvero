/**
 * LoadedImagesView
 *
 * @return LoadedImagesView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import View from '../core/view.js';
import $ from 'jquery';
/**
 * Constructor
 */
function LoadedImagesView($view) {
  LoadedImagesView.superconstructor.call(this, undefined, $view);
  this.appendImages($(document.body));
}
extend(LoadedImagesView, View);

/**
 * reads all sprite images from the page and returns them as a list
 *
 * @param $container
 *          a jquery element for which all images should be retrieved
 * @return an array of image names, e.g. 'new', 'boule'. For use with the
 *         data-img attribute
 */
LoadedImagesView.imageList = function ($container) {
  let $images, images;
  $images = $container.find('[data-img]');
  images = {};
  $images.each(function () {
    images[$(this).attr('data-img')] = true;
  });

  // don't use the sprite itself
  delete images.sprite;
  return Object.keys(images).sort();
};

/**
 * finds and appends all images from the container
 *
 * @param $container
 */
LoadedImagesView.prototype.appendImages = function ($container) {
  let images;
  images = LoadedImagesView.imageList($container);
  images.forEach(function (image) {
    const $image = $('<div>').attr('data-img', image);
    this.$view.append($image);
  }, this);
};
export default LoadedImagesView;