# scripts/ui/team.js


a list of teams with some accessor functions
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./options.html">./options</a>
* <a href="./shared.html">./shared</a>
* <a href="./strings.html">./strings</a>

## Functions

###   Team.create = function (names)
create a new team;

---


###   Team.get = function (index)
get the team by its index

**Argument:** **index**

index (starting at zero!)

**Returns:** a reference to the registered team on success, undefined otherwise

---


###   Team.erase = function (index)
erase team at index

**Argument:** **index**

index (starting at zero)

**Returns:** nothing at all

---


###   Team.prepareTournament = function (Tournament)
adds all players to the tournament

---


###   Team.count = function ()
returns the number of teams


**Returns:** the number of teams

---


###   Team.size = function ()
fallback for the C++ user in me

---


###   Team.toCSV = function ()
create ordered CSV strings from team data


**Returns:** CSV file content

---


###   Team.toBlob = function ()
stores the current state in a blob, usually using JSON


**Returns:** the blob

---


###   Team.fromBlob = function (blob)
restores the state written by toBlob

**Argument:** **blob**

the blob

---


###   Team.reset = function ()
resets the teams

---

## Metrics

* 144 Lines
* 2736 Bytes

