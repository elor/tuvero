/**
 * Model, View and Controller of the debugging tab.
 *
 * @return Tab_Debug
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./tabshandle', './tab', './toast', '../backend/random', 'options',
    './strings', './debug', './tournaments', './team', './history', './shared'], function(Tabshandle, Tab, Toast, Random, Options, Strings, Debug, Tournaments, Team, History, Shared) {
  var Tab_Debug, $tab, form, letters, Letters, rng;

  rng = new Random();
  form = undefined;

  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä',
      'ö', 'ü', 'ß'];
  Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ä',
      'Ö', 'Ü'];

  function showAllImages() {
    var $anchor, $images, imagepaths, i, url, sorted, images;

    $anchor = $tab.find('.allimages');
    $images = $('img');
    images = {};

    for (i = 0; i < $images.length; i += 1) {
      url = $images.eq(i).attr('src');
      if (/^(https?:\/\/)?images/.test(url)) {
        images[url] = true;
      }
    }

    $images = $('[data-img]');
    for (i = 0; i < $images.length; i += 1) {
      url = $images.eq(i).attr('data-img');
      images['images/' + url] = true;
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
      if (/^(images\/)?sprite(.png)?$/.test(url)) {
        continue;
      }
      sorted.push(url);
    }

    sorted.sort();

    for (i = 0; i < sorted.length; i += 1) {
      url = sorted[i];
      $anchor.append($('<div>').attr('data-img', url.replace(/^images\//, '').replace(/\.png$/, '')));
    }
  }

  function randomName() {
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

  function updateTabs() {
    Shared.Alltabs.update(true);
    new Toast(Strings.alltabsreloaded);
  }

  function loadMods() {
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

  function clearEverything() {
    var Storage, Alltabs, State, Tab_Settings;

    Storage = Shared.Storage;
    Alltabs = Shared.Alltabs;
    State = Shared.State;
    Tab_Settings = Shared.Tab_Settings;

    Storage.enable();
    Storage.clear();
    Alltabs.reset();
    State.reset();
    Alltabs.update();

    new Toast(Strings.newtournament);
  }

  function registerPlayers() {
    var num, teamno, $template, $names, playerno;


    num = Number(form.register.$num.val());

    $template = $('#teams .newteamview');
    $names = $template.find('.playername');

    for (teamno = 0; teamno < num; ++teamno) {
      for (playerno = 0; playerno < $names.length; ++playerno) {
        $($names[playerno]).val(randomName());
      }
      $template.submit();
    }
  }

  function startRound(tournamentid) {
    var $button, Tab_Games;

    Tab_Games = Shared.Tab_Games;

    $button = $('#new .newsystem button.swiss').eq(0);
    if ($button.length === 1) {
      $button.click();
      // let it render
      window.setTimeout(startRound, 1);
      return false;
    }

    $button = $('#new .swiss button').eq(0);

    if ($button.length !== 1) {
      new Toast(Strings.notenoughteams + '?');
      return false;
    }

    if ($button.parents('.running').length) {
      new Toast(Strings.roundrunning.replace(/%s/g, ''));
      return false;
    }

    $button.click();
  }

  function finishRound(tournamentid, timeout) {
    var $buttons, $points, teamid, p1, p2, endtime, $boxes, $box, i;

    if (tournamentid === undefined) {
      $box = $('#games');
    } else {
      $boxes = $('#games .boxview');
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

  function playTournament() {
    var tournamentid, Tournament, starttime;

    if (Tournaments.numTournaments() === 0) {
      startRound();
      setTimeout(playTournament, 1);
      return undefined;
    }

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
  function addSideTournament(type) {
    var min, max, numplayers, Tournament, players, tournamentid;

    min = 2;
    max = Team.count();

    if (max < min) {
      new Toast(Strings.notenoughteams);
      return undefined;
    }

    numplayers = rng.nextInt(max - min + 1) + min;

    Tournament = Tournaments.addTournament(type);

    if (!Tournament) {
      console.error('tournament type not accepted');
      return undefined;
    }

    tournamentid = Tournaments.getTournamentID(Tournament);
    Tournaments.setName(tournamentid, type + ' Sidetournament ID' + tournamentid);

    players = Tournaments.getTeams(tournamentid);

    while (players.length < Team.count()) {
      players.push(players.length);
    }

    while ((numplayers -= 1) >= 0) {
      Tournament.addPlayer(rng.pickAndRemove(players));
    }

    Tournament.start();

    if (Tournaments.getRanking(tournamentid).byevote[0]) {
      History.addVote(tournamentid, 0, Tournaments.getRanking(tournamentid).ids[0], 0);
    }

    Shared.Storage.store();
    updateTabs();
    new Toast(Strings.roundstarted.replace('%s', 1));
  }

  function initForms() {
    if (form) {
      console.error('tab_debug: form is already defined:');
      console.error(form);
      return;
    }

    // get the jquery objects
    form = {
      register: {
        $form: $tab.find('.register'),
        $num: $tab.find('.register .num'),
        $submit: $tab.find('.register .submit'),
        $delete: $tab.find('.register .delete')
      },
      games: {
        $form: $tab.find('.tournament'),
        $startRound: $tab.find('.tournament .start'),
        $finishRound: $tab.find('.tournament .round'),
        $playTournament: $tab.find('.tournament .all')
      },
      phases: {
        $form: $tab.find('.phases'),
        $sideTournamentSwiss: $tab.find('.phases .sidetournamentswiss')
      },
      script: {
        $form: $tab.find('.script'),
        $loadmods: $tab.find('.script .loadmods'),
        $updatetabs: $tab.find('.script .updatetabs')
      }
    };

    // register buttons and stuff
    form.register.$form.submit(function(e) {
      registerPlayers();
      e.preventDefault();
      return false;
    });
    form.register.$delete.click(function(e) {
      clearEverything();
      e.preventDefault();
      return false;
    });
    form.games.$startRound.click(function(e) {
      startRound();
      e.preventDefault();
      return false;
    });
    form.games.$finishRound.click(function(e) {
      finishRound();
      e.preventDefault();
      return false;
    });
    form.games.$playTournament.click(function(e) {
      playTournament();
      e.preventDefault();
      return false;
    });
    form.phases.$sideTournamentSwiss.click(function(e) {
      addSideTournament('swiss');
      e.preventDefault();
      return false;
    });
    form.script.$loadmods.click(function(e) {
      loadMods();
      e.preventDefault();
      return false;
    });
    form.script.$updatetabs.click(function(e) {
      updateTabs();
      e.preventDefault();
      return false;
    });

    updateForms();
  }

  function updateForms() {
  }

  function initDevContents() {
    if (Debug.isDevVersion) {
      loadMods();
    } else {
      Tabshandle.hide('debug');
      $('.devonly').remove();
    }
  }

  function init() {
    if ($tab) {
      console.error('tab_debug: $tab is already defined:');
      console.error($tab);
      return;
    }

    $tab = $('#debug');

    initForms();
    showAllImages();
    initDevContents();
  }

  /**
   * reset an original state.
   */
  function reset() {
    if (!$tab) {
      init();
    }

    // reset everything
    updateForms();
  }

  Tab_Debug = Tab.createTab('debug', reset, reset);
  return Tab_Debug;
});
