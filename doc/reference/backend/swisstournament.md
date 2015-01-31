# scripts/backend/swisstournament.js


Implementation of the swiss tournament system where there's only one player.
If you need teams, first consider to enter a team as a single player before
rewriting for multi-player teams, which are only useful for random teams.
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./correction.html">./correction</a>
* <a href="./finebuchholzranking.html">./finebuchholzranking</a>
* <a href="./game.html">./game</a>
* <a href="./map.html">./map</a>
* <a href="./options.html">./options</a>
* <a href="./random.html">./random</a>
* <a href="./result.html">./result</a>
* <a href="./rleblobber.html">./rleblobber</a>
* <a href="./tournament.html">./tournament</a>

## Functions

###   Swisstournament = function()
constructor


**Returns:** {Swisstournament}

---


###   Swisstournament.prototype.addPlayer = function(id)
(implemented tournament function)

**Argument:** **id**


**Returns:** 

---


###   Swisstournament.prototype.start = function()
(implemented tournament function)


**Returns:** this on success, undefined otherwise

---


###   Swisstournament.prototype.end = function()
(implemented tournament function)


**Returns:** 

---


###   Swisstournament.prototype.finishGame = function(game, points)
(implemented tournament function)

**Argument:** **game**

**Argument:** **points**


**Returns:** 

---


###   Swisstournament.prototype.getGames = function()
(implemented tournament function)


**Returns:** {Array}

---


###   function getRoundVotes()
return the up/down/byevotes of the current round


**Returns:** an object containing the three votes

---


###   Swisstournament.prototype.getRanking = function()
(implemented tournament function)


**Returns:** 

---


###   function newRoundByRandom()
Start a new round. This function creates a randomized set of new games,
disregarding the players' ids and previous games


**Returns:** this on success, undefined otherwise

---


###   function newRoundByHalves()
Start a new round. This function creates a randomized set of new games,
maintaining up/down/byevotes.


**Returns:** this on success, undefined otherwise

---


###   function newRoundByWins()
Start a new round. This function creates a randomized set of new games,
maintaining up/down/byevotes.


**Returns:** this on success, undefined otherwise

---


###   function applyVotes(votes)
**Argument:** **votes**

processed votes structure as returned by preliminaryDownVotes()
and processed by newRoundByWins()

**Returns:** {Swisstournament} this

---


###   function winGroups()
Build a 2d array of wingroups. Outer key is the number of wins (0+), values
in inner array are internal player ids


**Returns:** 2d array of wingroups

---


###   function clearRoundvotes()

---

###   function preliminaryDownVotes(wingroups)
create a list of players to downvote/byevote using the given wingroups

**Argument:** **wingroups**

wingroups as returned by winGroups()

**Returns:** An object containing byevote, downvotes and an empty array of
upvotes. The key of the downvote array is the number of wins this
player has been voted from.

---


###     fillCandidates = function(pid)

---

###       fillCandidates = function(pid)

---

###   function canVote(id, permissions)
**Argument:** **id**

internal player id
**Argument:** **permissions**

reference to this.options.permissions.something

**Returns:** {Boolean} whether vote action complies with the permissions

---


###   function canDownVote(id)
**Argument:** **id**

internal player id

**Returns:** true of the player can be downvoted, false otherwise

---


###   function canUpVote(id)
**Argument:** **id**

internal player id

**Returns:** true of the player can be upvoted, false otherwise

---


###   function canByeVote(id)
**Argument:** **id**

internal player id

**Returns:** true of the player can be byevoted, false otherwise

---


###   function downVote(id)
**Argument:** **id**

internal player id to downvote

**Returns:** {Swisstournament} this

---


###   function upVote(id)
**Argument:** **id**

internal player id to be upvoted

**Returns:** {Swisstournament} this

---


###   function byeVote(id)
**Argument:** **id**

internal player id to be byevoted

**Returns:** {Swisstournament} this

---


###   function canPlay(pid1, pid2)
Verify whether two players can play against another

**Argument:** **pid1**

internal id of first player
**Argument:** **pid2**

iternal id of second player

**Returns:** {Boolean} true if they would form a valid game, false otherwise

---


###   Swisstournament.prototype.correct = function(game, oldpoints, newpoints)
correct the result of a game. Since the games are determined by the
tournament itself, there's no need to correct the team

**Argument:** **game**

the game
**Argument:** **oldpoints**

array of faulty points
**Argument:** **newpoints**

array of corrected points

**Returns:** {Swisstournament} undefined on failure, this otherwise

---


###   Swisstournament.prototype.getCorrections = function()
build a list of corrections which are consistent in format with the
correct() function


**Returns:** a list of correction objects

---


###   Swisstournament.prototype.toBlob = function()
stores the current state in a blob, mostly using JSON (


**Returns:** the blob

---


###   Swisstournament.prototype.fromBlob = function(blob)
restores a state from the blob

**Argument:** **blob**

the blob

---


###     function copyGame(game)

---

###   Swisstournament.prototype.getState = function()

---

###   Swisstournament.prototype.rankingChanged = function()

---

###   function toType(obj)

---

###   function copyStaticObject(obj)

---

###   Swisstournament.prototype.getType = function()

---

## Metrics

* 1137 Lines
* 29066 Bytes

