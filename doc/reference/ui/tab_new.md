# scripts/ui/tab_new.js


Model, View and Controller of the "new" tab, which manages the tournaments.

This tab allows allocating teams to (sub)tournaments, setting their rules and
starting/closing them

* Exports: Tab_New
* Implements: ./tab
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="../backend/tournament.html">../backend/tournament</a>
* <a href="./boxview.html">./boxview</a>
* <a href="./data/swissperms.html">./data/swissperms</a>
* <a href="./globalranking.html">./globalranking</a>
* <a href="./history.html">./history</a>
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./storage.html">./storage</a>
* <a href="./strings.html">./strings</a>
* <a href="./tab.html">./tab</a>
* <a href="./tab_games.html">./tab_games</a>
* <a href="./tab_history.html">./tab_history</a>
* <a href="./tab_ranking.html">./tab_ranking</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>
* <a href="./tournaments.html">./tournaments</a>
* JQuery


## Functions

###   function getRoundVotes(Tournament)
translates the Tournament ranking into a traditional votes object

TODO rewrite this file to replace this function

**Argument:** **Tournament**

the swiss object

**Returns:** {Object} a votes object of the current round

---


###   function initTemplate()

---

###   function initRename()

---

###     function chshow($name)

---

###     function updateName()

---

###     function chabort()

---

###   function initRemove()

---

###   function resetTeams()

---

###   function resetSystems()

---

###   function updateTeams()

---

###   function setSystemState($system, tournamentid)

---

###   function getAnchors(tournamentid)

---

###   function getHeight(tournamentid)

---

###   function createSystemAnchor(tournamentid)

---

###   function initKO($ko, tournamentid)

---

###   function initTournamentNameChange(tournamentid)

---

###   function createTournamentBox($anchor, tournamentid)

---

###   function createSelectionBox($anchor)

---

###   function setSystemTitle($anchor)

---

###   function updateSystems()

---

###   function addNewSystem(type, numteams, parentid)

---

###   function initNewsystem($system)
prepare Newsystem management box, which starts a new tournament round

**Argument:** **$system**

the DOM element which contains the tournament System information

---


###     function numTeams()

---

###   function initSwiss($swiss, tournamentid)
prepare a swiss tournament management box

**Argument:** **$swiss**

the DOM object which holds the Swiss System
**Argument:** **tournamentid**

the tournament id of the swiss tournament

---


###             function()

---

###   function initBoxes($container)

---

###   function setPermissionPreset(preset, $perms)

---

###   function getPermissions($perms, Swiss)

---

###   function setPermissions($perms, Swiss)

---

###   function queryPerms($swiss)

---

###   function setSwissMode($modeselect, Swiss)

---

###   function getSwissMode($modeselect, Swiss)

---

###   function setKOMode($modeselect, KO)

---

###   function getKOMode($modeselect, KO)

---

###   function initOptions()

---

###     function maxwidthtest()

---

###     function shownamestest()

---

###   function init()

---

###   function reset()

---

###   function closeTeamRegistration()

---

###   function update()

---

## Metrics

* 830 Lines
* 21535 Bytes

