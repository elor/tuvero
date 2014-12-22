/**
 * TableView for viewing information in a tabular representation
 * 
 * @exports TableView
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/view', './boxcontroller' ], function (extend, View, BoxController) {
  var TableView;

  function validateText (text) {
    if (text === undefined) {
      return '';
    }
    return text;
  }

  /**
   * Constructor
   * 
   * @param $table
   *          the jquery table object
   * @param model
   *          the TableModel instance
   */
  function TableView ($table, model) {
    TableView.superconstructor.call(this, model, $table);
  }
  extend(TableView, View);

  /**
   * reset to an empty state
   */
  TableView.prototype.reset = function () {
    this.$view.empty();
  };

  /**
   * redraw everything
   */
  TableView.prototype.update = function () {
    var $table, row;

    $table = this.$view;

    this.reset();

    $table.append(this.createTitleRow());
    for (row = 0; row < this.model.numRows(); row += 1) {
      $table.append(this.createRow(row));
    }
  };

  /**
   * create the title row
   * 
   * @returns a jquery object containing the newly created still detached row
   */
  TableView.prototype.createTitleRow = function () {
    var col, $row, $cell;

    $row = $('<tr>');

    for (col = 0; col < this.model.numCols(); col += 1) {
      $cell = $('<th>').text(validateText(this.model.getColTitle(col)));
      $row.append($cell);
    }

    return $row;
  };

  /**
   * create a content row
   * 
   * @returns a jquery object containing the newly created still detached row
   */
  TableView.prototype.createRow = function (row) {
    var col, $row, $cell;

    $row = $('<tr>');

    for (col = 0; col < this.model.numCols(); col += 1) {
      $cell = $('<td>').text(validateText(this.model.getCell(row, col)));
      $row.append($cell);
    }

    return $row;
  };

  /**
   * event callback function
   */
  TableView.prototype.onupdate = function () {
    this.update();
  };

  return TableView;
});
