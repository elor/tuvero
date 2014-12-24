# scripts/backend/tournament.js


Tournament is an interface for generalized management of tournaments. It
assumes unique player ids for every tournament, so the use of global ids is
encouraged.
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./blobber.html">./blobber</a>
* <a href="./game.html">./game</a>
* <a href="./map.html">./map</a>
* <a href="./options.html">./options</a>
* <a href="./ranking.html">./ranking</a>

## Functions

###       addPlayer : function (id)
Add a player to the internal data structures such as maps and arrays.
the ids have to be unique

**Argument:** **id**

unique external player id

**Returns:** this if valid, undefined otherwise

---


###       start : function ()
starts the tournament. This function might block the entry of new
players and is able to create the first valid list of open games


**Returns:** true if valid, undefined otherwise

---


###       end : function ()
ends the tournament, thereby creating the final result and invalidating
most functions


**Returns:** this.getRanking() if valid, undefined otherwise

---


###       finishGame : function (game, points)
apply the result of a running game. This function may manipulate the
list of games in any fashion, thereby generally invalidating the result
of the getGames() function.

**Argument:** **game**

a running or applicable game
**Argument:** **points**

array with points for every team (usually 2)

**Returns:** this

---


###       getGames : function ()
return an array of open games


**Returns:** an array of open games

---


###       getRanking : function ()
return sorted ranking object including the global ids, actual place and
important points and (numeric) annotations in their own arrays


**Returns:** the ranking

---


###       rankingChanged : function ()
Check for changes in the ranking


**Returns:** {boolean} true if the ranking changed, false otherwise

---


###       getState : function ()
Return the current state of the tournament


**Returns:** {Integer} the current state. See Tournament.STATE

---


###       correct : function ()
Incorporate a correction

---


###       getCorrections : function ()
return all corrections as [ game, points before, points after ]

The game.id can be 0, regardless of the actual game id


**Returns:** an array of corrections

---


###       getType : function ()
returns a type identifier, e.g. 'swiss' or 'ko'


**Returns:** a static string describing the tournament type

---

## Metrics

* 144 Lines
* 3901 Bytes

