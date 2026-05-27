'use strict'

/**
 * jscodeshift codemod: convert prototype-based classes to ES6 class syntax.
 *
 * Handles:
 *  - function Ctor(args) { Ctor.superconstructor.call(this, args) }
 *    + extend(Ctor, Parent)
 *    + Ctor.prototype.method = function(args) { ... }
 *    + Ctor.prototype.prop = nonFunction          ← kept after class (prototype semantics)
 *    + Ctor.staticFn = function(args) { ... }     ← static method in class
 *    + Ctor.staticProp = value                    ← static class field
 *  - Ctor.superconstructor.call(this, args)  → super(args)
 *  - Ctor.superclass.method.call(this, args) → super.method(args)
 *  - Ctor.superclass.Prop (non-call)         → Parent.prototype.Prop
 *  - extend.isSubclass(A, B)                 → A.prototype instanceof B
 *  - removes extend() call and extend import when no longer needed
 *
 * Usage:
 *   npx jscodeshift -t tools/proto-to-class.js 'scripts/**\/*.js'
 */

module.exports = function transform (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  // ── 1. Find extend(ClassName, Parent) calls ──────────────────────────────
  const classParent = new Map() // ClassName → parentName
  const extendCallPaths = []

  root.find(j.ExpressionStatement, {
    expression: { type: 'CallExpression', callee: { type: 'Identifier', name: 'extend' } }
  }).forEach(path => {
    const args = path.node.expression.arguments
    if (args.length >= 2 && args[0].type === 'Identifier' && args[1].type === 'Identifier') {
      classParent.set(args[0].name, args[1].name)
      extendCallPaths.push(path)
    }
  })

  // ── 2. Collect ClassName.prototype.method = function(...) ─────────────────
  const protoMethods = new Map() // ClassName → [{key, value, path}]

  root.find(j.ExpressionStatement).filter(isProtoAssignment).forEach(path => {
    const expr = path.node.expression
    const className = expr.left.object.object.name
    const key = expr.left.property.name
    const value = expr.right
    const isFn = value.type === 'FunctionExpression' || value.type === 'ArrowFunctionExpression'
    if (!isFn) return // keep non-function proto props in place after class
    if (!protoMethods.has(className)) protoMethods.set(className, [])
    protoMethods.get(className).push({ key, value, path })
  })

  // ── 3. Collect ClassName.staticKey = value ────────────────────────────────
  const SKIP_KEYS = new Set(['prototype', 'superclass', 'superconstructor'])
  const staticMethods = new Map() // ClassName → [{key, value, path}]
  const staticProps = new Map() // ClassName → [{key, value, path}]

  root.find(j.ExpressionStatement).filter(isDirectMemberAssignment).forEach(path => {
    const expr = path.node.expression
    const className = expr.left.object.name
    const key = expr.left.property.name
    if (SKIP_KEYS.has(key)) return
    // Only for classes we know about
    if (!classParent.has(className) && !protoMethods.has(className)) return
    const value = expr.right
    const isFn = value.type === 'FunctionExpression' || value.type === 'ArrowFunctionExpression'
    if (isFn) {
      if (!staticMethods.has(className)) staticMethods.set(className, [])
      staticMethods.get(className).push({ key, value, path })
    } else {
      if (!staticProps.has(className)) staticProps.set(className, [])
      staticProps.get(className).push({ key, value, path })
    }
  })

  // ── 4. Find constructor FunctionDeclarations ──────────────────────────────
  const allClassNames = new Set([...classParent.keys(), ...protoMethods.keys()])

  const constructorPaths = new Map() // ClassName → FunctionDeclaration path
  root.find(j.FunctionDeclaration).forEach(path => {
    const name = path.node.id && path.node.id.name
    if (name && allClassNames.has(name)) constructorPaths.set(name, path)
  })

  // ── 5. Build and insert class declarations ────────────────────────────────
  for (const [className, ctorPath] of constructorPaths) {
    const parentName = classParent.get(className)
    const ctorBody = ctorPath.node.body
    const ctorParams = ctorPath.node.params

    // Replace Ctor.superconstructor.call(this, ...) → super(...)
    j(ctorBody).find(j.CallExpression).filter(p =>
      isCallOf(p.node, className, 'superconstructor')
    ).forEach(p => {
      p.replace(j.callExpression(j.super(), p.node.arguments.slice(1)))
    })

    // Replace Ctor.superclass.method.call(this, ...) → super.method(...)
    replaceSuperclassMethodCalls(j, j(ctorBody), className)

    // Build class body members
    const members = []

    // constructor
    const ctorFn = j.functionExpression(null, ctorParams, ctorBody)
    const ctorMethod = j.methodDefinition('constructor', j.identifier('constructor'), ctorFn)
    // Don't copy constructor comments — they stay at original source position
    members.push(ctorMethod)

    // instance methods
    for (const { key, value: fn, path: assignPath } of (protoMethods.get(className) || [])) {
      replaceSuperclassMethodCalls(j, j(fn.body), className)
      const method = j.methodDefinition(
        'method',
        j.identifier(key),
        j.functionExpression(null, fn.params, fn.body)
      )
      copyComments(assignPath.node, method)
      members.push(method)
    }

    // static methods
    for (const { key, value: fn, path: assignPath } of (staticMethods.get(className) || [])) {
      replaceSuperclassMethodCalls(j, j(fn.body), className)
      const method = j.methodDefinition(
        'method',
        j.identifier(key),
        j.functionExpression(null, fn.params, fn.body)
      )
      method.static = true
      copyComments(assignPath.node, method)
      members.push(method)
    }

    // static class fields
    for (const { key, value, path: assignPath } of (staticProps.get(className) || [])) {
      const prop = j.classProperty(j.identifier(key), value)
      prop.static = true
      copyComments(assignPath.node, prop)
      members.push(prop)
    }

    // Build class declaration
    const superClass = parentName ? j.identifier(parentName) : null
    const classDecl = j.classDeclaration(
      j.identifier(className),
      j.classBody(members),
      superClass
    )
    // Copy the function declaration's leading comments to the class declaration
    copyComments(ctorPath.node, classDecl)

    // Replace function declaration with class
    ctorPath.replace(classDecl)

    // Remove extend() call
    extendCallPaths
      .filter(p => p.node && p.node.expression && p.node.expression.arguments[0] && p.node.expression.arguments[0].name === className)
      .forEach(p => { try { p.prune() } catch (_) {} })

    // Remove prototype method assignments (now inside class)
    for (const { path: p } of (protoMethods.get(className) || [])) {
      try { p.prune() } catch (_) {}
    }

    // Remove static method/prop assignments (now inside class)
    for (const { path: p } of (staticMethods.get(className) || [])) {
      try { p.prune() } catch (_) {}
    }
    for (const { path: p } of (staticProps.get(className) || [])) {
      try { p.prune() } catch (_) {}
    }
  }

  // ── 6. Replace remaining ClassName.superclass.X → Parent.prototype.X ──────
  for (const [className, parentName] of classParent) {
    if (!parentName) continue
    root.find(j.MemberExpression).filter(p =>
      p.node.object.type === 'MemberExpression' &&
      p.node.object.object.type === 'Identifier' &&
      p.node.object.object.name === className &&
      p.node.object.property.type === 'Identifier' &&
      p.node.object.property.name === 'superclass' &&
      // skip if this is the object of a .call member — already handled above
      !(p.parent.node.type === 'MemberExpression' && p.parent.node.property.name === 'call')
    ).forEach(p => {
      p.replace(
        j.memberExpression(
          j.memberExpression(j.identifier(parentName), j.identifier('prototype')),
          p.node.property
        )
      )
    })
  }

  // ── 7. extend.isSubclass(A, B) → A.prototype instanceof B ─────────────────
  root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'extend' },
      property: { type: 'Identifier', name: 'isSubclass' }
    }
  }).forEach(path => {
    const [a, b] = path.node.arguments
    if (a && b) {
      path.replace(
        j.binaryExpression('instanceof', j.memberExpression(a, j.identifier('prototype')), b)
      )
    }
  })

  // ── 8. Remove `import extend from '...'` if no longer used ────────────────
  root.find(j.ImportDeclaration).filter(path =>
    path.node.specifiers.some(s =>
      s.type === 'ImportDefaultSpecifier' && s.local.name === 'extend'
    )
  ).forEach(importPath => {
    const usedElsewhere = root.find(j.Identifier, { name: 'extend' }).filter(p => {
      let cur = p.parent
      while (cur) {
        if (cur.node.type === 'ImportDeclaration') return false
        cur = cur.parent
      }
      return true
    }).length > 0
    if (!usedElsewhere) importPath.prune()
  })

  // Return null (no change) if the file had nothing to transform
  const source = root.toSource({ quote: 'single', tabWidth: 2 })
  return source === fileInfo.source ? null : source
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isProtoAssignment (path) {
  const expr = path.node.expression
  if (expr.type !== 'AssignmentExpression') return false
  const left = expr.left
  return (
    left.type === 'MemberExpression' &&
    left.object.type === 'MemberExpression' &&
    left.object.property.type === 'Identifier' &&
    left.object.property.name === 'prototype' &&
    left.object.object.type === 'Identifier' &&
    left.property.type === 'Identifier'
  )
}

