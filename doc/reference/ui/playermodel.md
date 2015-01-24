# scripts/ui/playermodel.js


A Model for each single Player

* Exports: PlayerModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/model.html">./interfaces/model</a>
* lib/extend

## Functions

###   function trimName (name)
remove extra white spaces from a player name

**Argument:** **name**

the name

**Returns:** s a trimmed version of the name

---


###   function PlayerModel (name)
Constructor

**Argument:** **name**

the player name

---


###   PlayerModel.prototype.getName = function ()
retrieve a copy of the player name


**Returns:** s a copy of the player name

---


###   PlayerModel.prototype.setName = function (name)
change the player name. Invalid player names (empty or whitespace only)
will be ignored

**Argument:** **name**

the new name

---

## Metrics

* 62 Lines
* 1310 Bytes

