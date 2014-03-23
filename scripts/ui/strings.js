/**
 * a list of teams with some accessor functions
 */
define(function () {
  var Strings, key;

  Strings = {
    autosaveoff : 'Automatisches  Speichern aus',
    autosaveon : 'Automatisches Speichern an',
    autoupdateoff : 'Automatische Aktualisierung aus',
    autoupdateon : 'Automatische Aktualisierung an',
    byevote : 'Freilos',
    clearstorage : 'Lokal gespeicherte Daten löschen? Sämtliche Turnierdaten gehen damit verloren.',
    confirmleave : 'Das Turnier kann nicht gespeichert werden. Fenster trotzdem schließen?',
    downvote : 'Runter',
    upvote : 'Hoch',
    fileabort : 'Lesen abgebrochen',
    fileerror : 'Lesefehler',
    filenotfound : 'Datei wurde nicht gefunden',
    filenotreadable : 'Datei ist nicht lesbar',
    gamefinished : 'Spiel beendet',
    invalidresult : 'Ungültiges Ergebnis',
    loaded : 'Turnier geladen',
    loadfailed : 'Ladevorgang fehlgeschlagen. Lade neu...',
    newtournament : 'Neues Turnier begonnen',
    notimplemented : 'Funktion noch nicht verfügbar',
    pageload : 'Seite geladen',
    pointchangeaborted : 'Korrektur verworfen',
    pointchangeapplied : 'Korrektur angewandt',
    rankingupdate : 'Ranking wurde berechnet',
    roundfailed : 'Auslosung fehlgeschlagen',
    roundfinished : '%s. Runde abgeschlossen',
    roundstarted : '%s. Runde ausgelost',
    registrationclosed : 'Registrierung geschlossen',
    saved : 'Turnier gespeichert.',
    savefailed : 'Speichervorgang fehlgeschlagen.',
    startfailed : 'Auslosung fehlgeschlagen. Zu wenige Teams?',
    teamadded : 'Team %s registriert',
    toofewteams : 'Zu wenige Teams'
  };

  return Strings;
});
