/**
 * TeamsFileLoadController: loads a whole file and adds its lines as teams
 *
 * Inner workings: An HTML5 FileReader reads all contents as ANSI (ISO-8859-1).
 * It then converts possible UTF-8 byte into utf-8 code points, leaving all
 * other characters in place. This enables the use of both latin-1 and utf-8 as
 * input file encoding.
 *
 * All other encodings are discouraged. DOS-style line endings are filtered by
 * "new TeamModel()". MAC-style line endings can still be a problem.
 *
 * TODO rewrite the whole thing and extract a lot of methods
 *
 * @return TeamsFileLoadController
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/controller', './toast', './strings', 'ui/state',
    './playermodel', './teammodel', 'presets'], function(extend, Controller,
    Toast, Strings, State, PlayerModel, TeamModel, Presets) {

  function numutfbytes(character) {
    var code;

    code = character.charCodeAt();

    switch (true) {
    case code < 0xC0:
      return 1;
    case code >= 0xC0 && code < 0xE0:
      return 2;
    case code >= 0xE0 && code < 0xF0:
      return 3;
    case code >= 0xF0 && code < 0xF8:
      return 4;
    case code >= 0xF8 && code < 0xFC:
      return 5;
    case code >= 0xFC && code < 0xFE:
      return 6;
    }

    return 0;
  }

  function isutf8byte(character) {
    var code;

    code = character.charCodeAt();

    return code >= 0x80 && code < 0xC0;
  }

  function isutf8codepoint(string) {
    var bytes, byteindex;

    bytes = numutfbytes(string[0]);
    if (bytes <= 1) {
      return false;
    }

    for (byteindex = 1; byteindex < bytes; byteindex += 1) {
      if (!isutf8byte(string[byteindex])) {
        return false;
      }
    }

    return true;
  }

  function latin2utf8symbol(characters) {
    var bytes, symbol, byteindex;

    bytes = numutfbytes(characters[0]);

    symbol = characters[0].charCodeAt();
    switch (bytes) {
    case 1:
      return characters[0];
    case 2:
      symbol = symbol ^ 0xC0;
      break;
    case 3:
      symbol = symbol ^ 0xE0;
      break;
    case 4:
      symbol = symbol ^ 0xF0;
      break;
    case 5:
      symbol = symbol ^ 0xF8;
      break;
    case 6:
      symbol = symbol ^ 0xFC;
      break;
    default:
      return characters[0];
    }

    for (byteindex = 1; byteindex < bytes; byteindex += 1) {
      symbol = symbol << 6;
      symbol += characters[byteindex].charCodeAt() ^ 0x80;
    }

    return String.fromCharCode(symbol);
  }

  function latin2utf8(string) {
    var symbolindex, ret, symbol;
    ret = [];

    for (symbolindex = 0; symbolindex < string.length; symbolindex += 1) {

      symbol = string.substr(symbolindex, 6);
      if (isutf8codepoint(symbol)) {
        // skip utf8 bytes
        symbolindex += numutfbytes(symbol) - 1;
        // add utf-8 codepoint instead of its ansi representation
        ret.push(latin2utf8symbol(symbol));
      } else {
        // just display the ansi symbol
        ret.push(string[symbolindex]);
      }
    }

    return ret.join('');
  }

  /**
   * Constructor
   *
   * @param view
   *          an InputView instance of a filereader input
   */
  function TeamsFileLoadController(view) {
    TeamsFileLoadController.superconstructor.call(this, view);

    this.init();
  }
  extend(TeamsFileLoadController, Controller);

  /**
   * reads names from a string and adds the players accordingly. Ignores
   * #-escaped lines
   *
   * @return true on success, undefined or false on failure
   */
  TeamsFileLoadController.parseCSVString = function(str, teamsizeModel) {
    var lines, name, names, i;

    lines = str.split('\n');

    lines = lines.filter(function(line) {
      return line.trim().length !== 0 && !line.trim().match(/^#/);
    }).map(function(line) {
      var match, name, names = [];

      while (line.length > 0) {
        match = (line.match(/^\s*"([^"]+|"")*"\s*(,|$)/) || '');
        match = match || line.match(/^\s*[^,]*\s*(,|$)/);

        name = (match && match[0]) || line;
        line = line.substr(name.length);
        names.push(name);
      }

      return names;
    });

    lines = lines.map(function(names) {
      return names.map(function(name) {
        // remove commas and whitespaces
        name = name.replace(/,$/, '').trim();
        if (name.match(/^".*"$/)) {
          name = name.replace(/^"(.*)"$/, '$1');
          name = name.replace(/""/g, '"');
        }
        return name;
      });
    });

    lines = lines.filter(function(names) {
      return names.join('').length !== 0;
    });

    return lines;
  };

  TeamsFileLoadController.readTeamsize = function(teams) {
    var teamsizes, teamsize;

    if (teams.length === 0) {
      return 0;
    }

    teamsizes = teams.map(function(team) {
      return team.length;
    });

    teamsize = teamsizes[0];

    if (teamsizes.some(function(size) {
      return size !== teamsize;
    })) {
      return 0;
    }

    return teamsize;
  };

  TeamsFileLoadController.prototype.reset = function() {
    this.model.emit('reset');
  };

  TeamsFileLoadController.loadFileError = function(evt) {
    // file api callback function
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      new Toast(Strings.filenotfound);
      break;
    case evt.target.error.NOT_READABLE_ERR:
      new Toast(Strings.filenotreadable);
      break;
    case evt.target.error.ABORT_ERR:
      break;
    default:
      new Toast(Strings.fileerror);
    }

    this.reset();
  };

  TeamsFileLoadController.load = function(csvString) {
    var teams, teamsize;
    csvString = latin2utf8(csvString);

    if (State.teams.length !== 0) {
      new Toast(Strings.teamsnotempty);
      return false;
    }

    teams = TeamsFileLoadController.parseCSVString(csvString, State.teamsize);
    teamsize = TeamsFileLoadController.readTeamsize(teams);

    // validate team size
    if (teamsize >= Presets.registration.minteamsize
        && teamsize <= Presets.registration.maxteamsize) {
      State.teamsize.set(teamsize);
    } else {
      new Toast(Strings.invalidteamsize);
      return false;
    }

    // enter new teams
    teams.forEach(function(names) {
      var players = names.map(function(name) {
        return new PlayerModel(name);
      });

      State.teams.push(new TeamModel(players));
    });

    new Toast(Strings.loaded);

    return true;
  };

  TeamsFileLoadController.loadFileLoad = function(evt) {
    var contents, teams, teamsize;

    contents = evt.target.result;

    this.reset();
    return TeamsFileLoadController.load(contents);
  };

  TeamsFileLoadController.loadFileAbort = function() {
    new Toast(Strings.fileabort);

    this.reset();
  };

  TeamsFileLoadController.prototype.init = function() {
    var controller = this;

    this.view.$view.data('controller', this).change(function(evt) {
      var reader = new FileReader();

      reader.onerror = TeamsFileLoadController.loadFileError.bind(controller);
      reader.onabort = TeamsFileLoadController.loadFileAbort.bind(controller);
      reader.onload = TeamsFileLoadController.loadFileLoad.bind(controller);

      // TODO try different encodings and select the best one
      reader.readAsBinaryString(evt.target.files[0]);
    });
  };

  return TeamsFileLoadController;
});
