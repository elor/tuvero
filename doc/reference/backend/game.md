# scripts/backend/game.js


Game is an object which represents a running game, thereby storing the teams
and the time at which the game started.

@returns Game
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

No Dependencies

## Functions

###   var Game = function (p1, p2, id)
constructor of a Game instance. It simply initiates both variables

---


###   Game.prototype.add = function (team, pid)
add a team member

**Argument:** **team**

id of the team, starting with 0
**Argument:** **pid**

player id

**Returns:** this

---


###   Game.prototype.start = function (time)
set the start time to the given argument or the current time

**Argument:** **time**

(optional) the time to set to. If undefined, the current time is
used.

---


###   Game.prototype.equals = function (game)
deep equal of this and another game.

This function ignores the id

**Argument:** **game**

another game

**Returns:** {Boolean} true if the games are equivalent (save for starttime),
false otherwise

---


###   Game.prototype.copy = function ()
create a deep copy of the game, including the starttime


**Returns:** copy

---


###   Game.copy = function (game)
create a fresh copy from another game instance. This function works without
the proper prototype

**Argument:** **game**

a game object with the typical Game fields, but not necessarily
with the correct prototype

**Returns:** s the newly copied game instance

---


###     function copyTeam (team)

---

## Metrics

* 148 Lines
* 3484 Bytes

