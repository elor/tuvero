# scripts/ui/interfaces/view.js


An abstract view class

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

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
detach the whole view before removing it

---


###   View.prototype.attach = function ($container)
attach the whole view to the end of the container

**Argument:** **$container**

a jQuery object to which the view is attached

---


###   View.prototype.onupdate = function ()

---

## Metrics

* 72 Lines
* 1359 Bytes

