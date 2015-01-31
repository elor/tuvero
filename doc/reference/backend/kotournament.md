# scripts/backend/kotournament.js


KO tournament

Complies to Tournament and Blobber interfaces

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./game.html">./game</a>
* <a href="./map.html">./map</a>
* <a href="./options.html">./options</a>
* <a href="./random.html">./random</a>
* <a href="./tournament.html">./tournament</a>

## Functions

###     function(Tournament, Map, Random, Game, Options)

---

###       function left(id)

---

###       function right(id)

---

###       function parent(id)

---

###       function level(id)

---

###       function levelbynodes(numnodes)

---

###       function nodesbylevel(level)

---

###       function numLevels(numnodes)

---

###       function numRounds(numplayers)

---

###       function worstplace(level)

---

###       function lowestid(level)

---

###       KOTournament = function()

---

###       KOTournament.prototype.addPlayer = function(id)

---

###       function matchOrder(numPlayers, byeOrder)
create an array of players where an even-indexed player and the
subsequent player are supposed to be in a game

**Argument:** **numPlayers**

number of players
**Argument:** **byeOrder**

the order in which byes are applied


**Returns:** an array of internal player ids

---


###       function matchRandom(numPlayers, byeOrder)
create a randomized first KO round by manipulating an array returned
from matchOrder()

**Argument:** **numPlayers**

number of players
**Argument:** **byeOrder**

the order in which byes are applied

**Returns:** an array of internal pids

---


###       function createSetOrder(numrounds)
create a set order (map)

This set order is achieved by repeated recursive permutations of a
previously sorted array of participating team ids

**Argument:** **numrounds**

number of rounds


**Returns:** an array of indices for initial order

---


###       function matchSet(numPlayers, byeOrder)
create a first round of games of players by permutation of matchOrder()
results

**Argument:** **numPlayers**

number of players
**Argument:** **byeOrder**

the order in which byes are applied


**Returns:** an array of internal pids

---


###       KOTournament.prototype.start = function()

---

###       KOTournament.prototype.end = function()

---

###       KOTournament.prototype.finishGame = function(game, points)

---

###       function checkforGame(pid, gameid)

---

###       KOTournament.prototype.getGames = function()

---

###       KOTournament.prototype.getRanking = function()

---

###       KOTournament.prototype.rankingChanged = function()

---

###       KOTournament.prototype.getState = function()

---

###       KOTournament.prototype.correct = function()

---

###       KOTournament.prototype.toBlob = function()

---

###       KOTournament.prototype.fromBlob = function(blob)

---

###       KOTournament.prototype.getType = function()

---

###       KOTournament.prototype.getCorrections = function()

---

## Metrics

* 461 Lines
* 11839 Bytes

