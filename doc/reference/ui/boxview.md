# scripts/ui/boxview.js


BoxView for collapsing boxes on click events

* Exports: BoxView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./boxcontroller.html">./boxcontroller</a>
* lib/extend
* <a href="./view.html">./view</a>

## Functions

###   function setTabbing($box)
Set the current tabbing state. This forbids tabbing into a collapsed box.

**Argument:** **$box**

the .boxview jQuery object

---


###   function BoxView($box)
Constructor, which also creates the BoxController

**Argument:** **$box**

the .boxview jQuery object

---


###   BoxView.prototype.reset = function()
reset to the expanded state

---


###   BoxView.prototype.update = function()
update the box with a transition, e.g. after toggling its state

---


###   BoxView.prototype.ontoggle = function()
toggle callback function

---

## Metrics

* 118 Lines
* 2782 Bytes

