[![Build Status](https://travis-ci.org/elor/tuvero.svg?branch=develop)](https://travis-ci.org/elor/tuvero)

# Tuvero 1.5.6-1

## Beschreibung

Tuvero ist eine browserbasierte Turnierverwaltungssoftware, die auch offline genutzt werden kann. Sie direkt ist über <https://tuvero.de> verfügbar.

## Benutzung

Einfach <https://tuvero.de> im Browser öffnen, Variante (Tuvero Basic, Tuvero Boule, Tuvero TAC, ...) auswählen und ein Turnier erstellen.
Es ist keine Installation notwendig, und Tuvero kann nach dem ersten Öffnen offline genutzt werden.

Tuvero speichert alle Turnierstände, sodass sie auch nach dem Schließen von Tuvero nicht verloren gehen.

## Build-Prozess

Die Master-Versionen von Tuvero sind bereits vorkompiliert und müssen nicht nochmal kompiliert werden.

Die Entwicklungs-Versionen im develop-Zweig können wie folgt gebaut werden:

    make update
    make

Die kompilierte Version liegt dann im `build/`-Unterordner.

Eventuell muss vorher Software installiert werden. Dazu einfach `make node_modules` aufrufen.

Voraussetzungen (möglicherweise unvollständig):

* Kommandozeile (`bash` mit GNU-`sed`, `grep`, `sort`, `uniq`, `readlink`, `ln`, `cp`, `ls`, `basename`, `dirname`, `file`, `find`, `xargs` und vermutlich noch vielen anderen)
* `make` (ideal: GNU make)
* `nodejs` (mit `npm`) für `bower` und `r.js`
* `bower` (npm) für Updates von Bibliotheken
* `r.js` für Buildprozess
* `python2` für template-Build
* `curl` für Link-Tests
* ImageMagick (`compare` und `convert`) für Sprite-Generierung
* `optipng` für Sprite-Komprimierung
* `fixjsstyle` (siehe `closure-linter`) für Code-Formattierung

Als Entwicklungsplattform dient Ubuntu 16.10, die Entwicklungsumgebung ist Eclipse Neon.2.

## Tests

Öffne `test/index.html` im Browser für eine Liste von manuellen und automatischen Tests von Tuvero selbst.

Automatische Tools zur Fehlersuche:

* `make links` - Verfügbarkeit von Links
* `make codestyle` - Einfache Code-Probleme (Fehlende Zeichen z.B.)
* `make sprites` - Fehlende Bilder
* `tools/verify-css-colors.sh` - Auflistung der CSS-Farben
* `make selenium-tests` - Alte automatisierte Tests mit Selenium, einer Browser-Automatisierung. Dauert ewig und wird nicht aktiv gewartet.
* `make build` - Fehlende Dateien, Abhängigkeiten etc.

