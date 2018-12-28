/**
 * InlineListView
 *
 * @return InlineListView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'ui/listview'], function (extend, ListView) {
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
  function InlineListView (model, $view, $template, SubView) {
    this.insertBeforeView = true
    InlineListView.superconstructor.apply(this, arguments)
  }
  extend(InlineListView, ListView)

  return InlineListView
})
