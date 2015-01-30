# scripts/ui/koline.js


No Description

* Author: Erik E. Lorenz 
* Mail: <erik.e.lorenz@gmail.com>
* License: MIT License


## Dependencies

* <a href="./strings.html">./strings</a>

## Functions

###   function generateCacheID (from, midx, to)

---

###   function styleToString (style)
converts a style object to a style attribute string

TODO move to its own tiny CSS library?

**Argument:** **style**

a style object

**Returns:** s a combined string of the styles, as used by the HTML style attr.

---


###   function createSVG (width, height, left, top)
create an empty SVG element

**Argument:** **width**

the width, in em
**Argument:** **height**

the height, in em
**Argument:** **left**

the x-position, in em
**Argument:** **top**

the y-position, in em

**Returns:** s a newly instantiated svg DOM element

---


###   function createSVGLine (from, to)
creates a SVG line

**Argument:** **from**

the start position, in em
**Argument:** **to**

the end position, in em

**Returns:** s the SVG line DOM object

---


###   function createSVGPath (from, to)
creates a perpendicular connector path out of SVG lines.

Actual SVG paths seem to require pixel coordinates, while this solution
enables the use of font-relative sizes (em)

**Argument:** **from**

the start point, in em
**Argument:** **to**

the end point, in em

**Returns:** s a SVG object, which correctly represents the path

---


###   function KOLine (from, to)
KOLine, a representative class of the perpendicular connector path, as used
in binary KO tournament trees

**Argument:** **from**

the start position, in em
**Argument:** **to**

the end position, in em

**Returns:** s the path object (this). The SVG DOM element can be accessed as
this.svg and is supposed to be jQuery-compatible

---

## Metrics

* 169 Lines
* 4314 Bytes

