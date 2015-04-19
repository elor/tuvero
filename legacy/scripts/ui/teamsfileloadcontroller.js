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
define(['lib/extend', 'core/controller', './team', './toast', './strings',
    './state_new'], function(extend, Controller, Team, Toast, Strings, State) {

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
  TeamsFileLoadController.createTeamsFromString = function(str) {
    var lines, name, names, teamsize, team, i;

    if (Team.count() !== 0) {
      new Toast(Strings.teamsnotempty);
      return undefined;
    }

    lines = str.split('\n');

    // strip unnecessary lines and characters
    for (i = lines.length - 1; i >= 0; i -= 1) {
      // strip white spaces
      lines[i] = lines[i].trim();

      // convert CSV format to plain text
      // first, replace all commas and double quotes inside quotes
      lines[i] = lines[i].replace(/(, ?"([^,"])*)""/g, '$1%DBQUOTE%');
      lines[i] = lines[i].replace(/(, ?"([^,"])*),/g, '$1%COMMA%');
      // second, remove spaces around commas
      lines[i] = lines[i].replace(/ *, */g, ',');
      // second, convert the actual content
      lines[i] = lines[i].replace(/^([0-9]+,)?"([^"]*)","([^"]*)","([^"]*)"$/,
          '$2,$3,$4');
      lines[i] = lines[i].replace(/^([0-9]+,)?"([^"]*)","([^"]*)"$/, '$2,$3');
      lines[i] = lines[i].replace(/^([0-9]+,)?"([^"]*)"$/, '$2');

      // remove all comments
      lines[i] = lines[i].replace(/^#.*/, '');
      // remove empty lines (and the aforementioned comments)
      if (lines[i].length === 0) {
        lines.splice(i, 1);
      }
    }

    teamsize = -1;

    // split and strip the individual player names and store them in the
    // lines
    // variable
    for (names in lines) {
      lines[names] = lines[names].split(',');
      names = lines[names];

      for (name in names) {
        names[name] = names[name].trim().replace('%COMMA%', ',');
        names[name] = names[name].trim().replace('%DBQUOTE%', '"');
        if (names[name].length === 0) {
          names[name] = Strings.emptyname;
        }
      }

      // verify that all teams have the same number of playuers
      if (teamsize !== names.length) {
        if (teamsize === -1) {
          teamsize = names.length;
        } else {
          new Toast(Strings.differentteamsizes);
          return undefined;
        }
      }
    }

    // validate team size
    switch (teamsize) {
    case 1:
    case 2:
    case 3:
      // set the team size
      State.teamsize.set(teamsize);
      break;
    default:
      new Toast(Strings.invalidteamsize);
      return undefined;
    }

    // enter new teams
    for (names in lines) {
      names = lines[names];

      team = Team.create(names);
    }

    return true;
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

    this.teamsfileloadcontroller.reset();
  };

  TeamsFileLoadController.loadFileLoad = function(evt) {
    var contents;

    contents = evt.target.result;

    contents = latin2utf8(contents);

    filereadercontents = contents;

    if (TeamsFileLoadController.createTeamsFromString(contents)) {
      new Toast(Strings.loaded);
    }

    this.teamsfileloadcontroller.reset();
  };

  TeamsFileLoadController.loadFileAbort = function() {
    new Toast(Strings.fileabort);

    this.teamsfileloadcontroller.reset();
  };

  TeamsFileLoadController.prototype.init = function() {
    var controller = this;

    this.view.$view.data('controller', this).change(function(evt) {
      var reader = new FileReader();

      reader.onerror = TeamsFileLoadController.loadFileError;
      reader.onabort = TeamsFileLoadController.loadFileAbort;
      reader.onload = TeamsFileLoadController.loadFileLoad;

      reader.teamsfileloadcontroller = controller;

      // TODO try different encodings and select the best one
      reader.readAsText(evt.target.files[0], 'ISO-8859-1');
    });
  };

  return TeamsFileLoadController;
});
