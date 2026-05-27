/**
 * Inherit one class (constructor function) from another by using prototype inheritance.
 * Based on extend method from YUI library.
 *
 * @module extend
 */
function extend (SubClass, ParentClass) {
  'use strict'
  function F () {}
  F.prototype = ParentClass.prototype
  SubClass.prototype = new F()
  SubClass.prototype.constructor = SubClass
  SubClass.superclass = ParentClass.prototype
  SubClass.superconstructor = ParentClass
  return SubClass
}

extend.isSubclass = function isSubclass (subClass, parentClass) {
  'use strict'
  if (typeof parentClass === 'function' && typeof subClass === 'function') {
    let superClass = subClass
    while ((superClass = superClass.superconstructor)) {
      if (superClass === parentClass) {
        return true
      }
    }
  }
  return false
}

export default extend
