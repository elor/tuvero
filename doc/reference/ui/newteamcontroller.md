# scripts/ui/newteamcontroller.js


Controller for adding a new player and handling invalid player names on input

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/controller.html">./interfaces/controller</a>
* lib/extend
* <a href="./playermodel.html">./playermodel</a>
* <a href="./teammodel.html">./teammodel</a>
* JQuery


## Functions

###   function NewTeamController(view)
Constructor

**Argument:** **view**

the associated NewTeamView

---


###   NewTeamController.prototype.createNewTeam = function()
Add a new team after reading the names from the registered input fields and
push it to this.model, which is supposed to be a ListModel.

If a player name is invalid (whitespace-only or empty), team creation is
aborted and the first invalid input field is focused

---

## Metrics

* 73 Lines
* 1762 Bytes

