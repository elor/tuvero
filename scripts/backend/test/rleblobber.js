/*
 * Map Tests
 */
define([ '../rleblobber', '../blobber', '../../lib/implements' ], function (RLEBlobber, Blobber, Implements) {
  QUnit.test("RLEBlobber", function () {
    var data, rle, exp;

    /*
     * Interface tests
     */
    QUnit.equal(Implements(Blobber, RLEBlobber), '', "RLEBlobber implements Blobber");

    /*
     * encoding tests: static function
     */
    QUnit.equal(RLEBlobber.toBlob(undefined), undefined, 'RLEBlobber.toBlob() with undefined');
    QUnit.equal(RLEBlobber.toBlob(null), undefined, 'RLEBlobber.toBlob() with null');
    QUnit.equal(RLEBlobber.toBlob(""), undefined, 'RLEBlobber.toBlob() with ""');
    QUnit.equal(RLEBlobber.toBlob({}), undefined, 'RLEBlobber.toBlob() with {}');
    QUnit.equal(RLEBlobber.toBlob(/5/), undefined, 'RLEBlobber.toBlob() with /5/');
    QUnit.equal(RLEBlobber.toBlob({
      a : 4
    }), undefined, 'RLEBlobber.toBlob() with {a:4}');
    QUnit.equal(RLEBlobber.toBlob("lipsum"), undefined, 'RLEBlobber.toBlob() with "lipsum"');
    QUnit.equal(RLEBlobber.toBlob("5"), undefined, 'RLEBlobber.toBlob() with "5"');

    QUnit.equal(RLEBlobber.toBlob([]), '', 'RLEBlobber.toBlob() with []');
    QUnit.equal(RLEBlobber.toBlob(0), '0', 'RLEBlobber.toBlob() with 0');
    QUnit.equal(RLEBlobber.toBlob(3), '3', 'RLEBlobber.toBlob() with 3');

    QUnit.equal(RLEBlobber.toBlob([ 0 ]), '', 'RLEBlobber.toBlob() with [0]');
    QUnit.equal(RLEBlobber.toBlob([ 1.3 ]), '[1.3]', 'RLEBlobber.toBlob() with [1.3]');
    QUnit.equal(RLEBlobber.toBlob([ -1.3e2 ]), '[-130]', 'RLEBlobber.toBlob() with [1.3]');
    data = [];
    data[3] = 5;
    QUnit.equal(RLEBlobber.toBlob(data), '[n3,5]', 'RLEBlobber.toBlob() with [null,null,null,5]');

    QUnit.equal(RLEBlobber.toBlob([ [] ]), '', 'RLEBlobber.toBlob() with [[]]');
    QUnit.equal(RLEBlobber.toBlob([ [ [] ] ]), '', 'RLEBlobber.toBlob() with [[[]]]');
    QUnit.equal(RLEBlobber.toBlob([ {} ]), '[undefined]', 'RLEBlobber.toBlob() with [{}]');
    QUnit.equal(RLEBlobber.toBlob([ /5/ ]), '[undefined]', 'RLEBlobber.toBlob() with [/5/]');
    QUnit.equal(RLEBlobber.toBlob([ undefined, null, 0 ]), '', 'RLEBlobber.toBlob() with [undefined,null,0]');
    QUnit.equal(RLEBlobber.toBlob([ undefined, null, 30 ]), '[n2,30]', 'RLEBlobber.toBlob() with [undefined,null,30]');
    QUnit.equal(RLEBlobber.toBlob([ 1, undefined, null, 30 ]), '[1,n2,30]', 'RLEBlobber.toBlob() with [undefined,null,30]');

    /*
     * Nesting Tests
     */

    data = [];
    data[3] = [ 1, 2, undefined, 4 ];

    QUnit.equal(RLEBlobber.toBlob(data), '[n3,[1,2,n,4]]', 'RLEBlobber.toBlob() with singly nested data');
    data[3] = undefined;
    QUnit.equal(RLEBlobber.toBlob(data), '', 'RLEBlobber.toBlob() with singly nested data, all nulled');

    /*
     * RLEBlobber.prototype.getArray()
     */
    rle = new RLEBlobber();
    QUnit.equal(rle.getArray(), undefined, 'RLEBlobber.getArray() test, undefined');
    data[3] = [ 1, 2, undefined, 4 ];
    rle = new RLEBlobber(data);
    QUnit.deepEqual(rle.getArray(), data, 'RLEBlobber.getArray() test');

    /*
     * RLEBlobber.prototype.toBlob()
     */
    QUnit.equal(rle.toBlob(), '[n3,[1,2,n,4]]', 'RLEBlobber.prototype.toBlob() test');

    /*
     * RLEBlobber.fromBlob()
     */

    QUnit.deepEqual(RLEBlobber.fromBlob(''), [], 'RLEBlobber fromBlob test with empty string');

    QUnit.deepEqual(RLEBlobber.fromBlob('[]'), [], 'RLEBlobber fromBlob test with empty string');
    QUnit.deepEqual(RLEBlobber.fromBlob('[1]'), [ 1 ], 'RLEBlobber fromBlob test with single entry');
    QUnit.deepEqual(RLEBlobber.fromBlob('[n,1]'), [ undefined, 1 ], 'RLEBlobber fromBlob test with single null entry');
    QUnit.deepEqual(RLEBlobber.fromBlob('[n1,1]'), [ undefined, 1 ], 'RLEBlobber fromBlob test with single null entry');
    exp = [];
    exp[3] = 1;
    QUnit.deepEqual(RLEBlobber.fromBlob('[n3,1]'), exp, 'RLEBlobber fromBlob test with single null entry');
    QUnit.deepEqual(RLEBlobber.fromBlob('[n3,1,n]'), exp, 'RLEBlobber fromBlob test with single null entry');
    QUnit.deepEqual(RLEBlobber.fromBlob('[n12345]'), [], 'RLEBlobber fromBlob test with only null entries');
    QUnit.deepEqual(RLEBlobber.fromBlob('[n123,n456]'), [], 'RLEBlobber fromBlob test with only consecutive null entries');

    // Number variations
    QUnit.deepEqual(RLEBlobber.fromBlob('[+3]'), [ 3 ], 'RLEBlobber fromBlob test with [+3]');
    QUnit.deepEqual(RLEBlobber.fromBlob('[-0]'), [ 0 ], 'RLEBlobber fromBlob test with [-0]');
    QUnit.deepEqual(RLEBlobber.fromBlob('[1.23]'), [ 1.23 ], 'RLEBlobber fromBlob test with [1.23]');
    QUnit.deepEqual(RLEBlobber.fromBlob('[-1.23e+4]'), [ -12300 ], 'RLEBlobber fromBlob test with [-1.23e+4]');

    // invalid numbers
    QUnit.deepEqual(RLEBlobber.fromBlob('[.]'), undefined, 'RLEBlobber fromBlob test with [.]');
    QUnit.deepEqual(RLEBlobber.fromBlob('[-]'), undefined, 'RLEBlobber fromBlob test with [-]');
    QUnit.deepEqual(RLEBlobber.fromBlob('[+]'), undefined, 'RLEBlobber fromBlob test with [+]');
    QUnit.deepEqual(RLEBlobber.fromBlob('[--6]'), undefined, 'RLEBlobber fromBlob test with [--6]');

    exp = [ 1, [ 2 ], [ 5, [ 6 ] ], [] ];
    exp[1][4] = 4;
    exp[3][8] = 9;
    exp[3][9] = [ 10 ];
    QUnit.deepEqual(RLEBlobber.fromBlob('[1,[2,n3,4],[5,[6,n7]],[n8,9,[10]]]'), exp, 'RLEBlobber fromBlob test with nested arrays');

    exp = [];
    exp[3] = [ 1, 2, undefined, 4 ];
    QUnit.deepEqual(RLEBlobber.fromBlob('[n3,[1,2,n,4]]'), exp, 'RLEBlobber fromBlob test with nested arrays');

    /*
     * wrong input
     */

    QUnit.equal(RLEBlobber.fromBlob(undefined), undefined, 'RLEBlobber.fromBlob() with undefined');
    QUnit.equal(RLEBlobber.fromBlob(null), undefined, 'RLEBlobber.fromBlob() with null');
    QUnit.equal(RLEBlobber.fromBlob({}), undefined, 'RLEBlobber.fromBlob() with {}');
    QUnit.equal(RLEBlobber.fromBlob(/5/), undefined, 'RLEBlobber.fromBlob() with /5/');
    QUnit.equal(RLEBlobber.fromBlob({
      a : 4
    }), undefined, 'RLEBlobber.fromBlob() with {a:4}');

    /*
     * malformatted data
     */

    QUnit.equal(RLEBlobber.fromBlob("5"), undefined, 'RLEBlobber.fromBlob() with "5"');
    QUnit.equal(RLEBlobber.fromBlob('asd'), undefined, 'RLEBlobber.fromBlob() with "asd"');
    QUnit.equal(RLEBlobber.fromBlob('{}'), undefined, 'RLEBlobber.fromBlob() with "{}"');
    QUnit.equal(RLEBlobber.fromBlob('{asd:5}'), undefined, 'RLEBlobber.fromBlob() with "{asd:5}"');
    QUnit.equal(RLEBlobber.fromBlob('[{asd:5}]'), undefined, 'RLEBlobber.fromBlob() with "[{asd:5}]"');

    /*
     * RLEBlobber.prototype.fromBlob()
     */

    /*
     * RLEBlobber.prototype.toBlob()
     */
    exp = [];
    exp[3] = [ 1, 2, undefined, 4 ];
    rle = new RLEBlobber();
    rle.fromBlob('[n3,[1,2,n,4]]');
    QUnit.deepEqual(rle.getArray(), exp, 'RLEBlobber.prototype.toBlob() test');

    exp = [ 1, [ 2 ], [ 5, [ 6 ] ], [] ];
    exp[1][4] = 4;
    exp[3][8] = 9;
    exp[3][9] = [ -10 ];
    rle = new RLEBlobber();
    rle.fromBlob('[1,[2,n3,4],[5,[6,n7]],[n8,9,[-10]]]');
    QUnit.deepEqual(rle.getArray(), exp, 'RLEBlobber fromBlob test with nested arrays');

    /*
     * Self-Consistency and Stability tests
     */

    e = RLEBlobber.toBlob;
    d = RLEBlobber.fromBlob;
    exp[123] = -123.433e-43;
    QUnit.deepEqual(d(e(d(e(d(e(d(e(d(e(d(e(exp)))))))))))), exp, 'RLEBlobber re-encoding chain');
  });
});
