# scripts/ui/newteamview.js


Represents a form with input elements and submit method, with which a new
team is to be added to the associated ListModel

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend
* <a href="./newteamcontroller.html">./newteamcontroller</a>
* JQuery


## Functions

###   function NewTeamView (model, $view)
Constructor

**Argument:** **model**

a ListModel for containing the teams
**Argument:** **$view**

a form which contains two input elements and a submit button

---


###   NewTeamView.prototype.resetNames = function ()
clear the name input fields

---


###   NewTeamView.prototype.focusEmpty = function ()
focus the first empty or whitespace-only name input field

---


###   NewTeamView.prototype.onreset = function ()
Callback function, after resetting the teams

Note to self: the 'reset' event is fired by the model, which is a ListView
containing the teams. Do not fire 'reset' on this model manually!

---

## Metrics

* 58 Lines
* 1492 Bytes

