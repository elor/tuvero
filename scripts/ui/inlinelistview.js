import ListView from './listview.js'

/**
 * Constructor
 *
 * @param model
 *          the ListModel instance
 * @param $view
 *          the jquery table object
 * @param $template
 *          a template jQuery object, into which to insert the text of each
 *          element. Defaults to a <div>
 * @param SubView
 *          an object constructor for a View of the elements of the list.
 *          Default to TextView
 * @param ...
 *          arbitrary number of additional arguments, which are passed to the
 *          SubView constructor
 */
class InlineListView extends ListView {
  static insertBeforeView = true

  constructor (model, $view, $template, SubView, ...rest) {
    super(model, $view, $template, SubView, ...rest)
  }
}

export default InlineListView
