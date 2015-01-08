# scripts/ui/tab_history.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="../backend/game.html">../backend/game</a>
* <a href="./boxview.html">./boxview</a>
* <a href="./history.html">./history</a>
* lib/jsPlumb
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./storage.html">./storage</a>
* <a href="./strings.html">./strings</a>
* <a href="./tab.html">./tab</a>
* <a href="./tab_ranking.html">./tab_ranking</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>
* <a href="./tournaments.html">./tournaments</a>
* JQuery


## Functions

###   function formatNamesHTML (teamid)

---

###   function createGame (result, $table)
creates a box for the current result in the current round. Note that the
correct round isn't verified (both in the result and currentround)

**Argument:** **result**

a result as returned by history.getGame()

---


###   function createBye (teamid, $table)
creates a box for a bye within the current round. No round verification.

**Argument:** **teamid**

id of the team receiving a bye

---


###   function isInt (n)

---

###   function verify (p1, p2)

---

###   function showCorrection ()

---

###   function abortCorrection ()

---

###   function saveCorrection ()

---

###   function initOptions ()

---

###     function maxwidthtest ()

---

###     function shownamestest ()

---

###     function progresstest ()

---

###   function initCorrection ()

---

###   function initTemplates ()

---

###   function initRounds ()

---

###   function init ()

---

###   function createGamesTable (tournamentid)

---

###   function isNumeric (obj)
borrowed from jQuery

---


###   function getProgressMapping (tournamentid)
creates a progress mapping, which, for every player, lists every game in
every round, with its result and

**Argument:** **tournamentid**


**Returns:** the progress mapping

---


###     function addGame (round, team, opponent, p1, p2)

---

###   function getTeamVotes (tournamentid)

---

###   function getRankingMapping (tournamentid)

---

###   function createProgressTable (tournamentid)

---

###   function level (id)
Copied from kotournament.js

---


###   function parent (id)

---

###   function lowestid (level)

---

###   function nodesbylevel (level)

---

###   function getGameTreeX (gameid, maxlevel)
end (Copied from kotournament.js)

---


###   function getGameTreeY (gameid, maxlevel)

---

###   function createGameTreeBox (game, maxid)

---

###   function createKOTree (tournamentid)

---

###   function addKOGamesEndpoints ($game, jsPlumbInstance)

---

###   function connectKOGames ($left, $right, jsPlumbInstance)

---

###   function showTournaments ()

---

###   function reset ()
remove all evidence of any games ever (from the overview only)

---


###   function update ()
removes and redraws all boxes from History

---

## Metrics

* 982 Lines
* 26972 Bytes

