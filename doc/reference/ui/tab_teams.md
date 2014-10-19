# scripts/ui/tab_teams.js


Model, View and Controller of the teams tab

This tab allows registration, deletion, renaming and printing of teams or
individual players

* Exports: Tab_Teams
* Implements: ./tab
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./autocomplete.html">./autocomplete</a>
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./storage.html">./storage</a>
* <a href="./strings.html">./strings</a>
* <a href="./tab.html">./tab</a>
* <a href="./tab_ranking.html">./tab_ranking</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>
* JQuery


## Functions

###     _changed : function ()

---

###   function trimName (name)

---

###   function updateTeamCounts ()

---

###   function deleteTeam ($team)

---

###   function initDeletion ()

---

###   function deletionPending ()

---

###   function updateDeletion ()

---

###   function initTeamSize ()

---

###   function updateTeamSize ()

---

###   function initTemplate ()

---

###   function createTeamsFromString (str)
reads names from a string and adds the players accordingly. Ignores
#-escaped lines


**Returns:** true on success, undefined or false on failure

---


###   function invalidateFileLoad ()

---

###   function loadFileError (evt)

---

###   function loadFileLoad (evt)

---

###   function loadFileAbort ()

---

###   function initFileLoad ()

---

###   function updateFileLoad ()

---

###   function updateTemplate ()

---

###   function initNewTeam ()

---

###     function readNewTeamNames ()
Retrieves, validates and returns names of new players, resetting the
input fields if valid


**Returns:** array of player names on successful validation, undefined
otherwise

---


###     function createTeamFromForm ()

---

###   function updateNewTeam ()

---

###   function initMaxWidth ()

---

###     function maxwidthtest ()

---

###   function initRename ()

---

###     function chshow ($name)

---

###     function updateTeam ($team)

---

###     function chabort ()

---

###     function chhide ()

---

###   function init ()

---

###   function resetOptions ()

---

###   function createBox (team)
this function adds a new team box to the page

**Argument:** **team**

array of team member names. team number is determined from call
order

---


###   function updateAfterTeamAdd ()

---

###   function updateActiveState ()

---

###   function reset ()
init, clear and reset all in one

---


###   function update ()

---

## Metrics

* 704 Lines
* 15974 Bytes

