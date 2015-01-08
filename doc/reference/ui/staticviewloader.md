# scripts/ui/staticviewloader.js


Recursively traverse the DOM and initiate all non-template static views by a
class keyword, which is also used by the stylesheet. The applicable Views
have to be registered beforehand.

In theory, a DOM element can have multiple views assigned.

Templated views have to be initiated programmatically.

* Exports: StaticViewLoader
* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./type.html">./type</a>
* JQuery


## Functions

###   function loadViewByClass ($elem, classname)
initiates the actual view

**Argument:** **$elem**

a jQuery element
**Argument:** **classname**

the applicable class

**Returns:** s nothing (i.e. undefined)

---


###   function checkAllClasses ($elem)
Matches the classes of a DOM element against the registered views. If an
applicable view is found, another instantiation function is called.

**Argument:** **$elem**

the jQUery element

**Returns:** s nothing (i.e. undefined)

---


###     registerView : function (name, constructor)
register a view for later auto-assignment by the loadViews() function

**Argument:** **name**

the name of the view
**Argument:** **constructor**

the constructor of the view, which only requires a jQuery
element as an argument

**Returns:** s StaticViewLoader

---


###     loadViews : function ($elem)
Recursively assigns Views to DOM elements by their classes. Skips
elements with the class 'template'

**Argument:** **$elem**

the jQuery container element

**Returns:** s StaticViewLoader

---

## Metrics

* 104 Lines
* 2497 Bytes

