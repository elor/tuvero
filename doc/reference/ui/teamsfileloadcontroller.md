# scripts/ui/teamsfileloadcontroller.js


TeamsFileLoadController

TODO rewrite the whole thing and extract a lot of methods

* Exports: TeamsFileLoadController
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./controller.html">./controller</a>
* lib/extend
* <a href="./state_new.html">./state_new</a>
* <a href="./strings.html">./strings</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>

## Functions

###   function TeamsFileLoadController(view)
Constructor

**Argument:** **view**

an InputView instance of a filereader input

---


###   TeamsFileLoadController.createTeamsFromString = function(str)
reads names from a string and adds the players accordingly. Ignores
#-escaped lines


**Returns:** true on success, undefined or false on failure

---


###   TeamsFileLoadController.prototype.reset = function()

---

###   TeamsFileLoadController.loadFileError = function(evt)

---

###   TeamsFileLoadController.loadFileLoad = function(evt)

---

###   TeamsFileLoadController.loadFileAbort = function()

---

###   TeamsFileLoadController.prototype.init = function()

---

## Metrics

* 176 Lines
* 4825 Bytes

