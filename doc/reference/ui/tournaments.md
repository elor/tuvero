# scripts/ui/tournaments.js


Tournaments is a list of _running_ tournaments, with null entries for
finished tournaments, but still keeping name and type information
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="../backend/kotournament.html">../backend/kotournament</a>
* <a href="../backend/swisstournament.html">../backend/swisstournament</a>
* <a href="./shared.html">./shared</a>
* <a href="./team.html">./team</a>

## Functions

###   function createTournament (type, blob)

---

###   Tournaments.getStartRank = function (tournamentid, countchildren)

---

###   Tournaments.numTeamsLeft = function (tournamentid)

---

###   Tournaments.addTournament = function (type, numteams, parent)

---

###   Tournaments.removeTournament = function (tournamentid)

---

###   Tournaments.getParent = function (tournamentid)

---

###   Tournaments.getRankingOrder = function ()
performs an inefficient left-traversal of the tournament tree and returns
the ranking order (left-right-parent)


**Returns:** an array with tournament ids, sorted by their logical global
ranking order

---


###   Tournaments.numTournaments = function ()

---

###   Tournaments.setName = function (id, name)

---

###   Tournaments.getName = function (id)

---

###   Tournaments.getType = function (id)

---

###   Tournaments.getTeams = function (id)

---

###   Tournaments.getRanking = function (tournamentid)

---

###   Tournaments.getTournament = function (id)

---

###   Tournaments.getTournamentID = function (Tournament)

---

###   Tournaments.isRunning = function (id)

---

###   Tournaments.endTournament = function (id)
ends a tournament and removes its instance from this object

**Argument:** **id**


**Returns:** true on success, undefined otherwise

---


###   Tournaments.toBlob = function ()

---

###   Tournaments.fromBlob = function (blob)

---

###   Tournaments.reset = function ()

---

## Metrics

* 337 Lines
* 8288 Bytes

