'use strict'

/**
 * jscodeshift codemod: convert var declarations to const or let.
 *
 * Rules:
 *  - for-loop init / for-in / for-of → let  (block-scoped loop variable)
 *  - multiple declarators in one statement   → let  (too complex to split)
 *  - destructuring pattern                   → let  (conservative)
 *  - single declarator, never reassigned     → const
 *  - single declarator, reassigned anywhere  → let
 *
 * Reassignment detection checks:
 *  - AssignmentExpression where left === name
 *  - UpdateExpression (i++, ++i)
 *
 * Usage:
 *   npx jscodeshift -t tools/var-to-const-let.js 'scripts/** /*.js'
 */

module.exports = function transform (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  let changed = false

  root.find(j.VariableDeclaration, { kind: 'var' }).forEach(path => {
    const parentNode = path.parent.node

    // for-loop init and for-in/of left-hand side → let
    if (
      (parentNode.type === 'ForStatement' && parentNode.init === path.node) ||
      parentNode.type === 'ForInStatement' ||
      parentNode.type === 'ForOfStatement'
    ) {
      path.node.kind = 'let'
      changed = true
      return
    }

    // multiple declarators (var a = 1, b = 2) → let (splitting is risky)
    if (path.node.declarations.length > 1) {
      path.node.kind = 'let'
      changed = true
      return
    }

    const declarator = path.node.declarations[0]

    // no initializer (var foo;) → always let (const requires an initializer)
    if (!declarator || declarator.init === null) {
      path.node.kind = 'let'
      changed = true
      return
    }

    // destructuring → let
    if (declarator.id.type !== 'Identifier') {
      path.node.kind = 'let'
      changed = true
      return
    }

    const name = declarator.id.name

    // Walk up to the nearest function/program to bound our search
    let scopeNode = path.parent
    while (
      scopeNode &&
      !['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression', 'Program'].includes(scopeNode.node.type)
    ) {
      scopeNode = scopeNode.parent
    }

    if (!scopeNode) {
      path.node.kind = 'let'
      changed = true
      return
    }

    // Search for any assignment or update targeting this name within the scope
    const isReassigned =
      j(scopeNode.node)
        .find(j.AssignmentExpression)
        .some(p => {
          const left = p.node.left
          return left.type === 'Identifier' && left.name === name
        }) ||
      j(scopeNode.node)
        .find(j.UpdateExpression)
        .some(p => {
          const arg = p.node.argument
          return arg.type === 'Identifier' && arg.name === name
        }) ||
      j(scopeNode.node)
        .find(j.ForInStatement)
        .some(p => {
          const left = p.node.left
          return left.type === 'Identifier' && left.name === name
        }) ||
      j(scopeNode.node)
        .find(j.ForOfStatement)
        .some(p => {
          const left = p.node.left
          return left.type === 'Identifier' && left.name === name
        })

    path.node.kind = isReassigned ? 'let' : 'const'
    changed = true
  })

  return changed ? root.toSource({ quote: 'single' }) : null
}

module.exports.parser = 'babel'
