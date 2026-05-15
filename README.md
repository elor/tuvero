# Tuvero

## Beschreibung

Tuvero ist eine browserbasierte Turnierverwaltungssoftware, die auch offline genutzt werden kann. Sie direkt ist über <https://www.tuvero.de> verfügbar.

## Benutzung

Einfach <https://www.tuvero.de> im Browser öffnen, Variante (Tuvero Basic, Tuvero Boule, Tuvero TAC, ...) auswählen und ein Turnier erstellen.
Es ist keine Installation notwendig, und Tuvero kann nach dem ersten Öffnen offline genutzt werden.

Tuvero speichert alle Turnierstände, sodass sie auch nach dem Schließen von Tuvero nicht verloren gehen.

## Build-Prozess

Die Master-Versionen von Tuvero sind bereits vorkompiliert und müssen nicht nochmal kompiliert werden.

Die Entwicklungs-Versionen können mit `npm` kompiliert werden:

    npm install
    npm run build

Die fertige Version liegt dann im `build/`-Unterordner.

## Tests

    npm run test

## Projektstruktur

- `scripts/core/` – Gemeinsame Turnierlogik (Spielsysteme, Ranking, Modelle). Basis aller Varianten.
- `scripts/` (außerhalb `core/`) – UI-Code, Browser-Glue, Hintergrundprozesse. Nutzt jQuery und RequireJS.
- `basic/`, `boule/`, `tac/` – Varianten-Schalen mit eigener `index.html` und eigenen Einstiegs-Skripten (`main.js`, `options.js`, `presets.js`, `strings.js`).
- `templates/` – Gemeinsame Nunjucks-Templates, die zur Bauzeit in die jeweilige Varianten-`index.html` gerendert werden.
- `style/` – Gemeinsames CSS, zur Bauzeit zu `style/mainstyle.css` zusammengefasst.
- `cli/` – Node.js-Library `tuvero-cli` für die Verarbeitung von Tuvero-Speicherständen außerhalb des Browsers. Eingebunden als npm-Workspace.
- `gulp-tools/` – Eigene Gulp-Plugins (AMD→CommonJS-Transformation, RequireJS-Optimizer, Template-Renderer).
- `test/` – Browser-QUnit-Tests, ausgeführt über `cli/test.js` in Node.
- `vendor/` – Vorab gebautes AMD-Bundle (`tuvero.bundle-amd.js`), zur Laufzeit als `tuvero` geladen.
