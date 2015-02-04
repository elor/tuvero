# scripts/ui/teamtableview.js


TeamTableView

TODO extract the teamsize logic to a ClassView+IsEmptyModel (or something)

TODO make this a general TableView, which inherits from ListView and hides as
soon as the list is empty

* Exports: TeamTableView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./view.html">./view</a>
* JQuery


## Functions

###   function TeamTableView(teamview, teamsize)
Constructor

**Argument:** **teamview**

a ListView of the table
**Argument:** **teamsize**

a ValueModel instance of the team size

---


###   TeamTableView.prototype.updatePlayerColumns = function()
show one column for each player in a team (teamsize)

---


###   TeamTableView.prototype.updateVisibility = function()
hide the whole table if there's no player; show it as soon as a player has
been registered

---


###   TeamTableView.prototype.onupdate = function()
the team size changed. check player column visibility

---


###   TeamTableView.prototype.onresize = function()
the number of teams changed. update the visibility

---

## Metrics

* 84 Lines
* 1976 Bytes

