/**
 * Unit Tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var RLE;

    RLE = getModule('core/rle');

    QUnit.test('RLE', function (assert) {
      var success, data, exp, e, d;

      /*
       * encoding tests: static function
       */
      success = true;
      try {
        RLE.encode(undefined);
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with undefined');
      success = true;
      try {
        RLE.encode(null);
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with null');
      success = true;
      try {
        RLE.encode('');
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with ""');
      success = true;
      try {
        RLE.encode({});
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with {}');
      success = true;
      try {
        RLE.encode(/5/);
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with /5/');
      success = true;
      try {
        RLE.encode({
          a: 4
        });
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with {a:4}');
      success = true;
      try {
        RLE.encode('loremipsum');
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with "loremipsum"');

      success = true;
      try {
        RLE.encode('5');
        success = false;
      } catch (e) {
        //
      }
      assert.ok(success, 'RLE.encode() with "5"');

      assert.equal(RLE.encode([]), '', 'RLE.encode() with []');
      assert.equal(RLE.encode(0), '0', 'RLE.encode() with 0');
      assert.equal(RLE.encode(3), '3', 'RLE.encode() with 3');

      assert.equal(RLE.encode([0]), '[n1]', 'RLE.encode() with [0]');
      assert.equal(RLE.encode([1.3]), '[1.3]', 'RLE.encode() with [1.3]');
      assert.equal(RLE.encode([-1.3e2]), '[-130]', 'RLE.encode() with [1.3]');
      data = [];
      data[3] = 5;
      assert.equal(RLE.encode(data), '[n3,5]',
          'RLE.encode() with [null,null,null,5]');

      assert.equal(RLE.encode([[]]), '[n1]', 'RLE.encode() with [[]]');
      assert.equal(RLE.encode([[[]]]), '[n1]', 'RLE.encode() with [[[]]]');
      assert.equal(RLE.encode([{}]), '[undefined]', 'RLE.encode() with [{}]');
      assert.equal(RLE.encode([/5/]), '[undefined]', 'RLE.encode() with [/5/]');
      assert.equal(RLE.encode([undefined, null, 0]), '[n3]',
          'RLE.encode() with [undefined,null,0]');
      assert.equal(RLE.encode([undefined, null, 30]), '[n2,30]',
          'RLE.encode() with [undefined,null,30]');
      assert.equal(RLE.encode([1, undefined, null, 30]), '[1,n2,30]',
          'RLE.encode() with [undefined,null,30]');

      /*
       * Nesting Tests
       */

      data = [];
      data[3] = [1, 2, undefined, 4];

      assert.equal(RLE.encode(data), '[n3,[1,2,n,4]]',
          'RLE.encode() with singly nested data');
      data[3] = undefined;
      assert.equal(RLE.encode(data), '[n4]',
          'RLE.encode() with singly nested data, all nulled');

      /*
       * RLE.decode()
       */

      assert.deepEqual(RLE.decode(''), [], 'RLE decode test with empty string');

      assert.deepEqual(RLE.decode('[]'), [],
          'RLE decode test with an empty string');
      assert.deepEqual(RLE.decode('[1]'), [1],
          'RLE decode test with single entry');
      assert.deepEqual(RLE.decode('[n,1]'), [undefined, 1],
          'RLE decode test with single null entry');
      assert.deepEqual(RLE.decode('[n1,1]'), [undefined, 1],
          'RLE decode test with single null entry');
      exp = [];
      exp[3] = 1;
      assert.deepEqual(RLE.decode('[n3,1]'), exp,
          'RLE decode test with single null entry');
      assert.deepEqual(RLE.decode('[n3,1,n]'), exp,
          'RLE decode test with single null entry');
      assert.deepEqual(RLE.decode('[n12]'), [undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined, undefined],
          'RLE decode test with only null entries');
      assert.deepEqual(RLE.decode('[n5,n6]'), [undefined, undefined, undefined,
          undefined, undefined, undefined, undefined, undefined, undefined,
          undefined, undefined],
          'RLE decode test with only consecutive null entries');

      // Number variations
      assert.deepEqual(RLE.decode('[+3]'), [3], 'RLE decode test with [+3]');
      assert.deepEqual(RLE.decode('[-0]'), [0], 'RLE decode test with [-0]');
      assert.deepEqual(RLE.decode('[1.23]'), [1.23],
          'RLE decode test with [1.23]');
      assert.deepEqual(RLE.decode('[-1.23e+4]'), [-12300],
          'RLE decode test with [-1.23e+4]');

      assert.deepEqual(RLE.decode('[5,n2]'), [5, undefined, undefined],
          'RLE decode with trailing null values');

      assert.deepEqual(RLE.decode('[5,n2]').length, 3,
          'RLE decode with trailing null values');

      assert.deepEqual(RLE.decode('[n12]').length, 12,
          'RLE decode with only null values');

      // invalid numbers
      assert.deepEqual(RLE.decode('[.]'), undefined,
          'RLE decode test with [.] as input');
      assert.deepEqual(RLE.decode('[-]'), undefined,
          'RLE decode test with [-] as input');
      assert.deepEqual(RLE.decode('[+]'), undefined,
          'RLE decode test with [+] as input');
      assert.deepEqual(RLE.decode('[--6]'), undefined,
          'RLE decode test with [--6] as input');

      exp = [1, [2], [5, [6, undefined, undefined, undefined]], []];
      exp[1][4] = 4;
      exp[3][8] = 9;
      exp[3][9] = [10];
      assert.deepEqual(RLE.decode('[1,[2,n3,4],[5,[6,n3]],[n8,9,[10]]]'), exp,
          'RLE decode test with nested arrays');

      exp = [];
      exp[3] = [1, 2, undefined, 4];
      assert.deepEqual(RLE.decode('[n3,[1,2,n,4]]'), exp,
          'RLE decode test with nested arrays');

      /*
       * wrong input
       */

      assert.equal(RLE.decode(undefined), undefined,
          'RLE.decode() with undefined');
      assert.equal(RLE.decode(null), undefined, 'RLE.decode() with null');
      assert.equal(RLE.decode({}), undefined, 'RLE.decode() with {}');
      assert.equal(RLE.decode(/5/), undefined, 'RLE.decode() with /5/');
      assert.equal(RLE.decode({
        a: 4
      }), undefined, 'RLE.decode() with {a:4}');

      /*
       * malformatted data
       */

      assert.equal(RLE.decode('5'), undefined, 'RLE.decode() with "5"');
      assert.equal(RLE.decode('asd'), undefined, 'RLE.decode() with "asd"');
      assert.equal(RLE.decode('{}'), undefined, 'RLE.decode() with "{}"');
      assert.equal(RLE.decode('{asd:5}'), undefined,
          'RLE.decode() with "{asd:5}"');
      assert.equal(RLE.decode('[{asd:5}]'), undefined,
          'RLE.decode() with "[{asd:5}]"');

      /*
       * Self-Consistency and Stability tests
       */
      e = RLE.encode;
      d = RLE.decode;
      exp[123] = -123.433e-43;
      assert.deepEqual(d(e(d(e(d(e(d(e(d(e(d(e(exp)))))))))))), exp,
          'RLE re-encoding chain');

      exp = [[[[[]]]]];
      assert.deepEqual(d(e(d(e(d(e(d(e(d(e(d(e(exp)))))))))))), [undefined],
        'RLE re-encoding chain of nested arrays');

      assert.equal(RLE.encode([0, 1, 1, 1]), '[n,1,1,1]',
          'encoding leading null value');
      assert.deepEqual(RLE.decode('[n,1,1,1]'), [undefined, 1, 1, 1],
          'decoding leading null value');
    });
  };
});
