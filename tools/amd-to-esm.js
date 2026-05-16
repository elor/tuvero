#!/usr/bin/env node
/**
 * AMD → ESM codemod for tuvero `scripts/`.
 *
 * Handles:
 *   Pattern A: define(['dep1', 'dep2'], function (a, b) { ...; return X })
 *   Pattern B: define(function () { ...; return X })
 *
 * Skips (with warning) and leaves the file untouched:
 *   - UMD wrappers (no top-level `define(...)`)
 *   - `define` whose factory is not a FunctionExpression / ArrowFunctionExpression
 *   - Modules with no top-level `define(...)` (e.g. `core/config.js`, `core/main.js`)
 *
 * Emits a warning (but still rewrites) when synchronous `require('x')` calls appear
 * inside the factory body — those need manual conversion.
 *
 * Dependency path conventions:
 *   - Bare specifiers for: jquery, tuvero, semver, filesaver, options, presets, strings
 *     (Vite alias / node_modules resolution handles these.)
 *   - Everything else is treated as AMD-style baseUrl=`scripts/` and rewritten to a
 *     relative path with `.js` extension.
 *
 * Usage:
 *   node tools/amd-to-esm.js [--dry-run] [--check] <file...>
 */

const fs = require('node:fs')
const path = require('node:path')
const parser = require('@babel/parser')
const traverseModule = require('@babel/traverse')
const generatorModule = require('@babel/generator')
const t = require('@babel/types')

const traverse = traverseModule.default || traverseModule
const generate = generatorModule.default || generatorModule

const BARE_SPECIFIERS = new Set([
  'jquery',
  'tuvero',
  'semver',
  'filesaver',
  'options',
  'presets',
  'strings'
])

const SPECIAL_AMD_DEPS = new Set(['require', 'exports', 'module'])

function resolveDepSpecifier (depId, fileAbs, scriptsRoot) {
  if (BARE_SPECIFIERS.has(depId)) return depId

  const fromDir = path.dirname(fileAbs)
  const targetAbs = path.join(scriptsRoot, depId + '.js')
  let rel = path.relative(fromDir, targetAbs)
  if (!rel.startsWith('.')) rel = './' + rel
  return rel
}

function uniqueIdent (base, used) {
  let candidate = base.replace(/[^A-Za-z0-9_$]/g, '_')
  if (/^[0-9]/.test(candidate)) candidate = '_' + candidate
  if (!used.has(candidate)) {
    used.add(candidate)
    return candidate
  }
  let i = 2
  while (used.has(candidate + i)) i++
  used.add(candidate + i)
  return candidate + i
}

