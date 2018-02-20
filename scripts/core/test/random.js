/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
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
      var min, max, r, x, i;

      r = new Random();

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
    });
  };
});
