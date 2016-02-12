/**
 * Unit tests for TimeMachineKeyQueryModel
 *
 * @return test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, TimeMachineKeyQueryModel, TimeMachineKeyModel, Model, Type;

    extend = getModule('lib/extend');
    TimeMachineKeyQueryModel = getModule('ui/timemachinekeyquerymodel');
    TimeMachineKeyModel = getModule('ui/timemachinekeymodel');
    Model = getModule('core/model');
    Type = getModule('core/type');

    QUnit.test('TimeMachineKeyQueryModel', function() {
      var query, key, key2, key3, key4, key5, ref, date, res;

      QUnit.ok(extend.isSubclass(TimeMachineKeyQueryModel, Model),
          'TimeMachineKeyQueryModel is subclass of Model');

      query = new TimeMachineKeyQueryModel(TimeMachineKeyQueryModel.ALLKEYS);

      QUnit.ok(query, 'ALLKEYS construction successful');
      QUnit.ok(Type.isArray(query.filter()), 'filter() result is an array');

      query.filter().forEach(function(key) {
        var match = /test_/.test(key);
        QUnit.equal(match, true, 'saved key matches target: ' + key);
        if (match) {
          localStorage.removeItem(key);
        }
      });

      QUnit.deepEqual(query.filter(), [],
          'ALL-query on cleared localStorage returns no results');

      ref = 'test_2016-02-12T12:10:11.591Z_2016-02-12T12:10:11.591Z';
      key = new TimeMachineKeyModel(ref);
      key2 = new TimeMachineKeyModel(key);

      ref = 'test_2015-06-01T19:55:12.512Z_2015-06-01T19:55:12.512Z';
      key3 = new TimeMachineKeyModel(ref);
      ref = 'test_2015-06-01T19:55:12.512Z_2345-10-01T20:55:12.512Z';
      key4 = new TimeMachineKeyModel(ref);

      localStorage.setItem(key, 'test');
      localStorage.setItem(key2, 'test');
      localStorage.setItem(key3, 'test');
      localStorage.setItem(key4, 'test');

      ref = [key.toString(), key2.toString(), key3.toString(), key4.toString()]
          .sort();

      QUnit.deepEqual(query.filter(), ref, 'ALLKEYS returns all 4 test keys');

      query = new TimeMachineKeyQueryModel(TimeMachineKeyQueryModel.INITKEYS);
      QUnit.ok(query, 'INITKEYS construction successful');
      ref = [key.toString(), key3.toString()].sort();
      QUnit.deepEqual(query.filter(), ref, 'INITKEYS finds both init keys');

      query = new TimeMachineKeyQueryModel(TimeMachineKeyQueryModel.LASTKEYS);
      QUnit.ok(query, 'LASTKEYS construction successful');
      ref = [key2.toString(), key4.toString()].sort();
      QUnit.deepEqual(query.filter(), ref, 'LASTKEYS finds both last saves');

      query = new TimeMachineKeyQueryModel(//
      TimeMachineKeyQueryModel.LATESTSAVE);
      QUnit.ok(query, 'LATESTKEYS construction successful');
      ref = [key4.toString()].sort();
      QUnit.deepEqual(query.filter(), ref, 'LATESTSAVE finds the latest save');

      ref = [key.toString(), key2.toString()].sort();
      query = new TimeMachineKeyQueryModel(key);
      QUnit.ok(query, 'construction from key successful');
      QUnit.deepEqual(query.filter(), ref, 'successful related-keys query 1');
      query = new TimeMachineKeyQueryModel(key2);
      QUnit.ok(query, 'construction from key2 successful');
      QUnit.deepEqual(query.filter(), ref, 'successful related-keys query 2');

      ref = [key3.toString(), key4.toString()].sort();
      query = new TimeMachineKeyQueryModel(key3);
      QUnit.ok(query, 'construction from key3 successful');
      QUnit.deepEqual(query.filter(), ref, 'successful related-keys query 3');
      query = new TimeMachineKeyQueryModel(key4);
      QUnit.ok(query, 'construction from key4 successful');
      QUnit.deepEqual(query.filter(), ref, 'successful related-keys query 4');

      /*
       * cleanup
       */

      localStorage.removeItem(key);
      localStorage.removeItem(key2);
      localStorage.removeItem(key3);
      localStorage.removeItem(key4);

      QUnit.deepEqual((new TimeMachineKeyQueryModel()).filter(), [],
          'ALL-query on post-test cleared localStorage returns no results');
    });
  };
});
