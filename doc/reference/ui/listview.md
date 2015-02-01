# scripts/ui/listview.js


ListView for printing data in a list using arbitrary views

* Exports: ListView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./templateview.html">./templateview</a>
* <a href="./textview.html">./textview</a>

## Functions

###   function ListView(model, $view, $template, SubView)
Constructor

**Argument:** **$view**

the jquery table object
**Argument:** **model**

the ListModel instance
**Argument:** **$template**

a template jQuery object, into which to insert the text of each
element. Defaults to a <div>
**Argument:** **SubView**

an object constructor for a View of the elements of the list.
Default to TextView

---


###   ListView.prototype.reset = function()
reset to an empty state

---


###   ListView.prototype.update = function()
redraw everything

---


###   ListView.prototype.insertItem = function(index)
inserts an item into the ListView, using the constructor-specified SubView

**Argument:** **index**

the index of the item inside the underlying list

---


###   ListView.prototype.removeItem = function(index)
remove the item from the DOM and remove all local references as well as its
subview

**Argument:** **index**

the index of the item upon removal

---


###   ListView.prototype.onupdate = function()
event callback function

---


###   ListView.prototype.oninsert = function(model, event, data)
Emitter Callback function, called right after a new element has been
inserted

**Argument:** **model**

the ListModel instance
**Argument:** **event**

name of the event, i.e. 'insert'
**Argument:** **data**

data object, containing at least the index within the list

---


###   ListView.prototype.onremove = function(model, event, data)
Emitter Callback function, called right after the removal of an element
from the list

**Argument:** **model**

the ListModel instance
**Argument:** **event**

name of the event, i.e. 'remove'
**Argument:** **data**

data object, containing at least the index within the list

---


###   ListView.prototype.onreset = function()
Callback function, event emitted by list.clear()

---

## Metrics

* 143 Lines
* 3511 Bytes

