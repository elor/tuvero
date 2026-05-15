const internal = {
  /**
   * Test if this byte can be a utf8 start byte and return the number of
   * required utf8 bytes of this code point, including start byte and
   * continuation bytes.
   *
   * @param  {string} character A single byte (character) to read the utf8 signature from
   * @returns number number of bytes as indicated by the utf8 signature. May be a false positive
   */
  numutfbytes(character: string): number {
    const code = character.charCodeAt(0);

    switch (true) {
      case code < 0xc0:
        return 1;
      case code >= 0xc0 && code < 0xe0:
        return 2;
      case code >= 0xe0 && code < 0xf0:
        return 3;
      case code >= 0xf0 && code < 0xf8:
        return 4;
      // case code >= 0xf8 && code < 0xfc:
      //   return 5;
      // case code >= 0xfc && code < 0xfe:
      //   return 6;
    }

    return 0;
  },

  /**
   * Test if this byte can be interpreted as a utf8 continuation byte
   *
   * @param  {string} character
   * @returns boolean
   */
  isutf8byte(character: string): boolean {
    const code = character.charCodeAt(0);

    return code >= 0x80 && code < 0xc0;
  },

  /**
   * Is the start of the string a utf8 byte sequence encoding a single code point?
   *
   * @param  {string} string a string, possibly starting with a utf8 byte sequence
   */
  isutf8codepoint(string: string) {
    const bytes = internal.numutfbytes(string[0]);
    if (bytes <= 1) {
      return false;
    }
    if (bytes > string.length) {
      return false;
    }

    for (let byteindex = 1; byteindex < bytes; byteindex += 1) {
      if (!internal.isutf8byte(string[byteindex])) {
        return false;
      }
    }

    return true;
  },

  /**
   * Convert a utf8 byte sequence to a single unicode point
   *
   * @param  {string} characters a complete utf8 byte sequence
   * @returns string a single-character string containing the encoded unicode character
   */
  latin2utf8symbol(characters: string): string {
    const bytes = internal.numutfbytes(characters[0]);
    let symbol = characters.charCodeAt(0);

    switch (bytes) {
      case 2:
        symbol = symbol ^ 0xc0;
        break;
      case 3:
        symbol = symbol ^ 0xe0;
        break;
      case 4:
        symbol = symbol ^ 0xf0;
        break;
      // case 5:
      //   symbol = symbol ^ 0xf8;
      //   break;
      // case 6:
      //   symbol = symbol ^ 0xfc;
      //   break;
      default:
        return characters[0];
    }

    for (let byteindex = 1; byteindex < bytes; byteindex += 1) {
      symbol = symbol << 6;
      symbol += characters.charCodeAt(byteindex) ^ 0x80;
    }

    return String.fromCharCode(symbol);
  }
};

const utf8 = {
  /**
   * Convert an arbitrary character sequence from ascii (latin2) to utf8.
   *
   * @param  {string} string
   * @returns string The decoded string, or a copy of the original string if
   * no utf8 encoding is found.
   */
  latin2utf8(string: string): string {
    let symbolindex, ret, symbol;
    ret = [];

    for (symbolindex = 0; symbolindex < string.length; symbolindex += 1) {
      symbol = string.substr(symbolindex, 6);
      if (internal.isutf8codepoint(symbol)) {
        // skip utf8 bytes
        symbolindex += internal.numutfbytes(symbol) - 1;
        // add utf-8 codepoint instead of its ansi representation
        ret.push(internal.latin2utf8symbol(symbol));
      } else {
        // just display the ansi symbol
        ret.push(string[symbolindex]);
      }
    }

    return ret.join("");
  }
};

export default utf8;
