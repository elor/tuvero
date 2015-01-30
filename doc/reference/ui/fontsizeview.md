# scripts/ui/fontsizeview.js


Font Size View: A widget for controlling the font size.

The FontSizeModel is unique for every DOM element and can be retrieved and
controlled using a static function.

TODO allow for arbitrary font sizes

@returns FontSizeView
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./fontsizecontroller.html">./fontsizecontroller</a>
* <a href="./fontsizemodel.html">./fontsizemodel</a>
* <a href="./interfaces/view.html">./interfaces/view</a>
* lib/extend
* JQuery


## Functions

###   function FontSizeView ($view, $container)
Constructor, which also calls update() for the first time

**Argument:** **$view**

the container of the widget
**Argument:** **$container**

the container of the size-adjusted text. If undefined, it defaults
to <body>

---


###   FontSizeView.prototype.reset = function ()
removes all font size information

---


###   FontSizeView.prototype.update = function ()
sets the current font size, as defined by the model

---


###   FontSizeView.prototype.onupdate = function ()
model.emit() callback function

---


###   FontSizeView.getModelOfContainer = function ($container)
Retrieves the model for the given container. Allocates a new FontSizeModel,
if not set yet.

**Argument:** **$container**

the container

**Returns:** s the model for the given container

---

## Metrics

* 86 Lines
* 2219 Bytes

