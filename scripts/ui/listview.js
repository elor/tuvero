/**
 * ListView for printing raw data in a list
 * 
 * @exports ListView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/view' ], function (extend, View) {
  var ListView;

  /**
   * Constructor
   * 
   * @param $view
   *          the jquery table object
   * @param model
   *          the TableModel instance
   * @param $template
   *          a template jQuery object, into which to insert the text of each
   *          element. Defaults to a list item
   */
  function ListView ($view, model, $template) {
    ListView.superconstructor.call(this, model, $view);

    this.$template = $template || $('<li>');
  }
  extend(ListView, View);

  /**
   * reset to an empty state
   */
  ListView.prototype.reset = function () {
    this.$view.empty();
  };

  /**
   * redraw everything
   */
  ListView.prototype.update = function () {
    var index;

    this.reset();

    for (index = 0; index < this.model.length; index += 1) {
      this.$view.append(this.createItem(index));
    }
  };

  /**
   * create a content row
   * 
   * @returns a jquery object containing the newly created still detached row
   */
  ListView.prototype.createItem = function (index) {
    var $item;

    $item = this.$template.clone().text(this.model.get(index));

    return $item;
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
    var index, $item;

    index = data.id;
    $item = this.createItem(index);

    if (index === 0) {
      this.$view.prepend($item);
    } else if (index === this.model.length - 1) {
      this.$view.append($item);
    } else {
      this.$view.children('nth-child(' + (index - 1) + ')').after($item);
    }
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
    var index;

    index = data.id;

    this.$view.children().eq(index).remove();
  };

  return ListView;
});
