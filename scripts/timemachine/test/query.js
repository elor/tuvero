/**
 * Unit tests for Query
 *
 * @return test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var Query, KeyModel, Type, localStorage;

    try {
      localStorage = window.localStorage;
    } catch (e) {
      window = {
        localStorage: {
          setItem: function (key, value) {
            this[key] = value;
          },
          removeItem: function (key) {
            delete this[key];
          }
        }
      };
    }

    Query = getModule('timemachine/query');
    KeyModel = getModule('timemachine/keymodel');
    Type = getModule('core/type');

    Query.source = localStorage;

    QUnit.test('Query', function (assert) {
      var query, key, key2, key3, key4, key5, ref, date, res;

      query = new Query(Query.ALLKEYS);

      assert.ok(query, 'ALLKEYS construction successful');
      assert.ok(Type.isArray(query.filter()), 'filter() result is an array');

      query.filter().forEach(function (key) {
        var match = /test_/.test(key);
        assert.equal(match, true, 'saved key matches target: ' + key);
        if (match) {
          if (window.localStorage) {
            window.localStorage.removeItem(key);
          }
        }
      });

      assert.deepEqual(query.filter(), [],
        'ALL-query on cleared localStorage returns no results');

      ref = 'test_2016-02-12T12:10:11.591Z_2016-02-12T12:10:11.591Z';
      key = KeyModel.fromString(ref);
      key2 = KeyModel.createChild(key);

      ref = 'test_2015-06-01T19:55:12.512Z_2015-06-01T19:55:12.512Z';
      key3 = KeyModel.fromString(ref);
      ref = 'test_2015-06-01T19:55:12.512Z_2345-10-01T20:55:12.512Z';
      key4 = KeyModel.fromString(ref);

      if (window.localStorage) {
        window.localStorage.setItem(key, 'test');
        window.localStorage.setItem(key2, 'test');
        window.localStorage.setItem(key3, 'test');
        window.localStorage.setItem(key4, 'test');
      }

      ref = [key.toString(), key2.toString(), key3.toString(), key4.toString()]
        .sort();

      assert.deepEqual(query.filter(), ref, 'ALLKEYS returns all 4 test keys');

      ref = [key.toString(), key3.toString()].sort();

      query = new Query(Query.ROOTKEYS);
      assert.ok(query, 'ROOTKEYS construction successful');
      assert.deepEqual(query.filter(), ref, 'ROOTKEYS finds both init keys');

      query = new Query(Query.LASTKEYS);
      assert.ok(query, 'LASTKEYS construction successful');
      ref = [key2.toString(), key4.toString()].sort();
      assert.deepEqual(query.filter(), ref, 'LASTKEYS finds both last saves');

      query = new Query(Query.LATESTSAVE);
      assert.ok(query, 'LATESTKEYS construction successful');
      ref = [key4.toString()].sort();
      assert.deepEqual(query.filter(), ref, 'LATESTSAVE finds the latest save');

      ref = [key.toString(), key2.toString()].sort();
      query = new Query(key);
      assert.ok(query, 'construction from key successful');
      assert.deepEqual(query.filter(), ref, 'successful related-keys query 1');
      query = new Query(key2);
      assert.ok(query, 'construction from key2 successful');
      assert.deepEqual(query.filter(), ref, 'successful related-keys query 2');

      ref = [key3.toString(), key4.toString()].sort();
      query = new Query(key3);
      assert.ok(query, 'construction from key3 successful');
      assert.deepEqual(query.filter(), ref, 'successful related-keys query 3');
      query = new Query(key4);
      assert.ok(query, 'construction from key4 successful');
      assert.deepEqual(query.filter(), ref, 'successful related-keys query 4');

      /*
       * cleanup
       */

      if (window.localStorage) {
        window.localStorage.removeItem(key);
        window.localStorage.removeItem(key2);
        window.localStorage.removeItem(key3);
        window.localStorage.removeItem(key4);
      }

      assert.deepEqual((new Query(undefined)).filter(), [],
        'ALL-query on post-test cleared localStorage returns no results');
    });
  };
});
