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


###   View.prototype.destroy = function ()
destroy the whole view by removing its element from the DOM and
unregistering the default event listener (disconnect from this.model)

Ideas:

A View should not be destroyed and re-instantiated in place on the same DOM
element, that's what reset() is for

This function should effectively destroy the view, leaving nothing behind.
That's intended for deletion from lists etc., where elements are
permanently removed and replaced with new elements.


---

## Metrics

* 56 Lines
* 1361 Bytes

