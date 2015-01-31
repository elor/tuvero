# scripts/ui/teamview.js


A teamView, which sets the .teamno and .name elements of the associated DOM
element

* Exports: TeamView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend

## Functions

###   function TeamView(model, $view)
Constructor

**Argument:** **model**

a TeamModel instance
**Argument:** **$view**

the associated DOM element

---


###   TeamView.prototype.update = function()
write the playernames and teamnumber to the DOM

---


###   TeamView.prototype.onupdate = function()
Callback listener

---

## Metrics

* 59 Lines
* 1195 Bytes

