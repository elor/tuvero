/**
 * A ImageView, which updates the value of ValueModel to the DOM
 *
 * @return ImageView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', 'ui/attributevalueview'], function(extend,
    AttributeValueView) {

  /**
   * Constructor
   *
   * @param model
   *          a ValueModel instance, which implements get() and emits update
   * @param $view
   *          the associated DOM element
   */
  function ImageView(model, $view) {
    ImageView.superconstructor.call(this, model, $view, 'src');
  }
  extend(ImageView, AttributeValueView);

  return ImageView;
});
