# scripts/ui/listview.js


ListView for viewing information in a tabular representation

* Exports: ListView
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

###   function ListView ($view, model)
Constructor

**Argument:** **$view**

the jquery table object
**Argument:** **model**

the TableModel instance

---


###   ListView.prototype.reset = function ()
reset to an empty state

---


###   ListView.prototype.update = function ()
redraw everything

---


###   ListView.prototype.createItem = function (index)
create a content row


**Returns:** s a jquery object containing the newly created still detached row

---


###   ListView.prototype.onupdate = function ()
event callback function

---

## Metrics

* 76 Lines
* 1485 Bytes

