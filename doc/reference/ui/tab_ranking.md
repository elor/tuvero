# scripts/ui/tab_ranking.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./history.html">./history</a>
* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./strings.html">./strings</a>
* <a href="./tab.html">./tab</a>
* <a href="./tabshandle.html">./tabshandle</a>
* <a href="./team.html">./team</a>
* <a href="./toast.html">./toast</a>
* <a href="./tournaments.html">./tournaments</a>
* JQuery


## Functions

###   function initTemplate ()

---

###   function updateTemplate ()

---

###   function init ()

---

###   function createRankRow (rank, ranking)
fill template and return copy

**Argument:** **rank**

rank of the team for which to create the line. starting at 0
**Argument:** **ranking**

a valid ranking object
**Argument:** **votes**

a valid votes object

**Returns:** a filled copy of the template

---


###   function showRanking (tournamentid, $box)

**Returns:** {boolean} false on failure, true on success

---


###   function showCorrections (tournamentid, $box)
retrieves the corrections and displays them in the correction table

---


###   function reset ()

---

###   function CHEAPHACKcollapseBox($box)

---

###   function updateTournamentRankings ()

---

###   function update ()

---

## Metrics

* 282 Lines
* 7140 Bytes

