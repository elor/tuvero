# MVC-Modell (Model-View-Controller)

Das in Tuvero benutzte MVC-Modell baut auf `Emitter` und `Listener` auf und erlaubt die strikte Trennung von Daten, Darstellung und Steuerung, jeweils über die Klassen `Model`, `View` und `Controller`.

## `Model`

Die `Model`-Klasse ist ein `Emitter`, der dafür gedacht ist, Daten zu verwalten und bei der Änderung seiner Daten Events zu emittieren, damit andere Klassen auf die Änderung dieser Daten reagieren können und sie entweder weiterverarbeiten (anderes `Model`) oder darstellen (`View`) können.

### Kostruktor: `Model()`

Keine Argumente.

## `View`

Ein View soll die Daten von einem `Model` darstellen und bei Veränderung dieser Daten die entsprechende Darstellung anpassen, um immer einen aktuellen Überblick zu liefern. Ein View soll nur read-only-Funktionen von `Model` aufrufen, da sie nur die Darstellung der Daten übernehmen. Für schreibende Funktionen stehen `Controller` zur Verfügung.

In Tuvero ist ein `View` streng an die `JQuery`-Bibliothek für Darstellungen gebunden.

### Konstruktor: `View(model, $view)`

* `model`: `Model`. Ein passendes `Model`, das vom View representiert werden soll.
* `$view`: `jQuery object`. Ein einzelnes jQuery-Objekt, über das die Darstellung geschehen soll.

## `Controller`

Über `Controller` wird interaktives Verhalten hergestellt, das heißt, dass über ihn Bedienelemente an die Manipulation von `Model` gebunden werden.

Es sollen keine Funktionen von `View` direkt aufgerufen werden, um zu vermeiden, dass die Daten und die Darstellung divergieren. Stattdessen soll das Modell bei Änderung seiner Daten immer entsprechende Events emittieren, anhand derer sich der View aktualisiert.

### Konstruktor: `Controller(view)`

* `view`: `View`. Der `View`, für den Interaktivität hergestellt werden soll. Üblicherweise enthält er die Bedienelemente für den Benutzer.

`view.model` ist nach dem Konstruktor über `this.model` verfügbar.

`this.view.$view` ist das assoziierte jQuery-Objekt.