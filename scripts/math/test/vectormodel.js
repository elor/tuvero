/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var ListModel, VectorModel, extend;

    extend = getModule('lib/extend');
    ListModel = getModule('list/listmodel');
    VectorModel = getModule('math/vectormodel');

    QUnit.test('VectorModel', function (assert) {
      var vec, vec2, retvec, ref, success, data;

      assert.ok(extend.isSubclass(VectorModel, ListModel),
          'VectorModel is subclass of ListModel');

      vec = new VectorModel();

      assert.equal(vec.length, 0, 'empty initialization: length is 0');

      vec.resize(123);
      assert.equal(vec.length, 123, 'resize() expands to the wanted length');

      assert.equal(vec.get(0), 0, 'resize() fills with 0 (beg)');
      assert.equal(vec.get(55), 0, 'resize() fills with 0 (mid)');
      assert.equal(vec.get(122), 0, 'resize() fills with 0 (end)');

      vec.resize(5);
      assert.equal(vec.length, 5, 'resize() crops to the wanted length');
      assert.equal(vec.get(122), undefined,
          'get() reads removed elements as undefined');

      vec.resize(-5);
      assert.equal(vec.length, 0,
          'resize() to negative number crops to length 0');

      vec = new VectorModel(10);

      assert.equal(vec.sum(), 0, 'sum() of an empty/new vector is 0');

      vec.push(1);
      vec.push(2);
      vec.push(3);
      vec.push(4);
      vec.push(5);
      vec.push(6);
      vec.push(7);
      vec.push(8);

      assert.equal(vec.sum(), 36, 'sum() returns the correct sum');

      retvec = new VectorModel();
      vec2 = new VectorModel(vec.length);
      vec2.map(function(elem, index) {
        vec2.set(index, index);
      });

      assert.equal(retvec.mult(vec, vec2), retvec, 'mult does not fail');
      assert.equal(retvec.length, 18, 'mult resizes target');
      ref = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 22, 36, 52, 70, 90, 112, 136];
      assert.deepEqual(retvec.asArray(), ref,
          'mult calculates the vector product');

      assert.equal(retvec.mult(vec), retvec, 'mult with one argument');
      ref = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 44, 108, 208, 350, 540, 784,
          1088];
      assert.deepEqual(retvec.asArray(), ref,
          'mult calculates the vector product');

      assert.equal(vec.dot(vec2), 528, 'dot() calculates the dot product');

      retvec.resize(0);
      assert.equal(retvec.add(vec, vec2), retvec, 'add() returns the vector');
      assert.equal(retvec.length, 18, 'add() resizes the target vector');
      ref = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23, 25];
      assert.deepEqual(retvec.asArray(), ref, 'add calculates the element sum');

      // resize, so ref does not exceed the line length. This is pretty
      // stupid,
      // but this is not a stress test anyhow.
      vec2.resize(15);
      retvec.resize(15);

      assert.equal(retvec.add(vec2), retvec, 'add() returns the vector');
      ref = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 27, 30, 33];
      assert.deepEqual(retvec.asArray(), ref, 'add calculates element sum');

      retvec.fill();
      ref = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      assert.deepEqual(retvec.asArray(), ref, 'fill() resets the contents');

      retvec.fill(5);
      ref = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
      assert.deepEqual(retvec.asArray(), ref, 'fill(5) sets the contents');

      vec = new VectorModel(5);
      vec.set(0, 5);
      vec.set(1, 4);
      vec.set(2, 3);
      vec.set(3, 2);
      vec.set(4, 1);

      success = false;
      try {
        vec2.mult(vec, 5);
      } catch (e) {
        success = true;
      }
      assert.ok(success, 'mult(VectorModel, Number) aborts as intended');

      success = true;
      try {
        vec2.mult(5, vec);
      } catch (e2) {
        success = false;
      }
      assert.ok(success, 'mult(Number, VectorModel) aborts as intended');
      ref = [25, 20, 15, 10, 5];
      assert.deepEqual(vec2.asArray(), ref, 'mult(Number) works properly');

      success = true;
      try {
        vec.mult(5);
      } catch (e) {
        success = false;
      }
      assert.ok(success, 'mult(Number, VectorModel) aborts as intended');
      ref = [25, 20, 15, 10, 5];
      assert.deepEqual(vec.asArray(), ref, 'mult(Number) works properly');

      /*
       * save()/restore()
       */

      vec = new VectorModel();
      vec2 = new VectorModel(15);
      vec.push(5);
      vec.push(3);
      vec.push(4);
      vec.push(1);
      vec.push(2);
      data = vec.save();
      assert.ok(data, 'save() does seem to work');
      assert.equal(vec2.restore(data), true, 'restore() works');
      assert.deepEqual(vec2.asArray(), [5, 3, 4, 1, 2],
          'restored values are correct');

      vec = new VectorModel();
      vec.push(0);
      vec.push(0);
      vec.push(1);
      vec.push(0);
      vec.push(0);
      data = vec.save();
      vec = new VectorModel();
      vec.restore(data);
      assert.deepEqual(vec.asArray(), [0, 0, 1, 0, 0],
          'no undefined values in the array');
    });
  };
});
