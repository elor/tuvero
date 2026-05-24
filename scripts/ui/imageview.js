import AttributeValueView from './attributevalueview.js';

/**
 * Constructor
 *
 * @param model
 *          a ValueModel instance, which implements get() and emits update
 * @param $view
 *          the associated DOM element
 */
class ImageView extends AttributeValueView {
  constructor(model, $view) {
    super(model, $view, 'src');
  }
}

export default ImageView;