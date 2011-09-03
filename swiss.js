window.addEventListener('load', function () {
    
    'use strict';

    var strings = {
        keys: {
            player: 'player',
        },
        
        state: {
            object: {
                rapid: 0,
                avail: 1,
                pass: 2,
                playing: 3,
                inactive: 4
            },
            arr: ['rapid', 'avail', 'pass', 'playing', 'inactive'],
            rapid: 'rapid',
            avail: 'avail',
            pass: 'pass',
            playing: 'playing',
            inactive: 'inactive'
        },
        
        game: {
            running: 'running',
            finished: 'finished',
            invalid: 'invalid'
        },
        
        err: {
            pid: 'pid error!',
            nostorage: 'Dein Browser nutzt keinen HTML5 Storage. Du musst manuell speichern.'
        },
        
        abortgame: 'Dieses Spiel für ungültig erklären?',
        invalidresult: 'Ein Spiel darf nicht mit Gleichstand beendet werden.',
        
        timedefault: '0:00:00',
        stillopengames: 'Es gibt noch offene Spiele!',
        pastehere: 'Füge gespeicherten Text hier ein und drücke den Knopf. Dabei werden alle momentan gespeicherten Daten überschrieben.',
        copythis: 'Kopiere den Inhalt dieses Feldes in eine Datei, um das Turnier zu speichern.',
        clearall: 'Sollen alle gespeicherten Daten entfernt werden?',
        alllost: 'Wenn du die Seite schliesst, gehen alle Daten verloren!',
        allsaved: 'Keine Sorge: Die Spieldaten werden gespeichert.',
        endgame: 'Spiel "%A% gegen %B%" mit Stand %S1%:%S2% beenden?',
        notenoughplayers: 'Zu wenige Spieler',
        nogamepossible: 'Kein neues Spiel moeglich',
        createplayer: 'Soll "%NAME" angemeldet werden?'
    };

    var warning = document.getElementById('javascript');
    var templates = {
        oldplayer : document.getElementsByClassName('oldplayer')[0],
        game : document.getElementsByClassName('running')[0]
    };
    
    var timelimitbox = document.getElementById('timelimit');
    var mingamesbox = document.getElementById('mingames');
    var maxgamesbox = document.getElementById('maxgames');
    
    var gamelist = document.getElementById('gamelist');
    var gamebutton = document.getElementById('newgame');
    var allgamesbutton = document.getElementById('allgames');

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
    function Game(A, B, gid) {
        A = A || 0;
        B = B || 0;
        gid = gid || Game.games.length;
        
        this.gid = gid;

        this.A = A;    //  integer
        this.B = B;    //  integer

        this.scoreA = 0;    //  integer
        this.scoreB = 0;    //  integer

        this.time = 0;    //  Date (either begin or total)

        // running or finished
        this.state = strings.game.running;
    }
    Game.games = [];
    Game.constellations = [];
    Game.timelimit = 75;
    
// Player constructor
    function Player(name, pid) {
        name = name || '';
        pid = pid || Player.players.length;
        
        this.pid = pid; // integer
        this.name = name;   // string
        this.state = strings.state.object.avail; // integer

        this.games = 0;
        this.siege = 0;
        this.buchholz = 0;
        this.feindbuchholz = 0;
        this.netto = 0;
        
        this.rank = 1;
        
        this.time = 0;
        this.blink = undefined; // interval for blinking
    }

    Player.players = [];
    Player.mingames = 0;
    Player.maxgames = 3;
    
    Player.checkGameLimits = function () {
        var i = Player.players.length;
        var p;
        
        while (i) {
            --i;
            p = Player.players[i];
            if (p.state === strings.state.object.inactive ||
                    p.state === strings.state.object.avail) {
                if (p.siege > Player.maxgames || p.siege < Player.mingames) {
                    p.setStatus(strings.state.inactive);
                } else if (p.state === strings.state.object.inactive) {
                    p.setStatus(strings.state.avail);
                }
            }
        }
        
        Player.sort();
    };
    
    Player.updateMinMax = function () {
        mingamesbox.value = Number(Player.mingames);
        maxgamesbox.value = Number(Player.maxgames);
        
        Player.checkGameLimits();
    };
    
    Player.prototype.resetPoints = function () {
        this.games = 0;
        this.siege = 0;
        this.buchholz = 0;
        this.feindbuchholz = 0;
        this.netto = 0;
        this.rank = 1;
        this.time = 0;
    };

    Player.prototype.toString = function () {
        return [this.pid, this.state, this.name].join(' ');
    };

    Player.prototype.pointsToString = function () {
        return [this.games, this.siege, this.buchholz, this.feindbuchholz,
                this.netto].join(', ');
    };

    Player.prototype.fromString = function (str) {
        var arr = str.split(' ');

        arr.shift();// remove pid
        this.state = Number(arr.shift());
        this.name = arr.join(' ');
        
        return this;
    };
    
    Player.prototype.setStatus = function (status) {
        var element = document.getElementById(strings.keys.player + this.pid);
        if (!element) {
            alert(strings.err.pid);
        }

        var select = element.getElementsByTagName('select')[0];
        this.state = Player.stringToSid(status);

        element.className = 'oldplayer ' + status;
        select.selectedIndex = this.state;
        var opts = select.getElementsByTagName('option');

        if (status === strings.state.playing || status === strings.state.inactive) {
            opts[0].disabled = true;
            opts[1].disabled = true;
            opts[2].disabled = true;
        } else {
            opts[0].disabled = false;
            opts[1].disabled = false;
            opts[2].disabled = false;
        }

        if (storage) {
            saveAll();
        }
    };

    Player.prototype.getKey = function () {
        return strings.keys.player + this.pid;
    };

    Player.calcRank = function () {
        
        function sortrank(a, b) {
            if (a.siege !== b.siege) {
                return b.siege - a.siege;
            }
            
            if (a.buchholz !== b.buchholz) {
                return b.buchholz - a.buchholz;
            }
            
            if (a.feindbuchholz !== b.feindbuchholz) {
                return b.feindbuchholz - a.feindbuchholz;
            }
            
            return b.netto - a.netto;
        }
        
        var tmparr = [];
        var i = Player.players.length;
        
        while (i) {
            --i;
            tmparr[i] = Player.players[i];
        }
        
        function samerank(i) {
            return tmparr[i].siege === tmparr[i + 1].siege &&
                tmparr[i].buchholz === tmparr[i + 1].buchholz &&
                tmparr[i].feindbuchholz === tmparr[i + 1].feindbuchholz &&
                tmparr[i].netto === tmparr[i + 1].netto;
        }
        
        tmparr.sort(sortrank);
        
        var imax = tmparr.length;
        var rank = 1;
        for (i = 0; i < imax; ++i) {
            
            tmparr[i].rank = rank;
            
            if (i !== imax - 1 && !samerank(i)) {
                rank = i + 2;
            }
        }
    };
    
    Player.sort = function () {
        
        var tmparr = [];
        var p = Player.players;
        var i = p.length;
        var j = i;
        var max = 0;
        var d;  // tmpvar
        
        function sortfunc(a, b) {
            if (a.state !== b.state) {
                return b.state - a.state;
            }

            if (!!a.blink !== !!b.blink) {
                return (a.blink ? 1 : 0) - (b.blink ? 1 : 0);
            }
            
            if (b.rank !== a.rank) {
                return b.rank - a.rank;
            }
            
            return b.pid - a.pid;
        }
        
        while (i) {
            --i;
            if (p[i].games > max) {
                max = p[i].games;
            }
        }

        i = p.length;
        while (i) {
            --i;
            if (p[i].games < max - 1 && p[i].state === strings.state.object.avail) {
                if (!p[i].blink) {
                    (function () {
                        var id = i;
                        p[id].blink = setInterval(function () {
                            var d = document.getElementById('player' + id);
                            if (/blink/.test(d.className)) {
                                d.className = d.className.replace(' blink', '');
                            } else {
                                d.className += ' blink';
                            }
                        }, 666);
                    }());
                }
            } else if (p[i].blink) {
                clearInterval(p[i].blink);
                p[i].blink = undefined;
                d = document.getElementById('player' + i);
                d.className = d.className.replace(' blink', '');
            }
        }

        i = p.length;
        while (i) {
            --i;
            
            tmparr[i] = p[i];
        }
        
        tmparr.sort(sortfunc);
        
        Player.clearDOM();
        
        while (j) {
            --j;
            tmparr[j].appendToDOM();
        }

    };

    Player.clearDOM = function () {
        var classes = document.getElementsByClassName('oldplayer');
        var i = classes.length;
        
        while (i) {
            --i;
            classes[i].parentNode.removeChild(classes[i]);
        }

    };

    Player.get = function (pid) {
        return Player.players[pid];
    };

    Player.getName = function (pid) {
        return Player.players[pid].name;
    };

    Player.sidToString = function (sid) {
        return strings.state.arr[sid];
    };

    Player.stringToSid = function (string) {
        return strings.state.object[string];
    };

    Player.calcPoints = function () {
        var p = Player.players;
        var i = p.length;

        while (i) {
            i--;
            p[i].resetPoints();
        }

        i = Game.games.length;
        var g;
        var diff;

        while (i) {
            i--;

            g = Game.games[i];
            if (g.state !== strings.game.finished) {
                continue;
            }

            diff = g.scoreA - g.scoreB;

            p[g.A].time += g.time;
            p[g.B].time += g.time;
            
            p[g.A].games++;
            p[g.B].games++;
            
            p[g.A].netto += diff;
            p[g.B].netto -= diff;

            if (g.scoreA > g.scoreB) {
                p[g.A].siege++;
            } else if (g.scoreB > g.scoreA) {
                p[g.B].siege++;
            }
        }

        i = Game.games.length;
        while (i) {
            i--;

            g = Game.games[i];
            if (g.state !== strings.game.finished) {
                continue;
            }

            p[g.A].buchholz += p[g.B].siege;

            p[g.B].buchholz += p[g.A].siege;

        }

        i = Game.games.length;
        while (i) {
            i--;

            g = Game.games[i];
            if (g.state !== strings.game.finished) {
                continue;
            }

            p[g.A].feindbuchholz += p[g.B].buchholz;

            p[g.B].feindbuchholz += p[g.A].buchholz;
        }
        
        Player.calcRank();
    };
    
    Player.prototype.appendToDOM = function () {
        // add according elements to DOM

        var element = document.createElement('div');
        element.innerHTML = templates.oldplayer.innerHTML.replace('%NAME',
                this.name);
        element.id = 'player' + this.pid;
        newplayer.self.parentNode.appendChild(element);

        this.updateInfo();

        var that = this;
        
        var select = element.getElementsByTagName('select')[0];
        select.addEventListener('change', function () {
            that.setStatus(Player.sidToString(select.selectedIndex));
            Player.sort();
            Game.checkConstellations();
        }, false);

        this.setStatus(Player.sidToString(this.state));
    };
    
    Player.prototype.updateInfo = function () {
        var element = document.getElementById('player' + this.pid);
        var span = element.getElementsByClassName('points')[0];
        
        var d = new Date();
        d.setTime(this.time);
        
        var min = d.getUTCMinutes();
        min = (min < 10 ? '0' : '') + min;

        var str = [d.getUTCHours(), min].join(':');

        span.innerHTML = ['<b>', this.rank, '</b> (', this.pointsToString(),
                ') ', str].join('');
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

        if (!name || !confirm(strings.createplayer.replace('%NAME', name))) {
            return;
        }

        var pid = Player.players.length;
        var player = new Player(name, pid);

        Player.players[pid] = player;
        
        Player.sort();
        
        Game.checkConstellations();
    };
    
    function randpick(arr) {
        if (!arr || !arr.length) {
            return undefined;
        }
        
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    function invalidGames() {
        var g = Game.games;
        var i;
        var out = [];   // two-dimensional array of players
        //  indexing: out[A.pid][g1.B, g2.B, g3.B, ...]
        
        i = Player.players.length;
        
        while (i) {
            --i;
            
            out[i] = [];
        }
        
        i = g.length;
        while (i) {
            --i;
            
            if (g[i].state !== strings.game.finished) {
                continue;
            }
            
            out[g[i].A].push(g[i].B);
            out[g[i].B].push(g[i].A);
        }
        
        return out;
    }
    
    // This function builds a list of possible team constellations
    // It is intended to be used to calculate game weights and random pick
    // one constellation automagically
    // This function doesn't use the Player class internally. PIDs are used.
    function possibleConstellations() {
        var available = []; // pids of available players
        var out = [];   // possible constellations
        var invalids = [];
        var rapids = [];
        var forcerapid = false;
        var tmp;
        
        var a, b; // players of one team
        var i = Player.players.length;
        
        // build list of available players
        while (i) {
            --i;
            
            if (Player.players[i].state === strings.state.object.avail) {
                available.push({pid: i, rnd: Math.random()});
            } else if (Player.players[i].state === strings.state.object.rapid) {
                available.push({pid: i, rnd: Math.random()});
                rapids.push({pid: i, rnd: Math.random()});
            }
        }
        
        if (rapids.length >= 2) {
            available = rapids;
        } else if (rapids.length) {
            forcerapid = true;
        }
        
        // a game requires four players
        if (available.length < 2) {
            return undefined;
        }
        
        invalids = invalidGames();

        available.sort(function (a, b) {
            return a.rnd - b.rnd;
        });

        // build all possible constellations
        a = available.length;
        while (a) {
            --a;
            
            b = a;
            while (b) {
                --b;
                
                if (invalids[available[a].pid].indexOf(available[b].pid) !== -1) {
                    continue;
                }
                
                if (forcerapid) {
                    i = rapids.length;
                    tmp = false;
                    // all rapids have to be included
                    while (i) {
                        --i;
                        if (available[a].pid != rapids[i].pid &&
                                available[b].pid != rapids[i].pid) {
                            tmp = true;
                            break;
                        }

                    }

                    if (tmp) {
                        continue;
                    }
                }

                out.push([available[a].pid, available[b].pid]);
                if (out.length === 500000) {
                    a = 0;
                    b = 0;
                }
            }
        }
        
        if (out.length === 0 && rapids === available) {
            return [[rapids[0].pid, rapids[1].pid]];
        }
        
        return out;
    }
    
//  function for creating a new game and assigning teams
    function newgame() {
        
        gamebutton.disabled = true;
        allgamesbutton.disabled = true;
        
        var c;
        
        if (Game.constellations === undefined) {
            alert(strings.notenoughplayers);
            return;
        }
        
        if (Game.constellations.length === 0) {
            alert(strings.nogamepossible);
            return;
        }
        
        c = randpick(Game.constellations);
        
        Game.add(c[0], c[1]);
    }
    
    Game.checkConstellations = function () {
        Game.constellations = possibleConstellations();
        
//        if (Game.constellations) {
//            console.log('# possible constellations: ' + Game.constellations.length);
//        }
//        else {
//            console.log('no games possible')
//        }
        
        if (!Game.constellations || Game.constellations.length === 0) {
            gamebutton.disabled = true;
            allgamesbutton.disabled = true;
        } else {
            gamebutton.disabled = false;
            allgamesbutton.disabled = false;
        }
    };
        
    Game.prototype.toString = function () {
        return [this.A, this.B, this.scoreA,
                this.scoreB, this.time, this.state].join(' ');
    };

    Game.prototype.fromString = function (str) {
        var arr = str.split(' ');
        this.A = Number(arr[0]);
        this.B = Number(arr[1]);
        
        this.scoreA = Number(arr[2]);
        this.scoreB = Number(arr[3]);

        this.time = Number(arr[4]);

        this.state = arr[5];

        return this;
    };

    Game.clearDOM = function () {
        var classes = document.getElementsByClassName('game');
        var i = classes.length;

        while (i) {
            --i;
            classes[i].parentNode.removeChild(classes[i]);
        }
    };

    Game.prototype.appendToDOM = function () {
        if (this.state !== strings.game.running) {
            return;
        }
        
        // bind player status
        Player.get(this.A).setStatus(strings.state.playing);
        Player.get(this.B).setStatus(strings.state.playing);
        
        Player.sort();

        var that = this;
        var element;
        var begin;
        var interval;

        // add function to control state
        function endgame(scorea, scoreb, isinvalid) {
            that.scoreA = Number(scorea);
            that.scoreB = Number(scoreb);
            
            isinvalid = !!isinvalid;
            
            var d = new Date();
            d.setTime(d.getTime() - begin.getTime());

            that.time = d.getTime();
            that.state = isinvalid ? strings.game.invalid : strings.game.finished;

            clearInterval(interval);
            
            element.parentNode.removeChild(element);

            Player.get(that.A).setStatus(strings.state.avail);
            Player.get(that.B).setStatus(strings.state.avail);

            if (storage) {
                saveAll();
            }
            
            Player.calcPoints();
            Player.checkGameLimits();
            Player.updateInfos();
            
            Game.checkConstellations();
        }

        // bind to DOM
        element = document.createElement('div');
        element.innerHTML = templates.game.innerHTML.
            replace('%A', Player.getName(this.A)).
            replace('%B', Player.getName(this.B)).
            replace('%GAME', this.gid);
        element.className = templates.game.className;
        element.id = templates.game.id + this.gid;

        // add timer
        var timer = element.getElementsByTagName('span')[0];
        timer.innerHTML = strings.timedefault;
        begin = new Date();

        if (this.time !== 0) {
            begin.setTime(this.time);
        } else {
            this.time = begin.getTime();
        }
        
        function checkTimeLimit(milliseconds) {
            if (milliseconds >= Game.timelimit * 60000 && !/abovetimelimit/.test(element.className)) {
                element.className += ' abovetimelimit';
            } else if (/abovetimelimit/.test(element.className)) {
                element.className = element.className.split(' ').slice(0, 2).join(' ');
            }
            
            return milliseconds;
        }
        
        // set timer
        interval = setInterval(function () {
            var d = new Date();
            d.setTime(checkTimeLimit(d.getTime() - begin.getTime()));
            var min = d.getUTCMinutes();
            var sec = d.getUTCSeconds();
            min = (min < 10 ? '0' : '') + min;
            sec = (sec < 10 ? '0' : '') + sec;

            timer.innerHTML = [d.getUTCHours(), min, sec].join(':');
        }, 1000);

        // finally add to DOM
        gamelist.insertBefore(element, gamelist.firstChild.nextChild);

        // bind endbutton
        var endbutton = element.getElementsByClassName('endbutton')[0];
        endbutton.addEventListener('click', function () {
            var scorea = element.getElementsByClassName('left')[0].
                    getElementsByClassName('score')[0].value;
            var scoreb = element.getElementsByClassName('right')[0].
                    getElementsByClassName('score')[0].value;
                
            var isinvalid = false;

            if (scorea === scoreb) {
                if (scorea == 0 && confirm(strings.abortgame)) {
                    isinvalid = true;
                } else {
                    alert(strings.invalidresult);
                    return;
                }
            }
            
            if (!isinvalid) {
                var str = strings.endgame;
                str = str.replace('%A%', Player.players[that.A].name);
                str = str.replace('%B%', Player.players[that.B].name);
                str = str.replace('%S1%', Number(scorea));
                str = str.replace('%S2%', Number(scoreb));
            }
            
            if (isinvalid || confirm(str)) {
                endgame(scorea, scoreb, isinvalid);
            }
        }, false);
    };

//  function for adding a game to the game list
    Game.add = function (A, B) {
        // init Game
        var gid = Game.games.length;
        var game;
        
        if (typeof A === 'number') {
            A = Player.players[A];
        }
        if (typeof B === 'number') {
            B = Player.players[B];
        }
        
        game = new Game(A.pid, B.pid, gid);
        Game.games[gid] = game;

        game.appendToDOM();

        saveAll();
// 55555        localStorage.setItem(strings.keys.numgames, Game.games.length);
        
        Game.checkConstellations();
        
        alert([A.name, 'gg.', B.name].join('\n'));
    };
    
    function parseFileContent(txt) {
        if (!txt) {
            return;
        }
        
        var numplayers;
        var numgames;
        var lines;
        var i;
        var tmp;
        
// reset everything
        localStorage.clear();
        
        Player.clearDOM();
        Player.players = [];
        Game.clearDOM();
        Game.games = [];
        
        lines = txt.split('\n');
        tmp = lines.shift().split(' ');
        numplayers = Number(tmp[0]);
        Game.timelimit = Number(tmp[1]);
        timelimitbox.value = Game.timelimit;
        i = numplayers;
        
        while (i) {
            --i;
            tmp = new Player();
            tmp.fromString(lines.shift());
            Player.players.push(tmp);
        }
        
        tmp = lines.shift().split(' ');
        numgames = Number(tmp[0]);
        Player.mingames = Number(tmp[1]);
        Player.maxgames = Number(tmp[2]);

        while (numgames) {
            --numgames;

            tmp = new Game();
            tmp.fromString(lines.shift());
            Game.games.push(tmp);
        }

        // don't trust file data: recalculate the points
        Player.calcPoints();

        // skip the "result lines"
        i = numplayers;
        while (i) {
            --i;
            lines.shift();
        }

        Player.sort();
        
        Player.updateMinMax();
        
        numgames = Game.games.length;
        for (i = 0; i < numgames; ++i) {
            Game.games[i].appendToDOM();
        }
        
        Game.checkConstellations();
        
        if (storage) {
            saveAll();
        }
    }
    
    function createFileContent() {
        var lines = [];
        var i = 0;
        var max = 0;
        var p;
        
        // write number of players to first line:
        lines.push([Player.players.length, Game.timelimit].join(' '));
        
        // add players to string
        max = Player.players.length;
        for (i = 0; i < max; ++i) {
            lines.push(Player.players[i].toString());
        }
        
        // add games to string
        max = Game.games.length;
        lines.push([max, Player.mingames, Player.maxgames].join(' '));
        for (i = 0; i < max; ++i) {
            lines.push(Game.games[i].toString());
        }
        
        // add results
        max = Player.players.length;
        for (i = 0; i < max; ++i) {
            p = Player.players[i];
            lines.push([i, p.games, p.siege, p.buchholz, p.feindbuchholz, 
                    p.netto].join(' '));
        }
        
        // return complete string
        return lines.join('\n');
    }
    
    function supports_html5_storage() {
        try {
            if (!window.localStorage) {
                return false;
            }
            
            localStorage.setItem('testkey', 5);
            
            if (Number(localStorage.getItem('testkey')) !== 5) {
                return false;
            }
            
            if (/irefox/.test(navigator.userAgent) &&
                    /file/.test(location.href)) {
                return false;
            }
            
            return true;
            
        } catch (e) {
            return false;
        }
    }
    
    function beforeunload() {
        window.onbeforeunload = null;
        
        if (!storage) {
            return strings.alllost;
        } else {
            return strings.allsaved;
        }
        
    }

    storage = supports_html5_storage();

    document.getElementById('confirmdatabase').addEventListener('change',
        function () {
            var cdb = document.getElementById('cleardatabase');
            cdb.disabled = !document.getElementById('confirmdatabase').checked;
            
        }, false);

    document.getElementById('cleardatabase').addEventListener('click',
        function () {
            if (confirm(strings.clearall)) {
                localStorage.clear();
                window.onbeforeunload = null;
                location.reload();
            }
        }, false);

// remove warning
    if (storage) {
        warning.parentNode.removeChild(warning);
    } else {
        warning.innerHTML = strings.err.nostorage;
        warning.setAttribute('style', 'font-size: 100%');
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

    allgamesbutton.addEventListener('click', function () {
        while (Game.constellations && Game.constellations.length) {
            newgame();
        }
    }, false);

    window.onbeforeunload = beforeunload;

    savebutton.addEventListener('click', function () {
        
        if (storage) {
            saveAll();
        }
        
        var win = window.open();
        var area = win.document.createElement('textarea');
        var p = win.document.createElement('p');
        p.appendChild(win.document.createTextNode(strings.copythis));
        area.setAttribute('style', 'width: 90%; height: 90%');
        area.value = createFileContent();
        win.document.body.appendChild(p);
        win.document.body.appendChild(area);
        
    }, false);

    loadbutton.addEventListener('click', function () {
        
        var win = window.open();
        var area = win.document.createElement('textarea');
        area.setAttribute('style', 'height: 90%; width: 90%');
        var p = win.document.createElement('p');
        p.appendChild(win.document.createTextNode(strings.pastehere));
        var button = win.document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'Laden');
        
        button.addEventListener('click', function () {
            parseFileContent(area.value);
            win.close();
        }, false);
        
        p.appendChild(button);
        win.document.body.appendChild(p);
        win.document.body.appendChild(area);
        
    }, false);
    
    function copyArray(orig, testfunc) {
        var arr = [];
        var imax = orig.length;
        var i;
        for (i = 0; i < imax; ++i) {
            if (testfunc && testfunc(orig[i])) {
                arr.push(orig[i]);
            }
        }

        return arr;
    }
    
    function rd(x) {
        return Math.round(x * 10) / 10;
    }
    
    function percent(x) {
        return Math.round(x * 100);
    }
    
    function calcResults() {
        var out = [];   // array of 'result objects'
        var days = [];  // array of all days, holding their results
        var p = Player.players; // reference

        var r;  // results of a specific day and player; tmpvar
        var n;  // number of games on a day

        var j;  // counter variable
        var i = p.length;   // another counter variable

        while (i) {
            --i;
            out[i] = {name: p[i].name,
                    pid: i,
                    days: []
                };
            
            days = out[i].days;

            // add current day
            n = p[i].games;
            days[0] = {
                n: p[i].games,

                s: p[i].siege,
                bh: p[i].buchholz,
                fbh: p[i].feindbuchholz,
                net: p[i].netto,

                rs: p[i].siege / n,
                rbh: p[i].buchholz / n,
                rfbh: p[i].feindbuchholz / n,
                rnet: p[i].netto / n,

                counts: (n >= Player.mingames),

                toString: function () {
                    return [percent(this.rs), '%, ', [rd(this.rbh),
                            rd(this.rfbh), rd(this.rnet)].join(', '), ' (',
                            this.n, ')'].join('');
                }
            };

            out[i].bestDays = days; // no sort necessary
        }

        return out;
    }

    function listPlayers(results) {
        var out = [];
        
        var i;
        var imax = results.length;

        for (i = 0; i < imax; ++i) {
            out.push([results[i].name, undefined]);
        }

        return out;
    }

    function bestDays(results, numdays) {
        numdays = numdays || 1;
        
        var arr = [];
        var out = [];
        var i = Player.players.length;
        var o;  // temporary object
        var j;  // day counter
        while (i) {
            --i;
            if (results[i].bestDays.length < numdays) {
                continue;
            }

            o = {
                rs: 0,
                rbh: 0,
                rfbh: 0,
                rnet: 0,
                n: 0,

                toString: function () {
                    return [percent(this.rs), '%, ', [rd(this.rbh),
                            rd(this.rfbh), rd(this.rnet)].join(', '), ' (',
                            this.n, ')'].join('');
                },

                append: function (o) {
                    this.rs += o.rs;
                    this.rbh += o.rbh;
                    this.rfbh += o.rfbh;
                    this.rnet += o.rnet;

                    this.n += Number(o.n);
                },

                finish: function () {
                    this.rs /= numdays;
                    this.rbh /= numdays;
                    this.rfbh /= numdays;
                    this.rnet /= numdays;
                }
            };

            for (j = 0; j < numdays; ++j) {
                o.append(results[i].bestDays[j]);
            }

            o.finish();

            arr.push({pid: i, day: o});

        }

        arr.sort(function (a, b) {
            if (a.day.rs !== b.day.rs) {
                return a.day.rs - b.day.rs;
            }
            if (a.day.rbh !== b.day.rbh) {
                return a.day.rbh - b.day.rbh;
            }
            if (a.day.rfbh !== b.day.rfbh) {
                return a.day.rfbh - b.day.rfbh;
            }
            return a.day.rnet - b.day.rnet;
        });
        
        i = arr.length;
        while (i) {
            --i;
            out.push([Player.players[arr[i].pid].name, arr[i].day.toString()]);
        }

        return out;
    }

    function listDay(results, j) {
        var out = [];   // return array with name and values
        var arr = [];   // array of special object (pid and results)

        var i = Player.players.length;

        function sortfunc(a, b) {
            if (a.day.rs !== b.day.rs) {
                return a.day.rs - b.day.rs;
            }
            if (a.day.rbh !== b.day.rbh) {
                return a.day.rbh - b.day.rbh;
            }
            if (a.day.rfbh !== b.day.rfbh) {
                return a.day.rfbh - b.day.rfbh;
            }
            return a.day.rnet - b.day.rnet;
        }
        
        while (i) {
            --i;
            if (results[i].days[j].counts) {
                arr.push({pid: i,
                        day: results[i].days[j]
                    });
            }
        }

        arr.sort(sortfunc);
        i = arr.length;
        while (i) {
            --i;
            out.push([Player.players[arr[i].pid].name, arr[i].day.toString()]);
        }

        return out;
    }

    function updateGameLimits() {
        Player.mingames = Number(mingamesbox.value);
        Player.maxgames = Number(maxgamesbox.value);

        Player.checkGameLimits();

        Game.checkConstellations();

        saveAll();
    }

    function updateTimeLimit() {
        Game.timelimit = Number(timelimitbox.value);
        saveAll();
    }

    function getGamesArray() {
        
        return [Game.games];
    }
    
    function getPlayTimeOverview(games) {
        var out = [];   // return array with name and values
        var arr = [];   // array of special object (time and numgames)
        var g;  // tmparr of games of one day
        var o;  // tmp object

        var i = Player.players.length;
        var j;
        
        // fill arr with objects capable of getting sorted
        // (i.e. holding time and numgames
        while (i) {
            --i;
            
            arr[i] = {pid: i, n: 0, t: 0,
                toString: function () {
                    var d = new Date(this.t);
                    var h = d.getUTCHours();
                    var min = d.getUTCMinutes();
                    var sec = d.getUTCSeconds();
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (sec < 10) {
                        sec = '0' + sec;
                    }
                    return [h, ':', min, ':', sec, ' (', this.n, ')'].join('');
                }
            };
        }
        
        // iterate over all games
        i = games.length;
        while (i) {
            --i;
            g = games[i];
            j = g.length;
            
            while (j) {
                --j;
                o = g[j];
                if (o.state === strings.game.finished) {
                    arr[o.A].t += o.time;
                    arr[o.B].t += o.time;

                    arr[o.A].n += 1;
                    arr[o.B].n += 1;
                }
            }
        }
        
        // calc playtime per game
        
        i = arr.length;
        while (i) {
            --i;
            if (arr[i].n) {
                arr[i].t /= arr[i].n;
            }
        }

        // sort by relative playtime
        
        arr.sort(function (a, b) {
            return a.t - b.t;
        });
        
        i = arr.length;
        while (i) {
            --i;
            if (arr[i].n) {
                out.push([Player.players[arr[i].pid].name, arr[i].toString()]);
            }
        }

        return out;
    }

    Game.prototype.toOverviewString = function () {
        var p = Player.players;
        var timestr = '';
        var d = new Date(this.time);
        var h;
        var min;

        if (this.state === strings.game.finished) {
            h = d.getUTCHours();
            min = d.getUTCMinutes();
            if (min < 10) {
                min = '0' + min;
            }

            timestr = [' (', h, ':', min, ')'].join('');
        }

        return ['<p><b>', p[this.A].name, ' : ',
                p[this.B].name, '</b><br>',
                this.scoreA, ' : ', this.scoreB, timestr, '</p>'].join('');
    };
    
    document.getElementById('overview').addEventListener('click', function () {
        
        var win = window.open();    // the popup window to show the overview in
        var doc = win.document; // its document
        var body = doc.body;    // its body

        var i;  // counter variable 1
        var imax;   // its maximum
        var j;  // counter variable 2
        var jmax;   // its maximum
        
        var table = doc.createElement('table'); // the table of results
        var tr; // the row to be filled and appended
        var td; // current cell
        var ul; // list within the cell
        var li; // one of its elements
        var a;  // sub-array (containing data for current column)
        var array = [];  // four-dimensional array for the data. Format:
        var games = getGamesArray();
        var style;

        var cnt;    // counter variable
        // [[Name, [[Player, Points], ...]], ...]

        var results = calcResults();

        // filling array
        array.push(["Teilnehmer", listPlayers(results)]);

        array.push(["Spielzeit (pro Spiel)", getPlayTimeOverview(games)])
        
        imax = 1;
        for (i = 1; i <= imax; ++i) {
            array.push([i !== 1 ? ['Beste', i, 'Tage'].join(' ') : 'Bester Tag',
                    bestDays(results, i)]);
        }

//        for (i = 0; i < imax; ++i) {
//            array.push(["Tag " + (i + 1), listDay(results, i)]);
//        }

        // create row of headers
        tr = doc.createElement('tr');

        // fill headers with descriptions from the array
        imax = array.length;
        for (cnt = 0, i = 0; i < imax; ++i) {
            if (array[i][1].length) {
                td = doc.createElement('th');
                style = 'min-width: 200 px; ';

                if (cnt++ % 2) {
                    style += 'background-color: lightgrey; ';
                }
                
                td.setAttribute('style', style);

                td.appendChild(doc.createTextNode(array[i][0]));
                tr.appendChild(td);
            }
        }
        
        table.appendChild(tr);
        
        // create content row (there's just one, internals are lists!)
        tr = doc.createElement('tr');
        tr.setAttribute("valign", "top");   // cheap hack

        imax = array.length;
        for (cnt = 0, i = 0; i < imax; ++i) {
            td = doc.createElement('td');
            style = 'min-width: 200 px; ';
            
            ul = doc.createElement('ol');

            a = array[i][1];
            jmax = a.length;
            if (!jmax) {
                continue;
            }

            if (cnt++ % 2) {
                style += 'background-color: lightgrey; ';
            }

            td.setAttribute('style', style);

            for (j = 0; j < jmax; ++j) {
                li = doc.createElement('li');

                // cheap hack ahead
                if (a[j][1] !== undefined) {
                    li.innerHTML = '<b>' + a[j][0] + '</b><br />' + a[j][1];
                } else {
                    li.innerHTML = '<b>' + a[j][0] + '</b>';
                }

                ul.appendChild(li);
            }
            
            td.appendChild(ul);
            tr.appendChild(td);
        }

        table.appendChild(tr);

        body.appendChild(table);

        ////////
        // create games overview
        ////////

        table = doc.createElement('table');

        // create row of headers
        tr = doc.createElement('tr');

        // fill headers with descriptions from the games array
        imax = games.length;
        for (i = 0; i < imax; ++i) {
            td = doc.createElement('th');
            style = 'min-width: 350 px; ';

            if (i % 2) {
                style += 'background-color: lightgrey; ';
            }

            td.setAttribute('style', style);

            td.appendChild(doc.createTextNode('Tag ' + (i + 1)));
            tr.appendChild(td);
        }

        table.appendChild(tr);

        // create content row (there's just one, internals are lists!)
        tr = doc.createElement('tr');
        tr.setAttribute("valign", "top");   // cheap hack

        for (i = 0; i < imax; ++i) {
            td = doc.createElement('td');
            style = 'min-width: 350 px; text-align: center; ';

            ul = doc.createElement('ol');

            a = games[i];
            jmax = a.length;
            if (!jmax) {
                continue;
            }

            if (i % 2) {
                style += 'background-color: lightgrey; ';
            }

            td.setAttribute('style', style);

            for (j = 0; j < jmax; ++j) {
                li = doc.createElement('li');

                // cheap hack ahead
                li.innerHTML = a[j].toOverviewString();
                
                ul.appendChild(li);
            }

            td.appendChild(ul);
            tr.appendChild(td);
        }

        table.appendChild(tr);

        body.appendChild(table);
        
    }, false);
    
    document.getElementById('ok').addEventListener('click', function () {
        updateTimeLimit();
        updateGameLimits();
    }, false);
    
//    timelimitbox.addEventListener('change', updateTimeLimit, false);
    timelimitbox.addEventListener('blur', updateTimeLimit, false);
    mingamesbox.addEventListener('blur', updateGameLimits, false);
    maxgamesbox.addEventListener('blur', updateGameLimits, false);

    function saveAll() {
        localStorage.setItem('all', createFileContent());
    }

    function restoreAll() {
        var txt = localStorage.getItem('all');
        if (txt) {
            parseFileContent(txt);
        }
    }

    if (storage) {

        restoreAll();

        Player.calcPoints();
        Player.checkGameLimits();
    }
    
}, false);
