# scripts/ui/tab_games.js


Model, View and Controller for the games tab.

This tab views the games, allows input of game results and submits them to
the respective tournaments

* Exports: Tab_Games
* Implements: ./tab
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./boxview.html">./boxview</a>
* <a href="./history.html">./history</a>
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./storage.html">./storage</a>
* <a href="./strings.html">./strings</a>
* <a href="./tab.html">./tab</a>
* <a href="./tab_history.html">./tab_history</a>
* <a href="./tab_ranking.html">./tab_ranking</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./tab_teams.html">./tab_teams</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>
* <a href="./tournaments.html">./tournaments</a>
* JQuery


## Functions

###     function (Team, Toast, Strings, Tab_Teams, Tab_Ranking, History,

---

###       function isInt (n)

---

###       function initGameTemplate ()

---

###       function initVoteTemplate ()
disable/enable the submit button if input is valid

---


###       function initTemplates ()

---

###       function appendGame (game, tournamentid, $box)
create and show a box displaying a certain game

**Argument:** **game**

the game object
**Argument:** **tournamentid**

the tournament id
**Argument:** **$box**

the DOM object to append this game to

---


###       function clearBoxes ()
removes all games from the overview

---


###       function showRunning ()
clears the overview and appends all open games of the tournament


**Returns:** s true if something has been added to the DOM, false otherwise

---


###       function showTab ()

---

###       function getTournamentID ($game)

---

###       function removeGame (tournamentid, index)
this function removes the game from the local reference arrays

**Argument:** **tournamentid**

the tournament id
**Argument:** **index**

the index of the game

**Returns:** true on success, undefined otherwise

---


###       function readResults ($container)

---

###       function finishGame ()
jQuery callback function. works with "this"


**Returns:** s false all the time, although there's no reason to

---


###       function createVoteBox (tid)

---

###       function getRoundVotes (Tournament)
translates the Swiss ranking into a traditional votes object

TODO rewrite this file to replace this function

**Argument:** **Tournament**

the tournament object for which to retrieve the downvotes

**Returns:** {Object} a votes object of the current round

---


###       function showVotes (Tournament, $box)
display the votes for the current round

**Argument:** **Tournament**

the tournament object
**Argument:** **$box**

the box to add stuff to

**Returns:** s true if something has been added to the box, false otherwise

---


###       function initOptions ()

---

###         function maxwidthtest ()

---

###         function shownamestest ()

---

###       function init ()

---

###       function reset ()
reset an original state.

---


###       function update ()
reset an original game state, respecting the current state of Swiss

---

## Metrics

* 638 Lines
* 17358 Bytes

