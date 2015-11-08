[![Build Status](https://travis-ci.org/elor/tuvero.svg?branch=develop)](https://travis-ci.org/elor/tuvero)

# Tuvero 1.5.1-dev

## Beschreibung

Tuvero ist eine browserbasierte Turnierverwaltungssoftware, die auch offline genutzt werden kann. Sie direkt ist über <https://tuvero.de> verfügbar.

Für Tuvero gibt es verschiedene Varianten, die für unterschiedliche Spiele ausgelegt sind:

* [Tuvero Boule](https://tuvero.de/boule) für Petanque-Turniere (<http://petanque-ost.de>)
* [Tuvero TAC](https://tuvero.de/tac) für TAC-Turniere (<http://spiel-tac.de>)

## Benutzung

### Ohne Installation

Grundsätzlich ist für Tuvero keine Installation notwendig. Nach einem Besuch <https://tuvero.de> und dem Öffnen der gewünschten Variante ist <https://tuvero.de> auch offline im Browser verfügbar.

### Lokale Installation

Lade ein Installationspaket von <https://github.com/elor/tuvero> herunter, entpacke es und öffne index.html mit dem Browser.

### Installation auf einem anderen Webserver

Am liebsten ist mir als Autor, wenn die offizielle Version auf <https://tuvero.de> genutzt wird.

Tuvero kann aber auch auf einem anderen Webserver und unter einer anderen Domain installiert werden.
In diesem Fall bitte ich darum, bei Veränderungen an der Software die Versionsnummer so anzupassen, dass eine Verwechslung mit einer offiziellen Version ausgeschlossen ist.
Der Entwicklungsversion liegt dazu `apply-version.sh` bei.
Siehe auch Abschnitt Build-Prozess.
Außerdem würde ich mich über schnelle Updates freuen, um den Nutzern immer die stabilste Version anbieten zu können.

## Build-Prozess

Tuvero kann ohne Kompilierung direkt benutzt werden, besteht aber aus mehreren hundert Dateien, die die Software verlangsamen.
Um Tuvero aus dem Quellcode zu kompilieren, müssen folgende Schritte ausgeführt werden:

    ./build-tools/apply-version.sh {myversion}
    make update    # erzeuge alle automatisch generierten Dateien. Notwendig nach Änderungen an Bildern, Code oder Templates
    make all       # Komprimiert die Software zu ~6 Dateien (von mehreren Hundert!)

Die kompilierten Dateien finden sich dann in den build-Verzeichnissen (z.B. `boule-build/`), `index.html` und `manifest.appcache`.

## Tests

Öffne `test/index.html` oder `test-build/index.html` im Browser für eine Liste von manuellen und automatischen Tests von Tuvero.
