# scripts/ui/listview.js


ListView for printing raw data in a list

* Exports: ListView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend
* JQuery


## Functions

###   function ListView ($view, model, $template)
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


###   ListView.prototype.oninsert = function (model, event, data)
Emitter Callback function, called right after a new element has been
inserted

**Argument:** **model**

the ListModel instance
**Argument:** **event**

name of the event, i.e. 'insert'
**Argument:** **data**

data object, containing at least the index within the list

---


###   ListView.prototype.onremove = function (model, event, data)
Emitter Callback function, called right after the removal of an element
from the list

**Argument:** **model**

the ListModel instance
**Argument:** **event**

name of the event, i.e. 'remove'
**Argument:** **data**

data object, containing at least the index within the list

---

## Metrics

* 114 Lines
* 2528 Bytes

