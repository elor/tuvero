# Architecture

## Variant system

Each variant (`basic/`, `boule/`, `tac/`) provides four files resolved as bare-specifier aliases by Vite:
- `options.js` — match scoring rules (min/max points, ties allowed, etc.)
- `presets.js` — tournament systems, ranking component lists, registration config
- `strings.js` — UI strings (German)
- `main.js` — entry point, re-exports `scripts/core/main.js`

Selected at build time via `VITE_VARIANT`. In dev, `vite.config.js` walks the module graph to determine which variant imported a shared module, serving all three simultaneously at `/basic/`, `/boule/`, `/tac/`.

## HTML templates

Page HTML is assembled from Nunjucks partials in `templates/` by the `nunjucksHtmlPlugin` Vite plugin (`vite.config.js`), in both dev and build. Each `{basic,boule,tac}/index.html` is a Nunjucks root — **do not hand-edit its body**; edit partials in `templates/`. Per-variant values (`teamtext`, `matchplace`, `variant`, `version`, the `teamsize` toggle, …) come from `templatevars.js`, keyed by variant.

Some UI fragments are runtime components: `.template`-classed nodes are cloned by `TemplateView`/`ListView`. The KO match is wrapped as a native custom element (`<tuvero-komatch>`, registered in `scripts/ui/customelements.js`, imported via `scripts/core/common.js`); it retains the `komatchresult`/`match` classes so all selectors and CSS are unchanged.

## MVC pattern (jQuery-based)

- **`scripts/core/emitter.js` / `listener.js`** — pub/sub base classes. Models extend `Emitter`, views/controllers extend `Listener`. Callbacks: `on<EventName>(emitter, event, data)`.
- **`scripts/core/model.js`** — base model with typed save/restore for `localStorage` serialisation.
- **`scripts/core/view.js`** — holds a `model` reference and a `$view` jQuery object; re-renders on model events.
- **`scripts/core/controller.js`** — holds `this.view` and `this.model`; wires DOM event handlers.

Views and controllers are instantiated imperatively in `$(function() { ... })` blocks inside `scripts/ui/*tab.js`.

## State and persistence

`scripts/ui/state.js` exports a singleton `State` (`StateModel`) containing:
- `State.teams` — `IndexedListModel` of `TeamModel`
- `State.tournaments` — `TournamentListModel`
- `State.teamsize`, `State.tabOptions`, etc. — `ValueModel` instances

`scripts/timemachine/` handles persistence via a git-like commit/reflog structure serialised to `localStorage`. `StateSaver.saveState()` creates a commit; `StateLoader.loadLatest()` restores on startup.

## Tournament systems

Each system is a class in `scripts/tournament/` (e.g. `swisstournamentmodel.js`, `kotournamentmodel.js`), extending `TournamentModel` and implementing `run()`, `finish()`, `correct()`.

Ranking uses a linked-list of `RankingComponent` instances — each computes one metric (wins, buchholz, saldo, …) and delegates ties to `this.nextcomponent`. The chain is assembled from the `ranking` array in `presets.js` at tournament creation time.

## Tests

**Unit:** `scripts/**/test/*.js` via Vitest in Node. Alias targets are neutral stubs at `test/scripts/{options,presets,strings}.js`. No DOM.

**E2E:** `e2e/` via Playwright, which starts the Vite dev server automatically (`reuseExistingServer: true`). Helpers in `e2e/helpers.js`.
