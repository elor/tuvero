'use strict'

/**
 * jscodeshift codemod: convert QUnit+requirejs test files to Vitest ESM.
 *
 * Usage:
 *   npx jscodeshift -t tools/qunit-to-vitest.js 'scripts/** /test/*.js'
 */

const path = require('path')

function resolveImportPath (modulePath, testFilePath) {
  if (!modulePath.includes('/')) return modulePath // aliased (options, presets, strings)
  const parts = testFilePath.split(path.sep)
  const testDomain = parts[1] // e.g. 'core'
  const [modDomain, ...rest] = modulePath.split('/')
  const modName = rest.join('/')
  return modDomain === testDomain ? `../${modName}.js` : `../../${modDomain}/${modName}.js`
}

module.exports = function transform (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  // ── 1. Find outer: export default (function(QUnit, getModule){ ... }) ──────
  const exportColl = root.find(j.ExportDefaultDeclaration)
  if (exportColl.length === 0) return null

  const exportNode = exportColl.get().node
  if (exportNode.declaration.type !== 'FunctionExpression') return null

  // ── 2. Do all in-place AST transforms BEFORE extracting the body ──────────

  // 2a. QUnit.test(name, function(assert){…}) → test(name, () => {…})
  exportColl
    .find(j.CallExpression, {
      callee: { type: 'MemberExpression', object: { name: 'QUnit' }, property: { name: 'test' } }
    })
    .forEach(p => {
      const [nameArg, fnArg] = p.node.arguments
      const body = fnArg.type === 'FunctionExpression' ? fnArg.body : fnArg
      p.replace(j.callExpression(j.identifier('test'), [nameArg, j.arrowFunctionExpression([], body)]))
    })

  // 2b. assert.equal / deepEqual / ok / notEqual → expect(…).matcher(…)
  exportColl
    .find(j.CallExpression, {
      callee: { type: 'MemberExpression', object: { name: 'assert' } }
    })
    .forEach(p => {
      const method = p.node.callee.property.name
      const args = p.node.arguments
      const a0 = args[0]
      const a1 = args[1]
      const a2 = args[2]
      const expectArgs = a2 !== undefined ? [a0, a2] : [a0]

      let matcher
      if (method === 'equal') {
        matcher = j.callExpression(
          j.memberExpression(j.callExpression(j.identifier('expect'), expectArgs), j.identifier('toBe')),
          [a1]
        )
      } else if (method === 'deepEqual') {
        matcher = j.callExpression(
          j.memberExpression(j.callExpression(j.identifier('expect'), expectArgs), j.identifier('toEqual')),
          [a1]
        )
      } else if (method === 'ok') {
        const okArgs = a1 !== undefined ? [a0, a1] : [a0]
        matcher = j.callExpression(
          j.memberExpression(j.callExpression(j.identifier('expect'), okArgs), j.identifier('toBeTruthy')),
          []
        )
      } else if (method === 'notEqual') {
        matcher = j.callExpression(
          j.memberExpression(
            j.memberExpression(j.callExpression(j.identifier('expect'), expectArgs), j.identifier('not')),
            j.identifier('toBe')
          ),
          [a1]
        )
      } else {
        return
      }
      p.replace(matcher)
    })

  // ── 3. Extract the factory body (now with transformed nodes) ──────────────
  const factoryBody = exportNode.declaration.body.body

  // ── 4. Collect getModule assignments → ESM import declarations ─────────────
  const importedNames = new Set()
  const moduleImports = []

  for (const stmt of factoryBody) {
    if (
      stmt.type !== 'ExpressionStatement' ||
      stmt.expression.type !== 'AssignmentExpression' ||
      stmt.expression.operator !== '=' ||
      stmt.expression.left.type !== 'Identifier' ||
      stmt.expression.right.type !== 'CallExpression' ||
      stmt.expression.right.callee.name !== 'getModule' ||
      typeof stmt.expression.right.arguments[0]?.value !== 'string'
    ) continue

    const localName = stmt.expression.left.name
    const modulePath = stmt.expression.right.arguments[0].value
    importedNames.add(localName)
    moduleImports.push(
      j.importDeclaration(
        [j.importDefaultSpecifier(j.identifier(localName))],
        j.literal(resolveImportPath(modulePath, fileInfo.path))
      )
    )
  }

  // ── 5. Build body: drop getModule stmts and their empty var decls ──────────
  const newBody = []
  for (const stmt of factoryBody) {
    if (
      stmt.type === 'ExpressionStatement' &&
      stmt.expression.type === 'AssignmentExpression' &&
      stmt.expression.right.type === 'CallExpression' &&
      stmt.expression.right.callee.name === 'getModule'
    ) continue

    if (stmt.type === 'VariableDeclaration') {
      const kept = stmt.declarations.filter(d => !importedNames.has(d.id.name))
      if (kept.length === 0) continue
      if (kept.length < stmt.declarations.length) {
        newBody.push(j.variableDeclaration(stmt.kind, kept))
        continue
      }
    }

    newBody.push(stmt)
  }

  // ── 6. Replace program body with imports + transformed body ───────────────
  const vitestImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('test')), j.importSpecifier(j.identifier('expect'))],
    j.literal('vitest')
  )

  const leadingComments = exportNode.leadingComments || []
  if (leadingComments.length) vitestImport.comments = leadingComments

  root.find(j.Program).forEach(p => {
    p.node.body = [vitestImport, ...moduleImports, ...newBody]
  })

  return root.toSource({ quote: 'single' })
}

module.exports.parser = 'babel'
