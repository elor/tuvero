/**
 * Tests for tools/amd-to-esm.js.
 *
 * Run with: node --test tools/amd-to-esm.test.js
 */

const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')

const { transform, resolveDepSpecifier } = require('./amd-to-esm.js')

const repoRoot = path.resolve(__dirname, '..')
const scriptsRoot = path.join(repoRoot, 'scripts')
const fakeFile = (p) => path.join(scriptsRoot, p)

function run (src, file = 'core/sample.js') {
  return transform(src, fakeFile(file), scriptsRoot)
}

test('Pattern A: define([deps], factory) with single dep', () => {
  const src = `define(['lib/extend'], function (extend) {
  function Foo () {}
  extend(Foo, Object)
  return Foo
})
`
  const out = run(src)
  assert.equal(out.skipped, undefined)
  assert.match(out.code, /^import extend from '\.\.\/lib\/extend\.js'/m)
  assert.match(out.code, /export default Foo/)
  assert.doesNotMatch(out.code, /\bdefine\(/)
  assert.doesNotMatch(out.code, /\breturn Foo/)
})

test('Pattern A: multiple deps map to multiple imports', () => {
  const src = `define(['lib/extend', 'core/listener'], function (extend, Listener) {
  function Emitter () {}
  extend(Emitter, Listener)
  return Emitter
})
`
  const out = run(src, 'core/emitter.js')
  assert.equal(out.skipped, undefined)
  assert.match(out.code, /import extend from '\.\.\/lib\/extend\.js'/)
  assert.match(out.code, /import Listener from '\.\/listener\.js'/)
  assert.match(out.code, /export default Emitter/)
})

test('Pattern A: bare specifiers stay bare and lose .js', () => {
  const src = `define(['jquery', 'tuvero', 'options'], function ($, tuvero, options) {
  return { $: $, tuvero: tuvero, options: options }
})
`
  const out = run(src, 'ui/something.js')
  assert.match(out.code, /import \$ from 'jquery'/)
  assert.match(out.code, /import tuvero from 'tuvero'/)
  assert.match(out.code, /import options from 'options'/)
})

test('Pattern B: define(factory) with no deps', () => {
  const src = `define(function () {
  function Listener () {}
  return Listener
})
`
  const out = run(src, 'core/listener.js')
  assert.equal(out.skipped, undefined)
  assert.doesNotMatch(out.code, /^import/m)
  assert.match(out.code, /export default Listener/)
  assert.doesNotMatch(out.code, /\bdefine\(/)
})

test('Skips: no top-level define (e.g. config.js)', () => {
  const src = `require.config({ baseUrl: '../scripts' })
require(['core/main'], function () {})
`
  const out = run(src)
  assert.equal(out.skipped, 'no-top-level-define')
})

test('Skips: UMD wrapper (define inside IIFE)', () => {
  const src = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  }
}(this, function () { return {} }))
`
  const out = run(src, 'lib/extend.js')
  assert.equal(out.skipped, 'no-top-level-define')
})

test('Warns on synchronous require() inside body', () => {
  const src = `define(['lib/extend'], function (extend) {
  function Main () {
    var $ = require('jquery')
    var Splash = require('ui/splash')
    return $
  }
  return Main
})
`
  const out = run(src, 'core/main-ish.js')
  assert.equal(out.skipped, undefined)
  assert.ok(
    out.warnings.some((w) => w.includes("require('jquery')")),
    'expected warning for require("jquery")'
  )
  assert.ok(
    out.warnings.some((w) => w.includes("require('ui/splash')")),
    'expected warning for require("ui/splash")'
  )
  // The require() calls themselves stay in the body for hand-fixing.
  assert.match(out.code, /require\('jquery'\)/)
})

test('Path resolution: scripts/ui/foo.js depending on core/listener', () => {
  const out = resolveDepSpecifier(
    'core/listener',
    fakeFile('ui/foo.js'),
    scriptsRoot
  )
  assert.equal(out, '../core/listener.js')
})

test('Path resolution: same dir → ./name.js', () => {
  const out = resolveDepSpecifier(
    'core/listener',
    fakeFile('core/emitter.js'),
    scriptsRoot
  )
  assert.equal(out, './listener.js')
})

test('Path resolution: bare specifier passes through', () => {
  const out = resolveDepSpecifier(
    'jquery',
    fakeFile('core/emitter.js'),
    scriptsRoot
  )
  assert.equal(out, 'jquery')
})

test('Skips: AMD-special require/exports/module deps', () => {
  const src = `define(['require', 'exports', 'module'], function (require, exports, module) {
  module.exports = {}
})
`
  const out = run(src, 'lib/weird.js')
  assert.ok(String(out.skipped).startsWith('amd-special-'))
})

test('Comments before define become leading comments on first import', () => {
  const src = `/**
 * Header docblock
 */
define(['lib/extend'], function (extend) {
  function Foo () {}
  return Foo
})
`
  const out = run(src, 'core/foo.js')
  // The header should still appear above the import line.
  const headerIdx = out.code.indexOf('Header docblock')
  const importIdx = out.code.indexOf('import extend')
  assert.ok(headerIdx >= 0, 'header comment preserved')
  assert.ok(headerIdx < importIdx, 'header before import')
})

test('Already-ESM input is skipped, not errored', () => {
  const src = `import foo from './foo.js'
export default foo
`
  const out = run(src, 'core/already.js')
  assert.equal(out.skipped, 'already-esm')
})

test('No return → emits warning, no default export', () => {
  const src = `define(['lib/extend'], function (extend) {
  extend()
})
`
  const out = run(src, 'core/sideeffect.js')
  assert.equal(out.skipped, undefined)
  assert.ok(
    out.warnings.some((w) => w.includes('no top-level return')),
    'expected warning about missing return'
  )
  assert.doesNotMatch(out.code, /export default/)
})
