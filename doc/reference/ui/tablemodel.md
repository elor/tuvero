# scripts/ui/tablemodel.js


A model for table content, which may be extended for practical use cases

* Exports: TableModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/model.html">./interfaces/model</a>
* lib/extend

## Functions

###   function TableModel ()
Constructor

---


###   TableModel.prototype.getCell = function (row, col)
Get the text contents of the cell

**Argument:** **row**

Row of the cell (y-index)
**Argument:** **col**

Column of the cell (x-index)

**Returns:** s the text to display, or "" or undefined if there's nothing to
display

---


###   TableModel.prototype.numRows = function ()
get the number of rows


**Returns:** s the number of rows. Less or equal 0 indicates an empty table

---


###   TableModel.prototype.numCols = function ()
get the number of columns


**Returns:** s the number of columns. Less or equal 0 indicates an empty table

---


###   TableModel.prototype.getColTitle = function (col)
Get the title of a column

**Argument:** **col**

the index of the column (0-indexed)

**Returns:** s the title of the given column

---

## Metrics

* 63 Lines
* 1422 Bytes

