# scripts/ui/history.js


History of game results and votes for all tournaments.

* Implements: ../backend/blobber
* Exports: History
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./shared.html">./shared</a>
* <a href="./tournaments.html">./tournaments</a>

## Functions

###   function getTournament (id, alloc)

---

###     addResult : function (tournamentid, t1, t2, p1, p2, round, id)

**Argument:** **tournamentid**

the id of the game's tournament
**Argument:** **t1**

team 1
**Argument:** **t2**

team 2
**Argument:** **p1**

points of team 1
**Argument:** **p2**

points of team 2
**Argument:** **round**

(optional) the round within its subtournament
**Argument:** **id**

(optional) the game id within its round

**Returns:** : true on success, false otherwise

---


###     addCorrection : function (tournamentid, before, after)

**Argument:** **tournamentid**

**Argument:** **before**

an object containing similar to what you get from getGame
**Argument:** **after**

an object containing similar to what you get from getGame

**Returns:** true on success, false otherwise

---


###     addVote : function (tournamentid, type, team, round)

---

###     numGames : function (tournamentid)

**Argument:** **tournamentid**

the tournament id

**Returns:** undefined on failure, number of finished games in this
tournament otherwise

---


###     getVotes : function (tournamentid)
Return all votes, for the user to search. This is way simpler than some
artificial restriction

Do not manipulate!

**Argument:** **tournamentid**

the tournament id

**Returns:** the raw votes array of this tournament and round

---


###     numCorrections : function (tournamentid)

**Argument:** **tournamentid**

the tournament id

**Returns:** undefined on failure, number of corrections in this tournament
otherwise

---


###     numRounds : function (tournamentid)

---

###     getGame : function (tournamentid, id)
returns the raw data of this game for further viewing.

Do not manipulate! Use corrections instead!

**Argument:** **tournamentid**

the id of the tournament
**Argument:** **id**

the game id

**Returns:** the array containing game information on success, undefined
otherwise

---


###     getGames : function (tournamentid)

---

###     getRound : function (tournamentid, round)
get all games of a specific round.

Do not manipulate!

**Argument:** **tournamentid**

the tournament id
**Argument:** **round**

the round within its tournament

**Returns:** 

---


###     findGames : function (tournamentid, t1, t2)
get all games of a specific round.

Do not manipulate!

**Argument:** **tournamentid**

the tournament id
**Argument:** **t1**

team id 1
**Argument:** **t2**

team id 2

**Returns:** 

---


###     getCorrection : function (tournamentid, id)
returns a raw correction object for further viewing

Do not manipulate! Use Tournaments.getTournament(tournamentid).correct()
for that!

**Argument:** **tournamentid**

the tournament id
**Argument:** **id**

the correction id

**Returns:** a raw correction array on success, undefined otherwise

---


###     getCorrections : function (tournamentid)

---

###     numTournaments : function ()

---

###     reset : function ()

---

###     toCSV : function ()
CSV exporter

Tournament Comment Line Format: 'name Round roundno'

Game Format:
'No1,No2,Name1_1,Name1_2,Name1_3,Names2_1,Names2_2,Names2_3,Points1,Points2'

VoteFormat: 'No1,Name1,Name2,Name3,Type'


**Returns:** a comma-separated-values compatible History representation

---


###     toBlob : function ()
Serializer.


**Returns:** a string representation of the data

---


###     fromBlob : function (blob)
Deserializer.

**Argument:** **blob**

a string represention with which to replace the current data

---

## Metrics

* 509 Lines
* 13712 Bytes