function transform (source, fileAbs, scriptsRoot) {
  let ast
  try {
    ast = parser.parse(source, {
      sourceType: 'script',
      allowReturnOutsideFunction: false,
      attachComment: true
    })
  } catch (err) {
    // If the file already uses ESM (import/export), parsing as `script` fails.
    // Try once more as `module` purely to detect that case, then skip.
    try {
      parser.parse(source, { sourceType: 'module', attachComment: true })
      return { skipped: 'already-esm', source }
    } catch (_) {
      throw err
    }
  }

  const program = ast.program
  const body = program.body

  // Locate the single top-level `define(...)` expression statement.
  let defineIndex = -1
  for (let i = 0; i < body.length; i++) {
    const stmt = body[i]
    if (
      stmt.type === 'ExpressionStatement' &&
      stmt.expression.type === 'CallExpression' &&
      stmt.expression.callee.type === 'Identifier' &&
      stmt.expression.callee.name === 'define'
    ) {
      if (defineIndex !== -1) {
        return { skipped: 'multiple-define', source }
      }
      defineIndex = i
    }
  }
  if (defineIndex === -1) {
    return { skipped: 'no-top-level-define', source }
  }

  const defineStmt = body[defineIndex]
  const defineCall = defineStmt.expression
  const args = defineCall.arguments

  let depsArg = null
  let factoryArg = null
  if (args.length === 1) {
    factoryArg = args[0]
  } else if (args.length === 2) {
    depsArg = args[0]
    factoryArg = args[1]
  } else if (args.length === 3) {
    // Pattern: define(name, deps, factory) — named module, not used in this codebase
    return { skipped: 'named-define', source }
  } else {
    return { skipped: `unexpected-arity-${args.length}`, source }
  }

  if (
    factoryArg.type !== 'FunctionExpression' &&
    factoryArg.type !== 'ArrowFunctionExpression'
  ) {
    return { skipped: 'non-function-factory', source }
  }

  if (depsArg && depsArg.type !== 'ArrayExpression') {
    return { skipped: 'non-array-deps', source }
  }

  const deps = depsArg ? depsArg.elements : []
  const params = factoryArg.params

  // Build import declarations from (deps, params) pairs.
  const usedNames = new Set()
  const imports = []
  const warnings = []

  const maxLen = Math.max(deps.length, params.length)
  for (let i = 0; i < maxLen; i++) {
    const dep = deps[i]
    const param = params[i]

    if (dep && dep.type !== 'StringLiteral') {
      return { skipped: 'non-string-dep', source }
    }

    const depId = dep ? dep.value : null

    // AMD specials (require/exports/module) are usually paired with UMD wrappers;
    // we don't expect them in tuvero's scripts/, but bail out if seen.
    if (depId && SPECIAL_AMD_DEPS.has(depId)) {
      return { skipped: `amd-special-${depId}`, source }
    }

    if (!depId && param) {
      // Param with no matching dep — unusual, drop the param silently.
      warnings.push(`param '${param.name || '?'}' has no matching dep`)
      continue
    }

    if (depId && !param) {
      // Side-effect import (dep declared but not bound).
      const spec = resolveDepSpecifier(depId, fileAbs, scriptsRoot)
      imports.push(t.importDeclaration([], t.stringLiteral(spec)))
      continue
    }

    if (param.type !== 'Identifier') {
      return { skipped: 'non-identifier-param', source }
    }

    const localName = uniqueIdent(param.name, usedNames)
    const spec = resolveDepSpecifier(depId, fileAbs, scriptsRoot)
    imports.push(
      t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(localName))],
        t.stringLiteral(spec)
      )
    )
  }

  // Extract factory body. For arrow with expression body, wrap the expression
  // as `export default <expr>`.
  const factoryBody = factoryArg.body
  const newStatements = []

  if (factoryBody.type !== 'BlockStatement') {
    newStatements.push(t.exportDefaultDeclaration(factoryBody))
  } else {
    const stmts = factoryBody.body.slice()
    // Find a trailing top-level `return X` and convert to `export default X`.
    let convertedReturn = false
    for (let i = stmts.length - 1; i >= 0; i--) {
      const s = stmts[i]
      if (s.type === 'ReturnStatement') {
        if (s.argument) {
          stmts[i] = t.exportDefaultDeclaration(s.argument)
        } else {
          stmts.splice(i, 1)
        }
        convertedReturn = true
        break
      }
    }

    // Detect synchronous `require('x')` calls in the body — warn but keep.
    traverse(
      t.file(t.program(stmts)),
      {
        CallExpression (p) {
          const c = p.node
          if (
            c.callee.type === 'Identifier' &&
            c.callee.name === 'require' &&
            c.arguments.length === 1 &&
            c.arguments[0].type === 'StringLiteral'
          ) {
            warnings.push(
              `synchronous require('${c.arguments[0].value}') at line ${c.loc ? c.loc.start.line : '?'} — needs manual conversion`
            )
          }
        }
      }
    )

    if (!convertedReturn) {
      warnings.push('factory has no top-level return — no default export emitted')
    }

    for (const s of stmts) newStatements.push(s)
  }

  // Preserve leading comments from the original define statement (file header) —
  // prepend them so the file header stays above any inner docblocks that came
  // along with the lifted body.
  if (defineStmt.leadingComments && defineStmt.leadingComments.length > 0) {
    const first = imports[0] || newStatements[0]
    if (first) {
      first.leadingComments = defineStmt.leadingComments.concat(
        first.leadingComments || []
      )
    }
  }

  // Replace the define statement with imports + body statements.
  body.splice(defineIndex, 1, ...imports, ...newStatements)

  const output = generate(ast, {
    retainLines: false,
    comments: true,
    jsescOption: { quotes: 'single', minimal: true }
  })

  return { code: output.code, warnings }
}

function main (argv) {
  let dryRun = false
  let check = false
  const files = []
  for (const arg of argv) {
    if (arg === '--dry-run') dryRun = true
    else if (arg === '--check') check = true
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node tools/amd-to-esm.js [--dry-run] [--check] <file...>')
      return 0
    } else if (arg.startsWith('--')) {
      console.error(`Unknown option: ${arg}`)
      return 2
    } else files.push(arg)
  }
  if (files.length === 0) {
    console.error('No input files. Use --help for usage.')
    return 2
  }

  const repoRoot = path.resolve(__dirname, '..')
  const scriptsRoot = path.join(repoRoot, 'scripts')

  let changed = 0
  let skipped = 0
  let warnedFiles = 0

  for (const f of files) {
    const abs = path.resolve(f)
    const src = fs.readFileSync(abs, 'utf8')
    let result
    try {
      result = transform(src, abs, scriptsRoot)
    } catch (err) {
      console.error(`${f}: parse/transform error: ${err.message}`)
      skipped++
      continue
    }

    if (result.skipped) {
      console.warn(`${f}: skipped (${result.skipped})`)
      skipped++
      continue
    }

    if (result.warnings && result.warnings.length > 0) {
      warnedFiles++
      for (const w of result.warnings) {
        console.warn(`${f}: ${w}`)
      }
    }

    if (result.code === src) continue

    if (check) {
      console.log(`${f}: would change`)
      changed++
      continue
    }

    if (dryRun) {
      process.stdout.write(`--- ${f} ---\n`)
      process.stdout.write(result.code)
      if (!result.code.endsWith('\n')) process.stdout.write('\n')
    } else {
      fs.writeFileSync(abs, result.code)
    }
    changed++
  }

  console.error(
    `${changed} changed, ${skipped} skipped, ${warnedFiles} with warnings`
  )
  if (check && changed > 0) return 1
  return 0
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)))
}

module.exports = { transform, resolveDepSpecifier }
