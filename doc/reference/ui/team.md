# scripts/ui/team.js


Managed list of registered teams

* Exports: Team
* Implements: ./csver
* Implements: ../backend/blobber
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./playermodel.html">./playermodel</a>
* <a href="./shared.html">./shared</a>
* <a href="./state_new.html">./state_new</a>
* <a href="./strings.html">./strings</a>
* <a href="./teammodel.html">./teammodel</a>

## Functions

###   Team.create = function(names)
create a new team;

**Argument:** **names**

an array of the player names

**Returns:** this

---


###   Team.get = function(index)
get the team by its index

**Argument:** **index**

index (starting at zero!)

**Returns:** a reference to the registered team on success, undefined otherwise

---


###   Team.erase = function(index)
erase team at index

**Argument:** **index**

index (starting at zero)

**Returns:** nothing at all

---


###   Team.count = function()
returns the number of teams


**Returns:** the number of teams

---


###   Team.toCSV = function()
create ordered CSV strings from team data


**Returns:** CSV file content

---


###         function(team)

---

###   Team.toBlob = function()
stores the current state in a blob, usually using JSON


**Returns:** a serialization of the teams

---


###   Team.fromBlob = function(blob)
restores the state written by toBlob

**Argument:** **blob**

the blob

---


###   Team.reset = function()
resets the teams

---


###   Team.getNames = function(id)
get an array of names of the players in a team

**Argument:** **id**

the id of the team

**Returns:** an array of names

---

## Metrics

* 171 Lines
* 3268 Bytes

