# scripts/ui/newteamcontroller.js


Controller for adding a new player and handling invalid player names on input

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./controller.html">./controller</a>
* lib/extend
* <a href="./playermodel.html">./playermodel</a>
* <a href="./teammodel.html">./teammodel</a>
* JQuery


## Functions

###     function(extend, Controller, PlayerModel, TeamModel)

---

###       function NewTeamController(view)
Constructor

**Argument:** **view**

the associated NewTeamView

---


###       NewTeamController.prototype.readPlayerNames = function()
reads the playernames from the newteam form


**Returns:** an array of player names

---


###       NewTeamController.prototype.createNewTeam = function()
Add a new team after reading the names from the registered input fields
and push it to this.model, which is supposed to be a ListModel.

If a player name is invalid (whitespace-only or empty), team creation
is aborted and the first invalid input field is focused

---

## Metrics

* 103 Lines
* 2666 Bytes

