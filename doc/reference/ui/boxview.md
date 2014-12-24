# scripts/ui/boxview.js


BoxView for collapsing boxes on click events

* Exports: BoxView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./boxcontroller.html">./boxcontroller</a>
* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend

## Functions

###   function setTabbing ($box)
Set the current tabbing state. This forbids tabbing into a collapsed box.

**Argument:** **$box**

the .box jQuery object

---


###   function BoxView ($box)
Constructor, which also creates the BoxController

**Argument:** **$box**

the .box jQuery object

---


###   BoxView.prototype.reset = function ()
reset to the expanded state

---


###   BoxView.prototype.update = function ()
update the box with a transition, e.g. after toggling its state

---


###   BoxView.prototype.ontoggle = function ()
toggle callback function

---

## Metrics

* 112 Lines
* 2684 Bytes

