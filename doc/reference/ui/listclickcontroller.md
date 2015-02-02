# scripts/ui/listclickcontroller.js


on a list element click, runs the callback function

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./controller.html">./controller</a>
* lib/extend
* <a href="./valuemodel.html">./valuemodel</a>
* JQuery


## Functions

###   function ListClickController(view, callback, cbthis, selector, active)
Constructor

**Argument:** **view**

a ListView instance
**Argument:** **callback**

the callback function: callback(model, index)
**Argument:** **cbthis**

Optional. passed as "this" to the callback function
**Argument:** **selector**

Optional. A CSS selector, relative to view.$view. Defaults to '>',
i.e. the list elements   * **Argument:** **active**

Optional. A ValueModel instance, which indicates whether removals
are allowed at the moment. Defaults to true

---

## Metrics

* 56 Lines
* 1585 Bytes

