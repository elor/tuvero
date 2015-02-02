/**
 * remove a list element on click
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
   * @param selector
   *          Optional. A CSS selector, relative to view.$view. Defaults to '>',
   *          i.e. the list elements
   * @param active
   *          Optional. A ValueModel instance, which indicates whether removals
   *          are allowed at the moment. Defaults to true
   */
  function ListClickRemoveController(view, selector, active) {
    var listview, listmodel;
    ListClickRemoveController.superconstructor.call(this, view);

    selector = selector || '>';
    active = active || new ValueModel(true);

    listview = this.view;
    listmodel = this.model;

    /**
     * handle the click action
     */
    this.view.$view.on('click', selector, function() {
      var $subview, index;

      if (active.get()) {
        $subview = $(this);
        index = listview.indexOf($subview);
        if (index !== -1) {
          listmodel.remove(index);
        }
      }
    });
  }
  extend(ListClickRemoveController, Controller);

  return ListClickRemoveController;
});
