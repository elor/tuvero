# scripts/ui/teammodel.js


A combination of players is a team. A team should contain at least one player

* Exports: TeamModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/model.html">./interfaces/model</a>
* lib/extend
* <a href="./playermodel.html">./playermodel</a>

## Functions

###   function TeamModel (players, id)
Constructor

**Argument:** **players**

an array of PlayerModel instances
**Argument:** **id**

a preferably unique numeric team id

---


###   TeamModel.prototype.getPlayer = function (id)
retrieve a single player. For the number of players, see
TeamModel.prototype.length

**Argument:** **id**

the index of the player inside the team

**Returns:** s a PlayerModel reference

---


###   TeamModel.prototype.getID = function ()
retrieve the id of the team


**Returns:** s the id of the team

---


###   TeamModel.prototype.setID = function (id)
change the id of the team, e.g. after removing another team

**Argument:** **id**

a preferably unique numeric team id

---


###   TeamModel.prototype.onupdate = function ()
Callback listener

One of the player names was updated. This is passed through to the team
event emitter.


---

## Metrics

* 90 Lines
* 2011 Bytes

