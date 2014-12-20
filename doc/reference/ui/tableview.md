# scripts/ui/tableview.js


TableView for viewing information in a tabular representation

* Exports: TableView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./boxcontroller.html">./boxcontroller</a>
* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend
* JQuery


## Functions

###   function validateText (text)

---

###   function TableView ($table, model)
Constructor

**Argument:** **$table**

the jquery table object
**Argument:** **model**

the TableModel instance

---


###   TableView.prototype.reset = function ()
reset to an empty state

---


###   TableView.prototype.update = function ()
redraw everything

---


###   TableView.prototype.createTitleRow = function ()
create the title row


**Returns:** s a jquery object containing the newly created still detached row

---


###   TableView.prototype.createRow = function (row)
create a content row


**Returns:** s a jquery object containing the newly created still detached row

---


###   TableView.prototype.onupdate = function ()
event callback function

---

## Metrics

* 100 Lines
* 2088 Bytes

