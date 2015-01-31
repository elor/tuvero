/**
 * No Description
 *
 * @exports RLEBlobber
 * @implements Blobber
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(function() {
  /**
   * RLEBlobber: A blobber for multi-dimensional sparse non-circular arrays,
   * intended for numerical data. Compression occurs using run-length-encoding
   * of all entries that represent null in some form, e.g. undefined, null and 0
   *
   * Contents of the array can only be numbers at this point
   *
   * This object can work with encapsulated instances or static functions. Use
   * what suits you best, they're calling each other anyway.
   *
   * @param array
   *          a reference to the array
   * @return {RLEBlobber} this
   */
  var RLEBlobber = function(array) {
    this.array = array;

    return this;
  };

  /**
   * getter for the contained array
   *
   * @return the contained array
   */
  RLEBlobber.prototype.getArray = function() {
    return this.array;
  };

  /**
   * creates and returns a string representation of the contained array
   *
   * @return a string representation of the contained array
   */
  RLEBlobber.prototype.toBlob = function() {
    return RLEBlobber.toBlob(this.array);
  };

  /**
   * creates a new array object and stores it in this.array
   *
   * @param blob
   *          the string representation
   *
   * @return nothing
   */
  RLEBlobber.prototype.fromBlob = function(blob) {
    this.array = RLEBlobber.fromBlob(blob);
  };

  /**
   * create a blob from the given array using run length encoding
   *
   * Important Note: This function does not detect circular references! In those
   * cases, it will recurse forever!
   *
   * @param array
   *          a sparse multidimensional non-circular array
   * @return a string representation of array
   */
  RLEBlobber.toBlob = function(array) {
    var i, nullstart, str, elem, elemstr, notnull;

    switch (toType(array)) {
    case 'array':
      // use the code below
      break;
    case 'number':
      // just return the string
      return array.toString();
      break;
    default:
      console.error('cannot parse content of type ' + toType(array));
      return undefined;
    }

    str = '';
    nullstart = -1;
    for (i = 0; i < array.length; i += 1) {
      elem = array[i];

      notnull = elem != null && elem != 0;

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
        if (i != 0) {
          // continue string
          str += ',';
        } else {
          // start new string
          str += '[';
        }

        str += RLEBlobber.toBlob(elem);
        nullstart = -1;
      } else {
        nullstart = i;
      }
    }

    if (str.length) {
      str += ']';
    }

    return str;
  };

  /**
   * parse the blob and return its contents as an array
   *
   * @param blob
   *          the string representation
   * @return an array which has been decoded from the blob, or undefined on
   *          failure
   */
  RLEBlobber.fromBlob = function(blob) {
    var array, innerarray, nesting, i, num, char, isnull, nullsleft, newarray;

    if (toType(blob) != 'string') {
      console.error('RLEBlobber.fromBlob: input is no string, but of type "' + toType(blob) + "'");
      return undefined;
    }

    if (blob.length == 0) {
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
          console.error('unexpected sequence of multiple "n" characters in RLEBlobber.fromBlob input');
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
        if (num.length == 0) {
          if (isnull) {
            nullsleft += 1;
          } else {
            // Note to self: ',,' does nothing (compromise)
            // Note to self: '],' is allowed this way, so KEEP IT THAT WAY!
            // console.error('empty array element in fromBlob input');
            // return undefined;
          }
        } else {
          num = Number(num);
          if (isNaN(num)) {
            console.error('invalid number or character sequence in RLEBlobber.fromBlob input');
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
          if (num.length == 0) {
            // console.error('empty field in RLEBlobber.fromBlob input.
            // Discarding end of this array');
          } else {
            num = Number(num);
            if (isNaN(num)) {
              console.error('invalid number or character sequence in RLEBlobber.fromBlob input');
              return undefined;
            }
            array[array.length + nullsleft] = num;
            nullsleft = 0;
          }
        }
        // ends a nested subarray
        if (nesting.length == 1) {
          if (i == blob.length - 1) {
            // end of input reached
            return array;
          }
          console.error('unbalanced closing "]" in RLEBlobber input');
          return undefined;
        }
        nesting.pop();
        array = nesting[nesting.length - 1];
        if (array[array.length - 1].length == 0) {
          array[array.length - 1] = undefined;
        }
        num = '';
        isnull = false;
        break;
      default:
        console.error('RLEBlobber fromBlob: unexpected character "' + char + '" in sparse array blob');
        return undefined;
      }
    }

    // ERROR: unexpected end of input
    console.error('unexpected end of input. Unbalanced brackets');
    return undefined;
  };

  /**
   * replacement of the typeof function
   *
   * Source:
   * http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
   */
  function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function isArray(obj) {
    return toType(obj) == 'array';
  }

  function isNumber(obj) {
    return toType(obj) == 'number';
  }

  return RLEBlobber;
});
