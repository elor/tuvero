# scripts/ui/teamsizeview.js


A container with number of buttons with which the team size can be set. The
order of the buttons indicates the team size, starting at 1. The button
representinc the current team size will be selected

* Exports: TeamSizeView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./teamsizecontroller.html">./teamsizecontroller</a>
* <a href="./view.html">./view</a>

## Functions

###   function TeamSizeView(model, $view)
Constructor

**Argument:** **model**

a ValueModel instance which represents the team size

---


###   TeamSizeView.prototype.update = function()
unselect all buttons and select the current one.

When driven by update events, ValueModel.set() should avoid sending events
when the new and old values match, i.e. there's no actual change

---


###   TeamSizeView.prototype.onupdate = function()
Callback function

---

## Metrics

* 55 Lines
* 1383 Bytes

