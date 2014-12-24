# scripts/ui/listmodel.js


A model for listed content, which may be extended for practical use cases

* Exports: ListModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./interfaces/model.html">./interfaces/model</a>
* lib/extend

## Functions

###   function ListModel ()
Constructor

---


###   ListModel.prototype.getItem = function (index)
Get a reference to the object at the given index

**Argument:** **index**

Index of the element

**Returns:** s an object representing the item at the given index

---


###   ListModel.prototype.numItems = function ()
get the number of items


**Returns:** s the number of Items. Less or equal 0 indicates an empty list

---

## Metrics

* 42 Lines
* 920 Bytes

