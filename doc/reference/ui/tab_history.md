# scripts/ui/tab_history.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="../backend/game.html">../backend/game</a>
* <a href="./boxview.html">./boxview</a>
* <a href="./history.html">./history</a>
* <a href="./koline.html">./koline</a>
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

###     function(Toast, Strings, History, Tournaments, Tab_Ranking, Game, Storage,

---

###       function formatNamesHTML(teamid)

---

###       function createGame(result, $table)
creates a box for the current result in the current round. Note that
the correct round isn't verified (both in the result and currentround)

**Argument:** **result**

a result as returned by history.getGame()
**Argument:** **$table**

the DOM element to append the game to

---


###       function createBye(teamid, $table)
creates a box for a bye within the current round. No round
verification.

**Argument:** **teamid**

id of the team receiving a bye
**Argument:** **$table**

the DOM element to append the Bye to

---


###       function isInt(n)

---

###       function verify(p1, p2)

---

###       function showCorrection()

---

###       function abortCorrection()

---

###       function saveCorrection()

---

###       function initOptions()

---

###         function maxwidthtest()

---

###         function shownamestest()

---

###         function progresstest()

---

###       function initCorrection()

---

###       function initTemplates()

---

###       function initRounds()

---

###       function init()

---

###       function createGamesTable(tournamentid)

---

###       function isNumeric(obj)
borrowed from jQuery

**Argument:** **obj**

the object to verify

**Returns:** true if obj is a number, false otherwise

---


###       function getProgressMapping(tournamentid)
creates a progress mapping, which, for every player, lists every game
in every round, with its result and

**Argument:** **tournamentid**


**Returns:** the progress mapping

---


###         function addGame(round, team, opponent, p1, p2)

---

###       function getTeamVotes(tournamentid)

---

###       function getRankingMapping(tournamentid)

---

###       function createProgressTable(tournamentid)

---

###       function level(id)
Copied from kotournament.js

**Argument:** **id**

the game id

**Returns:** the level of the game id

---


###       function parent(id)
**Argument:** **id**

the game id

**Returns:** the game id of the parent

---


###       function lowestid(level)
**Argument:** **level**

the level

**Returns:** the lowest game id in the level

---


###       function nodesbylevel(level)
**Argument:** **level**

the level

**Returns:** the number of games in this level

---


###       function getGameTreeX(gameid, maxlevel)
return the x coordinate of a game box

**Argument:** **gameid**

the game id
**Argument:** **maxlevel**

the highest level

**Returns:** the x coordinate

---


###       function getGameTreeY(gameid, maxlevel)
return the y coordinate of a game box

**Argument:** **gameid**

the game id
**Argument:** **maxlevel**

the highest level

**Returns:** the y coordinate

---


###       function createGameTreeBox(game, maxid)

---

###       function createKOGameToParentConnector(game, maxid)

---

###       function createKOTree(tournamentid)
create a KO tree box

**Argument:** **tournamentid**

the id of the tournament

**Returns:** true of a game tree tree has been added, false otherwise

---


###               function(game)

---

###       function showTournaments()

---

###       function reset()
remove all evidence of any games ever (from the overview only)

---


###       function update()
removes and redraws all boxes from History

---

## Metrics

* 1046 Lines
* 30699 Bytes

