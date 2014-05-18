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
    pointchangeaborted : 'Änderung verworfen',
    pointchangeapplied : 'Änderung gespeichert',
    rankingupdate : 'Ranking wurde berechnet',
    roundfailed : 'Auslosung fehlgeschlagen',
    roundfinished : '%s. Runde abgeschlossen',
    roundstarted : '%s. Runde ausgelost',
    registrationclosed : 'Registrierung geschlossen',
    saved : 'Turnier gespeichert.',
    savefailed : 'Speichervorgang fehlgeschlagen.',
    startfailed : 'Auslosung fehlgeschlagen. Zu wenige Teams?',
    teamadded : 'Team %s registriert',
    notenoughteams : 'Zu wenige Teams',
    player : 'Spieler',
    teamhead1 : 'No.,Spieler',
    teamhead2 : 'No.,"Spieler 1","Spieler 2"',
    teamhead3 : 'No.,"Spieler 1","Spieler 2","Spieler 3"',
    rankhead1 : 'Rang,Team,Spieler,Siege,BH,FBH,Netto,Lose',
    rankhead2 : 'Rang,Team,"Spieler 1","Spieler 2",Siege,BH,FBH,Netto,Lose',
    rankhead3 : 'Rang,Team,"Spieler 1","Spieler 2","Spieler 3",Siege,BH,FBH,Netto,Lose',
    correctionhead : '"Team 1","Team 2","P1 vorher","P2 vorher","P1 nachher","P2 nachher"',
    histhead1 : 'Runde,"Teamno. 1","Spieler 1","Teamno. 2","Spieler 1",P1,P2',
    histhead2 : 'Runde,"Teamno. 1","Spieler 1","Spieler 2","Teamno. 2","Spieler 1","Spieler 2",P1,P2',
    histhead3 : 'Runde,"Teamno. 1","Spieler 1","Spieler 2","Spieler 3","Teamno. 2","Spieler 1","Spieler 2","Spieler 3",P1,P2',
    namechanged : 'Umbenannt: %s',
  };

  return Strings;
});
