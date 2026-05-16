/**
 * A ImageView, which updates the value of ValueModel to the DOM
 *
 * @return ImageView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import extend from '../lib/extend.js';
import AttributeValueView from './attributevalueview.js';
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
export default ImageView;