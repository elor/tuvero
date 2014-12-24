# scripts/ui/interfaces/view.js


An abstract view class

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./model.html">./model</a>

## Functions

###   function View (model, $view)
Displays a model and updates on changes to it.

**Argument:** **model**

The associated instance of the Model class
**Argument:** **$view**

A jQuery object which is represented by this view

---


###   View.prototype.reset = function ()
resets the whole view

---


###   View.prototype.update = function ()
update the whole view

---


###   View.prototype.hide = function ()
hide the whole view

---


###   View.prototype.show = function ()
show the whole view (after hiding it)

---


###   View.prototype.detach = function ()
Detach the whole view from its container before removing it

---


###   View.prototype.getElem = function ()
get the jQuery object (this.$view)


**Returns:** s this.$view

---

## Metrics

* 67 Lines
* 1254 Bytes

