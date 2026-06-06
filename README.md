# Tuvero

## Beschreibung

Tuvero ist eine browserbasierte Turnierverwaltungssoftware, die auch offline genutzt werden kann. Sie ist direkt über <https://www.tuvero.de> verfügbar.

## Benutzung

Einfach <https://www.tuvero.de> im Browser öffnen, Variante auswählen und ein Turnier erstellen. Keine Installation notwendig. Nach dem ersten Öffnen kann Tuvero vollständig offline genutzt werden. Alle Turnierstände werden automatisch gespeichert.

**Varianten:**
- **Tuvero Basic** — Einzel- und Kleingruppen-Turniere
- **Tuvero Boule** — Pétanque Triplettes
- **Tuvero TAC** — Brettspiel-Turniere

## Entwicklung

```bash
npm install
npm run dev        # Entwicklungsserver (alle Varianten gleichzeitig)
npm run build      # Produktionsbuild nach build/{basic,boule,tac}/
npm test           # Unit-Tests (Vitest)
npm run test:e2e   # End-to-End-Tests (Playwright)
npm run lint:fix   # StandardJS auto-fix
```

Einzelnen Playwright-Test ausführen: `npx playwright test -g "Swiss"`  
Einzelne Variante: `VITE_VARIANT=basic vite`

Architektur-Dokumentation: [Architecture.md](Architecture.md)

## Projektstruktur

- `scripts/core/` — Gemeinsame Turnierlogik (Spielsysteme, Ranking, Modelle)
- `scripts/` — UI-Code, Browser-Integration (jQuery)
- `basic/`, `boule/`, `tac/` — Varianten-spezifische Dateien (`options.js`, `presets.js`, `strings.js`, `main.js`)
- `templates/` — Gemeinsame Nunjucks-Templates
- `style/` — Gemeinsames CSS
- `e2e/` — Playwright E2E-Tests
- `cli/` — Node.js-Library für die Verarbeitung von Tuvero-Speicherständen
