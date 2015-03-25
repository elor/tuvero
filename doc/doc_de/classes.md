# Klassen und Vererbung

## Klassen

Tuvero baut auf Prototyp-basierten Klassen auf, die folgende Eigenschaften besitzen:

* ausschließlich prototyp-basierte Member-Funktionen
* keine privaten oder versteckten Funktionen
* keine Closures in Member-Funktionen, sondern Felder
* statische Funktionen unterliegen direkt der Konstruktur-Funktion, keinem Prototypen

## Felder

Felder (Member-Variablen) müssen direkt im Konstruktor definiert werden. Werden die Felder erst später geschrieben, sollen sie trotzdem definiert werden, selbst wenn man sie auf undefined setzt. Das erleichtert Code-Überprüfungen und generelle Übersicht über den Code.

Über einen Prototypen definierte Felder sind nur zugelassen, wenn tatsächlich Daten zwischen verschiedenen Instanzen ausgetauscht werden muss oder es sich um Konstanten in unbekannten Unterklassen handelt (siehe `Emitter.prototype.EVENTS`).

## Konstanten

Klassen-spezifische Konstanten, die beispielsweise an den Konstruktor oder an Member-Funktionen übergeben werden, sollen vorrangig dem Konstruktor unterstehen (`Klasse.KONSTANTE` statt `Klasse.prototype.KONSTANTE`). Wie für JavaScript üblich, müssen Konstanten-Namen groß geschrieben sein.

Konstanten, die zur Identifizierung und Nutzung von abgeleiteten Klassen ohne genauere Kenntnis der exakten Klasse notwendig sind, können auch dem Prototypen untergeordnet sein.

## Statische Variablen

Statische Variablen sollen vermieden werden, da sie beim Laden von `Tuvero Core` automatisch erstellt werden und so zu ungewollten Nebeneffekten führen können. Globale Datenobjekte zur Synchronisierung von einfachen Daten können eine Ausnahme bilden (Zustand, Optionen), sofern sie ausschließlich aus leeren Datenstrukturen bestehen und keinen großen Konstruktionsaufwand bedeuten.

## Member-Funktionen

Member-Funktionen (Methoden) müssen über den Klassen-Prototypen definiert werden. Direkte Zuweisungen (`this.memberfunction`) und private Funktionen (Funktionsdefinition innerhalb einer Member-Funktion) sind verboten, da sie nicht von einigen Optimierungen profitieren, zu Speicherproblemen führen können und nicht von Entwicklungsumgebunden gelesen werden können (z.B. für Outlines).

Ausgenommen sind anonyme oder benannte Funktionsdefinitionen, die für Listen-Iterationen und Sortierungen genutzt werden und deshalb nur im Kontext der umgebenden Funktion für den Programmierer sinnvoll erscheinen.

## Statische Funktionen

Statische Funktionen sollen vermieden werden, um unerwartete Nebeneffekte zu vermeiden und den Impact einer einzelnen Klasse zu reduzieren.

## Vererbung

Vererbung zwischen Klassen geschieht über die `extend`-Bibliothek <https://github.com/gamtiq/extend>. Sie ermöglicht einfache Vererbung ohne explizite statische Funktionen und ohne Mixins. Das ermöglicht ein schlanke Vererbungsschema, das von üblichen Entwicklungsumgebungen verarbeitet und beispielsweise von Eclipse JSDT in einem Outline dargestellt werden kann.

Beispiele finden sich auf der Projekt-Seite von extend: <https://github.com/gamtiq/extend>

## Tools

### `tools/create-core-class.sh <ClassName> [SuperClassName]`

Erstellt eine neue Klasse `ClassName` in `core/scripts/`, die von der optionalen Superclasse `SuperClassName` erbt. Wird `SuperClassName` nicht definiert, so wird das letzte großgeschrieben Wort in `ClassName` als Superclasse genommen (`SomethingView` => `View`)

Siehe auch `create-core-class.sh --help`