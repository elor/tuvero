/*
 * Random Test
 */
define([ '../random' ], function (Random) {
  QUnit.test("Random", function () {
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
    QUnit.equal(Math.abs(sum - 5000) < 100, true, "double mean");
    QUnit.equal(min < 0.01, true, "double min top");
    QUnit.equal(min >= 0.0, true, "double min bottom");
    QUnit.equal(max > 0.99, true, "double max top");
    QUnit.equal(max < 1.0, true, "double max bottom");

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

    QUnit.equal(min, 0, "int min");
    QUnit.equal(max, 63, "int max");
  });
});
