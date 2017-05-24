/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/*
 * Random Test
 */
define(function() {
  return function(QUnit, getModule) {
    var Random;

    Random = getModule('core/random');

    QUnit.test('Random', function (assert) {
      var min, max, r, x, i, sum;

      r = new Random();

      min = max = r.nextDouble();
      sum = 0.0;

      for (i = 0; i < 10000; i += 1) {
        x = r.nextDouble();

        if (x < min) {
          min = x;
        }
        if (x > max) {
          max = x;
        }

        sum += x;
      }

      // approximate testing
      assert.equal(Math.abs(sum - 5000) < 100, true, 'double mean');
      assert.equal(min < 0.01, true, 'double min top');
      assert.equal(min >= 0.0, true, 'double min bottom');
      assert.equal(max > 0.99, true, 'double max top');
      assert.equal(max < 1.0, true, 'double max bottom');

      max = min = r.nextInt(64);

      for (i = 0; i < 10000; i += 1) {
        x = r.nextInt(64);

        if (x < min) {
          min = x;
        }
        if (x > max) {
          max = x;
        }
      }

      assert.equal(min, 0, 'int min');
      assert.equal(max, 63, 'int max');

      // TODO test pick() and pickAndRemove()
    });
  };
});
