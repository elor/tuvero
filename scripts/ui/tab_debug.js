define([ './tabshandle', './opts', './toast', '../backend/random', './options',
    './strings', './update', './tournaments', './team' ], function (Tabshandle, Opts, Toast, Random, Options, Strings, Update, Tournaments, Team) {
  var Tab_Debug, $tab, form, options, letters, Letters, rng;

  Tab_Debug = {};
  options = {};

  rng = new Random();

  letters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
  Letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

  function showAllImages () {
    var $anchor, $images, imagepaths, i, url, sorted;

    $anchor = $tab.find('.allimages');
    $images = $('img');
    images = {};

    for (i = 0; i < $images.length; i += 1) {
      url = $images.eq(i).attr('src');
      if (/^(https?:\/\/)?images/.test(url)) {
        images[url] = true;
      }
    }

    $images = $('input[type="image"]');
    for (i = 0; i < $images.length; i += 1) {
      url = $images.eq(i).attr('src');
      if (/^(https?:\/\/)?images/.test(url)) {
        images[url] = true;
      }
    }

    sorted = [];

    for (url in images) {
      sorted.push(url);
    }

    sorted.sort();

    for (i = 0; i < sorted.length; i += 1) {
      url = sorted[i];
      $anchor.append($('<img>').attr('src', url).attr('alt', url).attr('title', url));
    }
  }

  function randomName () {
    var first, last, length, i;

    length = rng.nextInt(6) + 3;
    first = '';
    first += rng.pick(Letters);
    for (i = 0; i < length; i++) {
      first += rng.pick(letters);
    }

    length = rng.nextInt(6) + 3;
    last = '';
    last += rng.pick(Letters);
    for (i = 0; i < length; i++) {
      last += rng.pick(letters);
    }

    return first + ' ' + last;
  }

  function updateTabs () {
    require('./alltabs').update();
    new Toast(Strings.alltabsreloaded);
  }

  function loadMods () {
    var key, keyparts, rjsdef, subobject, partid, part, mods;

    if (window.mods !== undefined) {
      return;
    }

    rjsdef = require.s.contexts._.defined;
    if (!rjsdef) {
      console.error('require.s.contexts._.defined is undefined');
      return;
    }

    mods = window.mods = {};

    // add every key to mods, which is similar to the directory tree
    for (key in rjsdef) {
      keyparts = key.split('/');
      // change the key words for a global naming scheme
      if (keyparts.length === 1) {
        keyparts.unshift('ui');
      }
      if (keyparts[0] === '..') {
        keyparts.shift();
      }

      subobject = mods;

      // search the position of the key, add new objects as necessary
      for (partid = 0; partid < keyparts.length; ++partid) {
        part = keyparts[partid];
        if (partid >= keyparts.length - 1) {
          subobject[part] = rjsdef[key];
        } else {
          if (subobject[part] === undefined) {
            subobject[part] = {};
          }

          subobject = subobject[part];
        }
      }
    }

    new Toast(Strings.modsvariableadded);
  }

  function clearEverything () {
    var Storage, Alltabs, State, Tab_Settings;

    Storage = require('./storage');
    Alltabs = require('./alltabs');
    State = require('./state');
    Tab_Settings = require('./tab_settings');

    Storage.enable();
    Storage.clear();
    Alltabs.reset();
    State.reset();
    Alltabs.update();

    new Toast(Strings.newtournament);
  }

  function registerPlayers () {
    var num, Tab_Teams, teamno, $template, $names, playerno;

    Tab_Teams = require('./tab_teams');

    if (!Tab_Teams.getOptions().allowRegistrations) {
      new Toast(Strings.registrationclosed);
      return;
    }

    num = Number(form.register.$num.val());

    $template = $('#newteam');
    $names = $template.find('.playername');

    for (teamno = 0; teamno < num; ++teamno) {
      for (playerno = 0; playerno < $names.length; ++playerno) {
        $($names[playerno]).val(randomName());
      }
      $template.submit();
    }
  }

  function startRound (tournamentid) {
    var $button, Tab_Games, $boxes, $box, i;

    if (!$box) {
      return undefined;
    }

    Tab_Games = require('./tab_games');

    if (Tab_Games.getOptions().stage === 1) {
      new Toast(Strings.roundrunning.replace(/%s/g, ''));
    } else {
      $('#new .swiss button').click();
    }
  }

  function finishRound (tournamentid, timeout) {
    var $buttons, $points, teamid, p1, p2, endtime, $boxes, $box, i;

    if (tournamentid === undefined) {
      $box = $('#games');
    } else {
      $boxes = $('#games .box');
      for (i = 0; i < $boxes.length; i += 1) {
        if ($boxes.eq(i).data('tournamentid') === tournamentid) {
          $box = $boxes.eq(i);
        }
      }
    }

    if (!$box) {
      return undefined;
    }

    $points = $box.find('.game .finish .points');
    $buttons = $box.find('.game .finish button');

    if (timeout === 0) {
      timeout = -1;
    }
    timeout = timeout || undefined;

    if (timeout) {
      endtime = new Date().getTime() + timeout;
    }

    for (teamid = 0; teamid < $buttons.length; teamid += 1) {
      if (rng.nextInt(2)) {
        p1 = 13 - rng.nextInt(2);
        p2 = rng.nextInt(p1);
      } else {
        p2 = 13 - rng.nextInt(2);
        p1 = rng.nextInt(p2);
      }

      $points.eq(teamid * 2).val(p1);
      $points.eq(teamid * 2 + 1).val(p2);
      $buttons.eq(teamid).removeAttr('disabled').click();

      if (timeout && (new Date()).getTime() >= endtime) {
        break;
      }
    }
  }

  function playTournament () {
    var tournamentid, Tournament;

    starttime = new Date();
    for (tournamentid = 0; tournamentid < Tournaments.numTournaments(); tournamentid += 1) {

      if (!Tournaments.isRunning(tournamentid)) {
        continue;
      }

      Tournament = Tournaments.getTournament(tournamentid);

      if (Tournament.getState() != 1) {
        startRound(tournamentid) || startRound(tournamentid) || startRound(tournamentid);
      }

      if (Tournament.getState() == 1) {
        finishRound(tournamentid, 1000);
        window.setTimeout(playTournament, 1);
      } else {
        new Toast(Strings.tournamentfinished, Toast.LONG);
      }
    }
  }

  /**
   * starts a new sidetournament with a random selection of the players (2 min)
   */
  function addSideTournament (type) {
    var min, max, numplayers, Tournament, players, tournamentid;

    min = 2;
    max = Team.count();

    if (max <= min) {
      new Toast(Strings.notenoughteams);
      return undefined;
    }

    numplayers = rng.nextInt(max - min) + min;

    Tournament = Tournaments.addTournament(type);

    if (!Tournament) {
      console.error('tournament type not accepted');
      return undefined;
    }

    tournamentid = Tournaments.getTournamentID(Tournament);
    Tournaments.setName(tournamentid, type + ' Sidetournament ID' + tournamentid);

    players = [];

    while (players.length < Team.count()) {
      players.push(players.length);
    }

    while (numplayers -= 1) {
      Tournament.addPlayer(rng.pickAndRemove(players));
    }

    Tournament.start();
    if (Tournament.getRanking().byevote[0]) {
      History.addVote(tournamentid, Tournament.getRanking().ids[0], 0, 0);
    }

    require('./storage').store();
    updateTabs();
    new Toast(Strings.roundstarted.replace('%s', 1));
  }

  function initForms () {
    var $gameform, $gnames, $gteamnos, $vote, i, tmp;

    if (form) {
      console.error('tab_debug: form is already defined:');
      console.error(form);
      return;
    }

    // get the jquery objects
    form = {
      register : {
        $form : $tab.find('.register'),
        $num : $tab.find('.register .num'),
        $submit : $tab.find('.register .submit'),
        $delete : $tab.find('.register .delete'),
      },
      games : {
        $form : $tab.find('.tournament'),
        $startRound : $tab.find('.tournament .start'),
        $finishRound : $tab.find('.tournament .round'),
        $playTournament : $tab.find('.tournament .all'),
      },
      phases : {
        $form : $tab.find('.phases'),
        $sideTournamentSwiss : $tab.find('.phases .sidetournamentswiss'),
      },
      script : {
        $form : $tab.find('.script'),
        $loadmods : $tab.find('.script .loadmods'),
        $updatetabs : $tab.find('.script .updatetabs'),
      }
    };

    // register buttons and stuff
    form.register.$form.submit(function (e) {
      registerPlayers();
      e.preventDefault();
      return false;
    });
    form.register.$delete.click(function (e) {
      clearEverything();
      e.preventDefault();
      return false;
    });
    form.games.$startRound.click(function (e) {
      startRound();
      e.preventDefault();
      return false;
    });
    form.games.$finishRound.click(function (e) {
      finishRound();
      e.preventDefault();
      return false;
    });
    form.games.$playTournament.click(function (e) {
      playTournament();
      e.preventDefault();
      return false;
    });
    form.phases.$sideTournamentSwiss.click(function (e) {
      addSideTournament('swiss');
      e.preventDefault();
      return false;
    });
    form.script.$loadmods.click(function (e) {
      loadMods();
      e.preventDefault();
      return false;
    });
    form.script.$updatetabs.click(function (e) {
      updateTabs();
      e.preventDefault();
      return false;
    });

    updateForms();
  }

  function updateForms () {
  }

  function init () {
    if ($tab) {
      console.error('tab_debug: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#debug');

    initForms();
    showAllImages();
  }

  /**
   * reset an original state.
   */
  Tab_Debug.reset = function () {
    if (!$tab) {
      init();
    }

    Tabshandle.hide('debug');

    // reset everything
    updateForms();
  };

  /**
   * reset an original game state, respecting the current state
   */
  Tab_Debug.update = function () {
    Tab_Debug.reset();

    if (Update.isDevVersion) {
      loadMods();
    } else {
      // FIXME run only once
      $('.devonly').remove();
    }
  };

  Tab_Debug.getOptions = function () {
    return Opts.getOptions({
      options : options
    });
  };

  Tab_Debug.setOptions = function (opts) {
    return Opts.setOptions({
      options : options
    }, opts);
  };

  return Tab_Debug;
});