function isDirectMemberAssignment (path) {
  const expr = path.node.expression
  if (expr.type !== 'AssignmentExpression') return false
  const left = expr.left
  return (
    left.type === 'MemberExpression' &&
    left.object.type === 'Identifier' &&
    left.property.type === 'Identifier' &&
    left.object.type !== 'MemberExpression' // not Foo.prototype.X
  )
}

// Replace Ctor.superclass.method.call(this, ...) → super.method(...)
function replaceSuperclassMethodCalls (j, scope, className) {
  scope.find(j.CallExpression).filter(p =>
    p.node.callee.type === 'MemberExpression' &&
    p.node.callee.property.name === 'call' &&
    p.node.callee.object.type === 'MemberExpression' &&
    p.node.callee.object.object.type === 'MemberExpression' &&
    p.node.callee.object.object.object.type === 'Identifier' &&
    p.node.callee.object.object.object.name === className &&
    p.node.callee.object.object.property.name === 'superclass'
  ).forEach(p => {
    const methodName = p.node.callee.object.property.name
    const args = p.node.arguments.slice(1) // skip `this`
    p.replace(
      j.callExpression(j.memberExpression(j.super(), j.identifier(methodName)), args)
    )
  })
}

// Check if a CallExpression is ClassName.prop.call(...)
function isCallOf (callNode, className, prop) {
  const callee = callNode.callee
  return (
    callee.type === 'MemberExpression' &&
    callee.property.name === 'call' &&
    callee.object.type === 'MemberExpression' &&
    callee.object.object.type === 'Identifier' &&
    callee.object.object.name === className &&
    callee.object.property.type === 'Identifier' &&
    callee.object.property.name === prop
  )
}

function copyComments (fromNode, toNode) {
  if (fromNode.comments && fromNode.comments.length > 0) {
    toNode.comments = fromNode.comments
  }
}

module.exports.parser = 'babel'
