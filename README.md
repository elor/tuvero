[![Build Status](https://travis-ci.org/elor/tuvero.svg?branch=develop)](https://travis-ci.org/elor/tuvero)

# Tuvero 1.5.4

## Beschreibung

Tuvero ist eine browserbasierte Turnierverwaltungssoftware, die auch offline genutzt werden kann. Sie direkt ist über <https://tuvero.de> verfügbar.

## Benutzung

Einfach <https://tuvero.de> im Browser öffnen, Variante (Tuvero Basic, Tuvero Boule, Tuvero TAC, ...) auswählen und das Turnier kann beginnen.
Es ist keine Installation notwendig.

Tuvero kann damit auch offline genutzt werden.
Nachdem eine der Varianten geöffnet wurde, muss sie einfach als Lesezeichen gespeichert werden und kann danach mindestens 30 Tage lang auch offline genutzt werden.

Tuvero speichert alle Turnierstände, sodass sie auch nach dem Schließen von Tuvero nicht verloren gehen.

## Voraussetzungen

* Windows, Linux, MacOS, Android, iOS
* Moderner Browser. Empfehlung: Google Chrome oder Chromium
* Einmalige Internetverbindung beim erstmaligen Öffnen
* Danach auch offline nutzbar
* Für Druckvorschau mit Seitenrandanpassung: Google Chrome oder Chromium

## Build-Prozess

Tuvero besteht aus hunderten einzelner Dateien, die die Entwicklung vereinfachen.
Leider wird das Laden der Entwicklungsversion im Browser damit enorm verlangsamt.

Um die Release-Version zu erzeugen, werden deshalb eine Menge von Tools benutzt, die Tuvero komprimieren und optimieren.


    ./build-tools/apply-version.sh {myversion}
    make update    # erzeuge alle automatisch generierten Dateien. Notwendig nach Änderungen an Bildern, Code oder Templates
    make all       # Komprimiert die Software zu ~6 Dateien (von mehreren Hundert!)

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

Als Entwicklungsplattform dient Ubuntu 14.04, die Entwicklungsumgebung ist Eclipse Luna, das moderne Eclipse Mars sollte auch funktionieren.

Um eine neue Version zu packen, müssen folgende Schritte durchgeführt werden:

    ./tools/apply-version {versionsnummer, z.B. 1.5.3}
    make update
    make build

Die kompilierte Version liegt dann im `build/`-Unterordner.

## Tests

Öffne `test/index.html` im Browser für eine Liste von manuellen und automatischen Tests von Tuvero selbst.

Automatische Tools zur Fehlersuche:

* `make links` - Verfügbarkeit von Links
* `make codestyle` - Einfache Code-Probleme (Fehlende Zeichen z.B.)
* `make sprites` - Fehlende Bilder
* `tools/verify-css-colors.sh` - Auflistung der CSS-Farben
* `make selenium-tests` - Alte automatisierte Tests mit Selenium, einer Browser-Automatisierung. Dauert ewig und wird nicht aktiv gewartet.
* `make build` - Fehlende Dateien, Abhängigkeiten etc.

