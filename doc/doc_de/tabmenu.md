# Das Tab-System (TabMenuView)

Tuvero nutzt ein Tab-System, durch das die Darstellung der Software in Tabs organisiert wird, die dynamisch ein- und ausgeblendet werden können. Dabei ist immer genau ein Tab offen.

Reine CSS-Lösungen oder Multi-Tabbing-Systeme sind weder Cross-Browser-kompatibel noch jemals frei von Darstellungs- und Benutzungsfehlern, weshalb ein MVC-basiertes Tabbing-System benutzt wird.

## Begriffsklärung

Die Begriffe sind im deutschen Sprachgebrauch mehrdeutig und werden deshalb auch von mir für verschiedene Bedeutungen gebraucht. Im Rahmen dieser Datei versuche ich, mir ein wenig Mühe zu geben.

* _Tab-Icon_, _Reiter_, _Tab_: Das Symbol am oberen Seitenrand, über das eine Unterseite geöffnet wird.

* _Seite_, _Unterseite_, _Tab_: Die Unterseite, die über einen Reiter geöffnet werden kann. Sie enthält den eigentlichen Inhalt.

## Geplantes Verhalten

* Beim Klick auf einen Reiter wird die zugehörige Seite angezeigt

* Ausschließlich die aktive Seite ist sichtbar

* Ausschließlich das aktive Tab wird im Tab-Menü weiß hinterlegt

* `accesskey`-Attribute des Tabs werden respektiert und ermöglichen bequeme Tastaturnavigation

* Navigation per `location.hash` ist möglich

* nicht verfügbare Seiten können nicht geöffnet werden

* nicht sichtbare Reiter werden automatisch versteckt

* Wird die Seite mit einem validen `location.hash` geöffnet, so wird die entsprechende Seite geöffnet

* Ist eine Seite offen, während sie auf "nicht verfügbar" gesetzt wird, so wird eine Standard-Seite geöffnet, ohne den `location.hash` zurückzusetzen

* Wird eine Seite verfügbar, während sie bereits per `location.hash` ausgewählt wurde, so wird sie geöffnet

* Die Sichtbarkeit einzelner Reiter kann per `TabModel` eingestellt werden

* Die Verfügbarkeit einer Seite kann per `TabModel` gesteuert werden

* Der `data-img`-Parameter kann per `TabModel` geändert werden

Das Verhalten kann über `test/tabmenuview.html` manuell getestet werden

## Kontrolle

## Implementierung

### `TabMenuView`

Liest einmalig alle `data-tab`-Attribute, die dem View direkt unterstehen, und fügt sie zur Liste der Tabs hinzu. Erstellt ein Tab-Menü direkt vor dem View und setzt sowohl beim TabMenu-Icon und beim Tab selbst die `open`-Klasse, wenn das Tab gerade aktiv ist. Versteckt außerdem die Icons für versteckte Tabs und verhindert das Öffnen von deaktivierten Tabs per `SelectionValueModel`.

* `this.getTabModel(tabname)`: Ruft die dem `tabname`-Tab zugewiesene `TabModel`-Instanz ab, über die die Tab-Eigenschaften gesteuert werden können.

* `this.focus(tabname)`: Öffnet das angegebene Tab. Ändert dazu den Location-Hash. Bitte nur benutzen, wenn es wirklich notwendig ist, genau jetzt ein bestimmtes Tab zu öffnen.

### `TabModel`

Über `TabModel` wird die Sichtbarkeit, die Verfügbarkeit und der Icon-Parameter des zugehörigen Tabs gesteuert.

Wird automatisch von `TabMenuView` für jedes Tab erstellt und ist über `TabMenuView.prototype.getTabModel()` abrufbar.

* `this.visibility` (`ValueModel`): Steuert die Sichtbarkeit des Tab-Icons: `true` zeigt das Icon an, `false` versteckt es.

* `this.accessibility` (`ValueModel`): Steuert die Erreichbarkeit des Tabs: `true` erlaubt dem Benutzer, das Tab zu öffnen, `false` verbietet es. Ist das Tab gerade offen, wird der Benutzer stattdessen auf das Standard-Tab geführt.

* `this.imgParam` (`ValueModel`): Wird dem Tabnamen hinten angefügt, um den Pfad für das Tabicon zu bestimmen. Ist standardmäßig ein leerer String.
Beispiel: `tabname === 'teams'` und `imgParam.set(3)` ergibt `data-img="teams3"`

### `TabMenuController`

Wartet auf `hashchange`-Ereignisse und versucht, den neuen Hash bei `TabMenuView.model` als aktives Tab zu setzen. Direkter Zugriff auf diese Klasse ist nicht nötig.
