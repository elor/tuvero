# scripts/ui/boxview.js


BoxView for collapsing boxes on click events

* Exports: BoxView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./boxcontroller.html">./boxcontroller</a>
* <a href="./dummymodel.html">./dummymodel</a>
* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend

## Functions

###   function setTabbing ($box)
Set the current tabbing state. This forbids tabbing into a collapsed box.

**Argument:** **$box**

the .box jQuery object

---


###   function BoxView ($box, subview)
Constructor, which also creates the BoxController

**Argument:** **$box**

the .box jQuery object
**Argument:** **subview**

an optional View instance, which will be appended to the box

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

* 118 Lines
* 2887 Bytes

