/**
 * RLE: A RunLengthEncoding class for multidimensional sparse non-referencing
 * numerical containers (vectors and arrays). null-data is compressed using
 * placeholders for a sequence of null elements, where null elements are all raw
 * data types that evaluate to false, and empty arrays.
 *
 * Again: This class is intended for the compression/inflation of numerical
 * data. Don't be surprised if it messes up any other kind of data.
 *
 * @return RLE
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['core/type'], function (Type) {
  var RLE = {};

  function isNestedEmptyArray(array) {
    if (!Type.isArray(array)) {
      return false;
    }
    return array.every(isNestedEmptyArray);
  }

  /**
   * RLE-encode the one- or multidimensional array of numerical data
   *
   * Warning: This function does not detect circular references and is hence
   * prone to infinite loops!
   *
   * @param array
   *          a sparse multidimensional non-circular numerical array
   * @return a string representation of array
   */
  RLE.encode = function (array) {
    var i, nullstart, str, elem, notnull;

    switch (Type(array)) {
      case 'array':
        break;
      case 'number':
        // just return the string representation of the number
        return array.toString();
      default:
        throw new Error('RLE encoding failed: cannot parse content of type '
          + Type(array));
    }

    str = '';
    nullstart = -1;
    for (i = 0; i < array.length; i += 1) {
      elem = array[i];

      notnull = elem !== null && elem !== undefined && elem !== 0;
      notnull = notnull && !isNestedEmptyArray(elem);

      if (nullstart > -1) {
        if (notnull) {
          if (nullstart === 0) {
            // begin a new string
            str = '[';
          } else {
            // continue an old string
            str += ',';
          }
          if ((i - nullstart) == 1) {
            str += 'n';
          } else {
            str += 'n' + (i - nullstart);
          }
          nullstart = -1;
        } else {
          // just continue the null run
          continue;
        }
      }

      if (notnull) {
        if (i !== 0) {
          // continue string
          str += ',';
        } else {
          // start new string
          str += '[';
        }

        try {
          str += RLE.encode(elem);
        } catch (e) {
          console.error(e);
          str += undefined;
        }
        nullstart = -1;
      } else {
        nullstart = i;
      }
    }

    if (nullstart !== -1) {
      if (str.length === 0) {
        str = '[';
      } else {
        str += ',';
      }
      str += 'n' + (i - nullstart);
    }

    if (str.length) {
      str += ']';
    }

    return str;
  };

  /**
   * decode an RLE-encoded numerical array
   *
   * @param blob
   *          the string representation
   * @return an array which has been decoded from the blob, or undefined on
   *         failure
   */
  RLE.decode = function (blob) {
    var array, nesting, i, num, char, isnull, nullsleft, newarray;

    if (Type(blob) != 'string') {
      console.error('RLE.decode: input is no string, but of type "'
        + Type(blob) + "'");
      return undefined;
    }

    if (blob.length === 0) {
      return [];
    }

    nesting = [];
    num = '';
    array = undefined;
    isnull = false;
    nullsleft = 0;

    for (i = 0; i < blob.length; ++i) {
      char = blob[i];

      switch (char) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '+':
        case '-':
        case 'e':
        case '.':
          // is part of a number: add to number OR a skip number
          num += char;
          break;
        case 'n':
          // is indicative of a null run
          if (isnull) {
            console.error('unexpected sequence of multiple "n" '
              + 'characters in RLE.decode input');
            return undefined;
          }
          isnull = true;
          break;
        case '[':
          // starts a new nested subarray
          newarray = [];
          // write all nulls up to this point
          if (nesting.length > 0) {
            array[array.length + nullsleft] = newarray;
          }
          nullsleft = 0;
          nesting.push(newarray);
          array = nesting[nesting.length - 1];
          break;
        case ',':
          if (num.length === 0) {
            if (isnull) {
              nullsleft += 1;
            } else {
              // Note to self: ',,' does nothing (compromise)
              // Note to self: '],' is allowed this way, so KEEP IT THAT WAY!
              // console.error('empty array element in decode input');
              // return undefined;
            }
          } else {
            num = Number(num);
            if (isNaN(num)) {
              console.error('invalid number or character sequence '
                + 'in RLE.decode input');
              return undefined;
            }
            if (isnull) {
              nullsleft += num;
            } else {
              array[array.length + nullsleft] = num;
              nullsleft = 0;
            }
          }
          isnull = false;
          num = '';
          break;
        case ']':
          // first, write the last number, if any
          if (!isnull) {
            if (num.length === 0) {
              // console.error('empty field in RLE.decode input.
              // Discarding end of this array');
            } else {
              num = Number(num);
              if (isNaN(num)) {
                console.error('invalid number or character sequence '
                  + 'in RLE.decode input');
                return undefined;
              }
              array[array.length + nullsleft] = num;
              nullsleft = 0;
            }
          } else {
            num = Number(num);
            nullsleft += num;
            if (nullsleft > 0) {
              array[array.length + nullsleft - 1] = undefined;
            }
            nullsleft = 0;
          }
          // ends a nested subarray
          if (nesting.length == 1) {
            if (i == blob.length - 1) {
              // end of input reached
              return array;
            }
            console.error('unbalanced closing "]" in RLE input');
            return undefined;
          }
          nesting.pop();
          array = nesting[nesting.length - 1];
          if (array[array.length - 1].length === 0) {
            array[array.length - 1] = undefined;
          }
          num = '';
          isnull = false;
          break;
        default:
          console.error('RLE decode: unexpected character "' + char
            + '" in sparse array blob');
          return undefined;
      }
    }

    // ERROR: unexpected end of input
    console.error('unexpected end of input. Unbalanced brackets');
    return undefined;
  };

  return RLE;
});
