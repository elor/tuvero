/**
 * ListView for viewing information in a tabular representation
 * 
 * @exports ListView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/view', './boxcontroller' ], function (extend, View, BoxController) {
  var ListView;

  function validateText (text) {
    if (text === undefined) {
      return '';
    }
    return text;
  }

  /**
   * Constructor
   * 
   * @param $view
   *          the jquery table object
   * @param model
   *          the TableModel instance
   */
  function ListView ($view, model) {
    ListView.superconstructor.call(this, model, $view);
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
    var $view, index;

    this.reset();

    $view = this.$view;

    for (index = 0; index < this.model.numItems(); index += 1) {
      $view.append(this.createItem(index));
    }
  };

  /**
   * create a content row
   * 
   * @returns a jquery object containing the newly created still detached row
   */
  ListView.prototype.createItem = function (index) {
    var $item;

    $item = $('<div>').text(this.model.getItem(index).text);

    return $item;
  };

  /**
   * event callback function
   */
  ListView.prototype.onupdate = function () {
    this.update();
  };

  return ListView;
});
