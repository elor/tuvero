# scripts/backend/result.js


A Result represents the outcome of a game with two teams, usually including
one to three players.

@param team1
         Array of player ids of the first team. Creates an internal copy.
@param team2
         Array of player ids of the second team. Creates an internal copy.
@param points1
         {Integer} Points of the first team
@param points2
         {Integer} Points of the second team
* Exports: the newly constructed Result object
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./game.html">./game</a>

## Functions

###   var Result = function(team1, team2, points1, points2)

---

###   Result.prototype.getTeam = function(number)
getTeam() returns the team array

**Argument:** **number**

{Integer} team number (1 or 2)

**Returns:** {[Integer]} list of player ids or undefined if invalid number

---


###   Result.prototype.getPoints = function(teamnumber)
getPoints() returns the points for the given team

**Argument:** **teamnumber**

{Integer} team number (1 or 2)

**Returns:** {Integer} points of the given team or undefined if invalid team
number

---


###   Result.prototype.setPoints = function(teamnumber, points)
point setter

**Argument:** **teamnumber**

1 or 2
**Argument:** **points**

points

**Returns:** {Result} undefined on failure, this otherwise

---


###   Result.prototype.getNetto = function()
getNetto() returns the difference between the team's points


**Returns:** {Number} gained netto points for first team

---


###   Result.prototype.copy = function()
copies this


**Returns:** the copy

---


###   Result.prototype.getGame = function()
Creates a Game instance from the teams


**Returns:** {Game} the game that lead to this result, excluding the correct
start time.

---


###   Result.copy = function(res)
creates an identical copy of a Result instance

**Argument:** **res**

raw Result object, not necessarily with appropriate prototype and
functions. Fields are sufficient.

**Returns:** the copy

---

## Metrics

* 146 Lines
* 3431 Bytes

