# scripts/ui/newteamview.js


Represents a form with input elements and submit method, with which a new
team is to be added to the associated ListModel

* Exports: NewTeamView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./newteamcontroller.html">./newteamcontroller</a>
* <a href="./view.html">./view</a>
* JQuery


## Functions

###     function(extend, View, NewTeamController)

---

###       function NewTeamView(model, $view, teamsize)
Constructor

**Argument:** **model**

a ListModel for containing the teams
**Argument:** **$view**

a form which contains two input elements and a submit button
**Argument:** **teamsize**

Optional. A ValueModel instance which represents the team
size.

---


###       NewTeamView.prototype.resetNames = function()
clear the name input fields

---


###       NewTeamView.prototype.focusEmpty = function()
focus the first empty or whitespace-only name input field

---


###       NewTeamView.prototype.updateTeamSize = function()
update the entry team size by enabling/disabling the input fields

---


###       NewTeamView.prototype.onreset = function()
Callback function, after resetting the teams

Note to self: the 'reset' event is fired by the model, which is a
ListView containing the teams. Do not fire 'reset' on this model
manually!

---


###       NewTeamView.prototype.onupdate = function(emitter)
Callback function

**Argument:** **emitter**


---

## Metrics

* 120 Lines
* 3220 Bytes

