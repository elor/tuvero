[![Build Status](https://travis-ci.org/elor/tuvero.svg?branch=develop)](https://travis-ci.org/elor/tuvero)

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
