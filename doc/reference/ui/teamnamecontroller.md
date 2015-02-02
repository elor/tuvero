# scripts/ui/teamnamecontroller.js


TeamNameController: Let the user change player names, when she clicks a
player name

* Exports: TeamNameController
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./controller.html">./controller</a>
* lib/extend
* JQuery


## Functions

###   function TeamNameController(view, $input)
Constructor

**Argument:** **view**

a ListView instance with TeamView instances

---


###   TeamNameController.prototype.getPlayer = function($name)
Retrieve the Player instance, which is associated with the $name element

This requires working knowledge of the TeamView structure. So be it.

**Argument:** **$name**

the DOM element which displays the player name

**Returns:** the associated PlayerModel instance

---


###   TeamNameController.prototype.showInputField = function($name)
show the input field in place of a player name

**Argument:** **$name**

the DOM element which displays the player name

---


###   TeamNameController.prototype.hideInputField = function(abort)
detach the input field from the DOM and change/reset the player name

**Argument:** **abort**

if true, the new player name will be discarded

---


###   TeamNameController.prototype.attachInputListeners = function()
attach blur and keydown listeners. This is required to avoid double-blurs,
where the browser sends a second blur event, if an element is detached
within a blur event. Keydown should be fine, but we'll do it anyways.

---


###   TeamNameController.prototype.detachInputListeners = function()
detach blur and keydown listeners. This is required to avoid double-blurs,
where the browser sends a second blur event, if an element is detached
within a blur event. Keydown should be fine, but we'll do it anyways.

---


###   TeamNameController.onNameClicked = function(e)
.name click callback function

**Argument:** **e**

jQuery Event object

---


###   TeamNameController.onInputBlur = function(e)
input blur event: keep the new name

**Argument:** **e**

jQuery Event object

---


###   TeamNameController.onInputKeydown = function(e)
escape or enter key: discard or keep name, respectively

**Argument:** **e**

jQuery Event object

---

## Metrics

* 160 Lines
* 4147 Bytes

