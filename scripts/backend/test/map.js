/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

/*
 * Map Tests
 */
define(function () {
  return function (QUnit, getModule) {
    var Map;

    Map = getModule('backend/map');

    QUnit.test("Map", function () {
      var map, a, b, c;

      map = new Map();
      QUnit.equal(map.size(), 0, "empty map size");

      a = map.insert(5);
      b = map.insert(4);
      c = map.insert(3);

      QUnit.equal(map.size(), 3, "full map size (absolute)");
      QUnit.equal(map.size(), c + 1, "full map size (relative)");

      QUnit.equal(map.find(1), -1, "correct failure on missing element");
      QUnit.equal(map.find(5), a, "first index");
      QUnit.equal(map.find(4), b, "second index");
      QUnit.equal(map.find(3), c, "third index");
      QUnit.equal(map.at(a), 5, "first value");
      QUnit.equal(map.at(b), 4, "second value");
      QUnit.equal(map.at(c), 3, "third value");

      map.erase(1);
      QUnit.equal(map.size(), 2, "reduced map size");
      QUnit.equal(map.at(a), 5, "first reduced value");
      QUnit.equal(map.at(b), 3, "third reduced value");
      QUnit.equal(map.find(3), b, "third reduced index");

      map.remove(5);
      QUnit.equal(map.size(), 1, "further reduced map size");
      QUnit.equal(map.find(3), 0, "third further reduced index");

      map.remove(3);
      QUnit.equal(map.size(), 0, "completely reduced map size");
    });
  };
});
