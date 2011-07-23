/**
* TODO:
* - Teams auswuerfeln (status beruecksichtigen)
* - Spieler nach Punkten sortieren
* - Maximum / Minimum an Spielen -> gleiche Zahl fuer alle Beteiligten
* - Tage unterscheiden (Tagesuebersicht)
**/

window.addEventListener('load', function () {

    'use strict';

    var warning = document.getElementById('javascript');
    var templates = {
        oldplayer : document.getElementsByClassName('oldplayer')[0],
        game : document.getElementsByClassName('running')[0]
    };

    var gamelist = document.getElementById('gamelist');
    var gamebutton = document.getElementById('newgame');

    // 'new player' elements:
    var newplayer = {
        self : document.getElementById('newplayer'),
        button : document.getElementById('playerbutton'),
        name : document.getElementById('playername')
    };

    var storage = false;
    var savebutton = document.getElementById('save');
    var loadbutton = document.getElementById('load');

// Game constructor
    function Game(A1, A2, B1, B2, gid) {
        this.gid = gid;

        this.A1 = A1;    //  integer
        this.A2 = A2;    //  integer
        this.B1 = B1;    //  integer
        this.B2 = B2;    //  integer

        this.scoreA = 0;    //  integer
        this.scoreB = 0;    //  integer

        this.time = 0;    //  Date (either begin or total)

        // 'running' or 'finished'
        this.state = 'running';
    }

// Player constructor
    function Player(name, pid) {
        this.pid = pid; // integer
        this.name = name;   // string
        this.state = 0; // integer

        this.games = 0;
        this.siege = 0;
        this.buchholz = 0;
        this.feindbuchholz = 0;
        this.netto = 0;
    }

    Player.prototype.resetPoints = function () {
        this.siege = 0;
        this.buchholz = 0;
        this.feindbuchholz = 0;
        this.netto = 0;
    };

    Player.prototype.toString = function () {
        return [this.name, this.state].join('|');
    };

    Player.prototype.pointsToString = function () {
        return [this.games, this.siege, this.buchholz, this.feindbuchholz,
                this.netto].join(', ');
    };

    Player.prototype.fromString = function (str) {
        var arr = str.split('|');

        this.name = arr[0];
        this.state = Number(arr[1]);

        return this;
    };

    Player.prototype.setStatus = function (status) {
        var element = document.getElementById('player' + this.pid);
        if (!element) {
            alert("pid error!");
        }

        var select = element.getElementsByTagName('select')[0];
        this.state = Player.stringToSid(status);

        element.className = status;
        select.selectedIndex = this.state;
        var opts = select.getElementsByTagName('option');

        if (status === 'playing') {
            opts[0].disabled = true;
            opts[1].disabled = true;
            opts[2].disabled = true;
        } else {
            opts[0].disabled = false;
            opts[1].disabled = false;
            opts[2].disabled = false;
        }

        if (storage) {
            this.save();
        }
    };

    Player.prototype.getKey = function () {
        return "player" + this.pid;
    };

    Player.prototype.save = function () {
        localStorage.setItem(this.getKey(), this.toString());
    };

    Player.prototype.restore = function () {
        this.fromString(localStorage.getItem(this.getKey())).appendToDOM();
    };

    Player.save = function () {
        if (!storage) {
            return;
        }
        
        var i = Player.players.length;


        localStorage.setItem('numplayers', i);

        while (i) {
            i--;

            Player.players[i].save();
        }
    };

    Player.restore = function () {
        Player.players = [];
        var max = localStorage.getItem("numplayers");
        var p;
        var i = 0;

        while (i < max) {
            p = new Player('', i);
            Player.players[i] = p;
            p.restore();

            i++;
        }
    };

    Player.players = [];

    Player.get = function (pid) {
        return Player.players[pid];
    };

    Player.getName = function (pid) {
        return Player.players[pid].name;
    };

    Player.sidToString = function (sid) {
        var array = ['avail', 'pass', 'inactive', 'playing'];

        return array[sid];
    };

    Player.stringToSid = function (string) {
        var object = {
            avail : 0,
            pass : 1,
            inactive : 2,
            playing : 3
        };

        return object[string];
    };

    Player.calcPoints = function () {
        var i = Player.players.length;

        function p(id) {
            return Player.players[id];
        }

        while (i) {
            i--;
            p(i).resetPoints();
        }

        i = Game.games.length;
        var g;
        var diff;

        while (i) {
            i--;

            g = Game.games[i];
            if (g.state !== 'finished') {
                continue;
            }

            diff = g.scoreA - g.scoreB;

            p(g.A1).games++;
            p(g.A2).games++;
            p(g.B1).games++;
            p(g.B2).games++;

            p(g.A1).netto += diff;
            p(g.A2).netto += diff;
            p(g.B1).netto -= diff;
            p(g.B2).netto -= diff;

            if (g.scoreA > g.scoreB) {
                p(g.A1).siege++;
                p(g.A2).siege++;
            } else {
                p(g.B1).siege++;
                p(g.B2).siege++;
            }
        }
        
        i = Game.games.length;
        while (i) {
            i--;

            g = Game.games[i];
            if (g.state !== 'finished') {
                continue;
            }

            p(g.A1).buchholz += p(g.B1).siege + p(g.B2).siege;
            p(g.A2).buchholz += p(g.B1).siege + p(g.B2).siege;

            p(g.B1).buchholz += p(g.A1).siege + p(g.A2).siege;
            p(g.B2).buchholz += p(g.A1).siege + p(g.A2).siege;

        }

        i = Game.games.length;
        while (i) {
            i--;

            g = Game.games[i];
            if (g.state !== 'finished') {
                continue;
            }

            p(g.A1).feindbuchholz += p(g.B1).buchholz + p(g.B2).buchholz;
            p(g.A2).feindbuchholz += p(g.B1).buchholz + p(g.B2).buchholz;

            p(g.B1).feindbuchholz += p(g.A1).buchholz + p(g.A2).buchholz;
            p(g.B2).feindbuchholz += p(g.A1).buchholz + p(g.A2).buchholz;
        }
    };

// Game constructor
    Game.prototype.toString = function () {
        return [this.A1, this.A2, this.B1, this.B2, this.scoreA,
                this.scoreB, this.time, this.state].join('|');
    };

    Game.prototype.fromString = function (str) {
        var arr = str.split('|');
        this.A1 = Number(arr[0]);
        this.A2 = Number(arr[1]);
        this.B1 = Number(arr[2]);
        this.B2 = Number(arr[3]);
        
        this.scoreA = Number(arr[4]);
        this.scoreB = Number(arr[5]);

        var d = new Date();
        d.setTime(Number(arr[6]));
        this.time = d;

        this.state = arr[7];

        return this;
    };

    Game.save = function () {
        if (!storage) {
            return;
        }

        var i = Game.games.length;
        localStorage.setItem('numgames', i);

        while (i) {
            i--;

            Game.games[i].save();
        }
    };

    Game.prototype.save = function () {
        localStorage.setItem('game' + this.gid, this.toString());
    };

    Game.prototype.restore = function () {
        this.fromString(localStorage.getItem('game' + this.gid)).appendToDOM();
    };

    Game.restore = function () {
        var max = localStorage.getItem('numgames');
        var i = 0;
        var g;

        while (i < max) {
            g = new Game(0, 0, 0, 0, i);
            Game.games[i] = g;
            g.restore();

            i++;
        }
    };

    Game.games = [];

    Player.prototype.appendToDOM = function () {
        // add according elements to DOM

        var element = document.createElement('div');
        element.innerHTML = templates.oldplayer.innerHTML.replace('%NAME',
                this.name);
        element.id = 'player' + this.pid;
        newplayer.self.parentNode.insertBefore(element, newplayer.self);

        this.updateInfo();

        var that = this;

        var select = element.getElementsByTagName('select')[0];
        select.addEventListener('change', function () {
            that.setStatus(Player.sidToString(select.selectedIndex));
        }, false);

        this.setStatus(Player.sidToString(this.state));
    };

    Player.prototype.updateInfo = function () {
        var element = document.getElementById('player' + this.pid);
        var span = element.getElementsByClassName('points')[0];
        span.innerHTML = this.pointsToString();
    };

    Player.updateInfos = function () {
        var i = Player.players.length;
        while (i) {
            i--;

            Player.players[i].updateInfo();
        }
    };
    
    Player.removeFromDOM = function () {
        var e = document.getElementById('player' + this.pid);

        e.parentNode.removeChild(e);
    };
   
// function for adding new players to the list and array
    Player.add = function () {
        // create new Player
        var name = newplayer.name.value;
        newplayer.name.value = '';

        if (!name || !confirm('create "' + name + '"?')) {
            return;
        }

        var pid = Player.players.length;
        var player = new Player(name, pid);

        Player.players[pid] = player;

        player.appendToDOM();

        localStorage.setItem("numplayers", Player.players.length);
    };

//  function for creating a new game and assigning teams
    function newgame() {
        Game.add(0, 2, 1, 3);
    }

    Game.prototype.appendToDOM = function () {
        if (this.state === 'finished') {
            return;
        }

        // bind player status
        Player.get(this.A1).setStatus('playing');
        Player.get(this.A2).setStatus('playing');
        Player.get(this.B1).setStatus('playing');
        Player.get(this.B2).setStatus('playing');

        var that = this;
        var element;
        var begin;
        var interval;

        // add function to control state
        function endgame() {
            var scorea = element.getElementsByClassName('left')[0].
                    getElementsByClassName('score')[0].value;
            var scoreb = element.getElementsByClassName('right')[0].
                    getElementsByClassName('score')[0].value;

            that.scoreA = Number(scorea);
            that.scoreB = Number(scoreb);

            var d = new Date();
            d.setTime(d.getTime() - begin.getTime());

            that.time = d.getTime();
            that.state = 'finished';

            clearInterval(interval);

            element.parentNode.removeChild(element);

            Player.get(that.A1).setStatus('avail');
            Player.get(that.A2).setStatus('avail');
            Player.get(that.B1).setStatus('avail');
            Player.get(that.B2).setStatus('avail');

            if (storage) {
                that.save();
            }

            Player.calcPoints();
            Player.updateInfos();
        }

        // bind to DOM
        element = document.createElement('div');
        element.innerHTML = templates.game.innerHTML.
            replace('%A1', Player.getName(this.A1)).
            replace('%A2', Player.getName(this.A2)).
            replace('%B1', Player.getName(this.B1)).
            replace('%B2', Player.getName(this.B2)).
            replace('%GAME', this.gid);
        element.className = templates.game.className;
        element.id = templates.game.id + this.gid;

        // add timer
        var timer = element.getElementsByTagName('span')[0];
        timer.innerHTML = "adjusting";
        begin = new Date();

        if (this.time !== 0) {
            begin.setTime(this.time.getTime());
        } else {
            this.time = begin.getTime();
        }

        // set timer
        interval = setInterval(function () {
            var d = new Date();
            d.setTime(d.getTime() - begin.getTime());
            var min = d.getUTCMinutes();
            var sec = d.getUTCSeconds();
            min = (min < 10 ? '0' : '') + min;
            sec = (sec < 10 ? '0' : '') + sec;

            timer.innerHTML = [d.getUTCHours(), min, sec].join(':');
        }, 1000);

        // finally add to DOM
        gamelist.insertBefore(element, gamelist.firstChild);

        // bind endbutton
        var endbutton = element.getElementsByClassName('endbutton')[0];
        endbutton.addEventListener('click', function () {
            var c = confirm('Spiel beenden?');
            if (c) {
                endgame();
            }
        }, false);
    };

//  function for adding a game to the game list
    Game.add = function (A1, A2, B1, B2) {
        // init Game
        var gid = Game.games.length;

        var game = new Game(A1, A2, B1, B2, gid);
        Game.games[gid] = game;

        game.appendToDOM();

        game.save();
        localStorage.setItem('numgames', Game.games.length);
    };

    function supports_html5_storage() {
        try {
            if (!window.localStorage) {
                return false;
            }
            
            localStorage.setItem('testkey', 5);
            
            if (Number(localStorage.getItem('testkey')) !== 5) {
                return false;
            }
            
            if (/irefox/.test(navigator.userAgent)) {
                return false;
            }
            
            return true;
            
        } catch (e) {
            return false;
        }
    }
    
    function beforeunload() {
        if (!storage) {
            return 'Wenn du die Seite schliesst, gehen alle Daten verloren!';
        } else {
            return 'Keine Sorge: Die Spieldaten werden gespeichert.';
        }
    }

    storage = supports_html5_storage();

    document.getElementById('cleardatabase').addEventListener('click',
        function () {
            if (confirm('Wirklich alle gespeicherten Eintraege loeschen?')) {
                localStorage.clear();
                window.onbeforeunload = null;
                location.reload();
            }
        }, false);

// remove warning
    if (storage) {
        warning.parentNode.removeChild(warning);
    } else {
        warning.innerHTML = "html5 storage is not enabled. In-browser saving disabled.";
    }

// remove template elements
    templates.oldplayer.parentNode.removeChild(templates.oldplayer);
    templates.game.parentNode.removeChild(templates.game);
//    gamebutton.parentNode.removeChild(gamebutton);

// add event listeners for new player
    newplayer.button.addEventListener('click', Player.add, false);
    newplayer.name.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            newplayer.button.click();
        }
    }, false);

    gamebutton.addEventListener('click', newgame, false);

    if (storage) {
        Player.restore();
        Game.restore();
        Player.calcPoints();
        Player.updateInfos();
    }

    window.onbeforeunload = beforeunload;

    savebutton.addEventListener('click', function () {
        
        if (storage) {
            Player.save();
            Game.save();
            
            alert('Alle Daten wurden gesichert. Sie koennen das Fenster schliessen.');
        }
        
    }, false);

    loadbutton.addEventListener('click', function () {
        
        if (!confirm('Alle Daten loeschen und aus Datei neu laden?')) {
            return;
        }
        
        if (storage) {
            Player.restore();
            Game.restore();
        }
        
    }, false);
    
}, false);
