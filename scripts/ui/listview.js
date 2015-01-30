/**
 * ListView for printing data in a list using arbitrary views
 * 
 * @exports ListView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/view', './textview' ], function (extend,
    View, TextView) {
  /**
   * Constructor
   * 
   * @param $view
   *          the jquery table object
   * @param model
   *          the ListModel instance
   * @param $template
   *          a template jQuery object, into which to insert the text of each
   *          element. Defaults to a <div>
   * @param SubView
   *          an object constructor for a View of the elements of the list.
   *          Default to TextView
   */
  function ListView (model, $view, $template, SubView) {
    ListView.superconstructor.call(this, model, $view);

    this.$template = $template || $('<div>');
    this.SubView = SubView || TextView;
    this.subviews = [];
  }
  extend(ListView, View);

  /**
   * reset to an empty state
   */
  ListView.prototype.reset = function () {
    while (this.length > 0) {
      this.removeItem(0);
    }
  };

  /**
   * redraw everything
   */
  ListView.prototype.update = function () {
    var index;

    this.reset();

    for (index = 0; index < this.model.length; index += 1) {
      this.insertItem(index);
    }
  };

  /**
   * inserts an item into the ListView, using the constructor-specified SubView
   * 
   * @param index
   *          the index of the item inside the underlying list
   */
  ListView.prototype.insertItem = function (index) {
    var $item, $subview, subview, model, $previousView;

    $subview = this.$template.clone();
    model = this.model.get(index);
    subview = new this.SubView(model, $subview);

    $item = subview.$view; // == $subview, but may have been wrapped by a tag

    if (index === this.subviews.length) {
      this.$view.append($item);
    } else {
      $previousView = this.subviews[index].$view;
      $previousView.before($item);
    }
    this.subviews.splice(index, 0, subview);
  };

  /**
   * remove the item from the DOM and remove all local references as well as its
   * subview
   * 
   * @param index
   *          the index of the item upon removal
   */
  ListView.prototype.removeItem = function (index) {
    var subview;

    subview = this.subviews[index];

    if (subview) {
      subview.destroy();
      this.subviews.splice(index, 1);
    }
  };

  /**
   * event callback function
   */
  ListView.prototype.onupdate = function () {
    this.update();
  };

  /**
   * Emitter Callback function, called right after a new element has been
   * inserted
   * 
   * @param model
   *          the ListModel instance
   * @param event
   *          name of the event, i.e. 'insert'
   * @param data
   *          data object, containing at least the index within the list
   */
  ListView.prototype.oninsert = function (model, event, data) {
    this.insertItem(data.id);
  };

  /**
   * Emitter Callback function, called right after the removal of an element
   * from the list
   * 
   * @param model
   *          the ListModel instance
   * @param event
   *          name of the event, i.e. 'remove'
   * @param data
   *          data object, containing at least the index within the list
   */
  ListView.prototype.onremove = function (model, event, data) {
    this.removeItem(data.id);
  };

  return ListView;
});
