/**
 * on a list element click, runs the callback function
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './controller', './valuemodel'], function(extend,
    Controller, ValueModel) {
  /**
   * Constructor
   *
   * @param view
   *          a ListView instance
   * @param callback
   *          the callback function: callback(model, index)
   * @param cbthis
   *          Optional. passed as "this" to the callback function
   * @param selector
   *          Optional. A CSS selector, relative to view.$view. Defaults to '>',
   *          i.e. the list elements\
   * @param active
   *          Optional. A ValueModel instance, which indicates whether removals
   *          are allowed at the moment. Defaults to true
   */
  function ListClickController(view, callback, cbthis, selector, active) {
    var listview, listmodel;
    ListClickController.superconstructor.call(this, view);

    selector = selector || '>';
    active = active || new ValueModel(true);

    listview = this.view;
    listmodel = this.model;

    /**
     * handle the click action
     */
    this.view.$view.on('click', selector, function(e) {
      var $subview, index;

      if (active.get()) {
        $subview = $(this);
        index = listview.indexOf($subview);
        if (index !== -1) {
          callback.call(cbthis || window, listmodel, index);
          e.preventDefault();
          return false;
        }
      }
    });
  }
  extend(ListClickController, Controller);

  return ListClickController;
});
