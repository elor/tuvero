/**
 * A model for table content, which may be extended for practical use cases
 *
 * @exports TableModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['lib/extend', './interfaces/model'], function(extend, Model) {
  /**
   * Constructor
   */
  function TableModel() {
    TableModel.superconstructor.call(this);
  }
  extend(TableModel, Model);

  /**
   * Get the text contents of the cell
   *
   * @param row
   *          Row of the cell (y-index)
   * @param col
   *          Column of the cell (x-index)
   * @return the text to display, or "" or undefined if there's nothing to
   *          display
   */
  TableModel.prototype.getCell = function(row, col) {
    return row + ',' + col;
  };

  /**
   * get the number of rows
   *
   * @return the number of rows. Less or equal 0 indicates an empty table
   */
  TableModel.prototype.numRows = function() {
    return 5;
  };

  /**
   * get the number of columns
   *
   * @return the number of columns. Less or equal 0 indicates an empty table
   */
  TableModel.prototype.numCols = function() {
    return 5;
  };

  /**
   * Get the title of a column
   *
   * @param col
   *          the index of the column (0-indexed)
   * @return the title of the given column
   */
  TableModel.prototype.getColTitle = function(col) {
    return 'Row ' + col;
  };

  return TableModel;
});
