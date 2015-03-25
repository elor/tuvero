# Eventsystem

Tuvero liegt ein eigenes Eventsystem zugrunde, das aus den Klassen `Emitter` und `Listener` besteht, wobei `Emitter` außerdem von `Listener` erbt.

Das Eventsystem dient der Entkopplung von Daten und der Programmstruktur und ermöglicht den Aufruf von Funktionen in zuvor unbekannten Empfängern.

Die beiden Klassen `Listener` und `Emitter` sollen Superklassen für andere Klassen darstellen, die eigenständig über die Veränderung ihres internen Zustandes informieren und so sparsame selektive Aktualisierungen durchführen.

## Emitter

Jeder Emitter definiert die Funktionen `emit()`, `registerListener()` und `unregisterListener()`

### `Emitter.prototype.emit(event, data)`

* `event`: String. Der Name des Ereignisses, z.B. 'update'
* `data`: Ein beliebiges Objekt, das als optionale Nutzdaten an registrierte Listener übergeben wird. Bitte vermeiden, sofern möglich, und stattdessen Felder (Member-Variablen) des Listeners benutzen.

### `Emitter.prototype.registerListener(listener)`

Nach dem Aufruf dieser Funktion empfängt `listener` alle Ereignisse, die vom Emitter per `emit()` versandt werden.

### `Emitter.prototype.unregisterListener(listener)`

Nach dem Aufruf dieser Funktion empfängt `listener` keine Ereignisse des Emitters.

### `Emitter.prototype.EVENTS`

Ein Objekt, das die möglichen Ereignisse festlegt. `EVENTS.eventname=true` für jedes erlaubte Ereignis.

Standardmäßig sind die Ereignisse `reset` und `update` für jede abgeleitete Klasse erlaubt.

## Listener

Ein Listener kann Ereignisse von Emittern empfangen und verarbeiten. Dies geschieht über `on`_event_-Funktionen, wobei _event_ den Namen des Ereignisses festlegt.

### `Listener.prototype.on`_event_`(emitter, event, data)`

z.B: `Listener.prototype.onupdate()`

Diese Funktion wird aufgerufen, wenn der Listener beim Emitter registriert wurde und der Emitter ein zulässiges Ereignis per `emit()` versandt hat.

* `emitter`: Emitter. Der versendende Emitter.
* `event`: String. Der Name des Ereignisses (z.B. 'update')
* `data`: Das Daten-Objekt, das an `emit()` übergeben wurde. Optional, ist standardmäßig `undefined`
