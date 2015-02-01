# scripts/ui/listmodel.js


A list object, which contains numerically indexed values for use with other
MVC classes

* Exports: ListModel
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* lib/extend
* <a href="./model.html">./model</a>

## Functions

###   function ListModel()
Constructor for an empty list

---


###   ListModel.prototype.push = function(object)
push() function, which appends an object to the end of the list

**Argument:** **object**

an object which will be appended to the list

**Returns:** the new length of the array

---


###   ListModel.prototype.pop = function()
remove the last element of the array and returns it


**Returns:** the previously last element of the array, which has been removed
during this function call

---


###   ListModel.prototype.insert = function(index, object)
insert an object at the specified index

**Argument:** **index**

the index at which to insert the object
**Argument:** **object**

the object, which will take the specified index after insertion

---


###   ListModel.prototype.remove = function(index)
removes the object at the specified index from the list

**Argument:** **index**

the index from which to remove from the list

**Returns:** the removed object

---


###   ListModel.prototype.clear = function()
removes everything in the array.

---


###   ListModel.prototype.indexOf = function(object)
finds the index of an object, if available.

**Argument:** **object**

the object to look for

**Returns:** the index of the object in the array, or -1 otherwise

---


###   ListModel.prototype.get = function(index)
access the element at the specified index

**Argument:** **index**

the index within the list

**Returns:** the object at the specified index

---


###   ListModel.prototype.set = function(index, object)
overwrites (i.e. removes and inserts) an object at the specified index

**Argument:** **index**

the index within the list
**Argument:** **object**

the object with which to overwrite the index

**Returns:** the inserted object, of undefined on failure

---


### function(object, index, list)
for each element in the list, run the specified function. The return values
of the function are accumulated and returned as an array

**Argument:** **callback**


###   ListModel.prototype.map = function(callback, thisArg)

---

###   ListModel.prototype.asArray = function()
returns the contents of the list as an array


**Returns:** the contents of the list as an array

---


###   ListModel.prototype.updateLength = function()
update the length variable of the list. Used internally.

---


###   ListModel.prototype.oninsert = function()
Callback function: called when an 'insert' event is emitted

---


###   ListModel.prototype.onremove = function()
Callback function: called when a 'remove' event is emitted

---


###   ListModel.prototype.onreset = function()
Callback function: called when a 'reset' event is emitted

---

## Metrics

* 224 Lines
* 5097 Bytes

