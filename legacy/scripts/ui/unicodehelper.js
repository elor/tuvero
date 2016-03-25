/**
 * UnicodeHelper
 *
 * @return UnicodeHelper
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([], function() {
  /**
   * Constructor. Irrelevant, simply helps the code outline viewer of Eclipse
   * recognize the static functions.
   */
  function UnicodeHelper() {
  }

  UnicodeHelper.numutfbytes = function(character) {
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
  };

  UnicodeHelper.isutf8byte = function(character) {
    var code;

    code = character.charCodeAt();

    return code >= 0x80 && code < 0xC0;
  };

  UnicodeHelper.isutf8codepoint = function(string) {
    var bytes, byteindex;

    bytes = UnicodeHelper.numutfbytes(string[0]);
    if (bytes <= 1) {
      return false;
    }

    for (byteindex = 1; byteindex < bytes; byteindex += 1) {
      if (!UnicodeHelper.isutf8byte(string[byteindex])) {
        return false;
      }
    }

    return true;
  };

  UnicodeHelper.latin2utf8symbol = function(characters) {
    var bytes, symbol, byteindex;

    bytes = UnicodeHelper.numutfbytes(characters[0]);

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
  };

  UnicodeHelper.latin2utf8 = function(string) {
    var symbolindex, ret, symbol;
    ret = [];

    for (symbolindex = 0; symbolindex < string.length; symbolindex += 1) {

      symbol = string.substr(symbolindex, 6);
      if (UnicodeHelper.isutf8codepoint(symbol)) {
        // skip utf8 bytes
        symbolindex += UnicodeHelper.numutfbytes(symbol) - 1;
        // add utf-8 codepoint instead of its ansi representation
        ret.push(UnicodeHelper.latin2utf8symbol(symbol));
      } else {
        // just display the ansi symbol
        ret.push(string[symbolindex]);
      }
    }

    return ret.join('');
  };

  return UnicodeHelper;
});
