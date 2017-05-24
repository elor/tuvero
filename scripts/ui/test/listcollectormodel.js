/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var ListModel, ListCollectorModel, ValueModel;

    ValueModel = getModule('core/valuemodel');
    ListModel = getModule('list/listmodel');
    ListCollectorModel = getModule('ui/listcollectormodel');

    QUnit.test('ListCollectorModel', function (assert) {
      var model, list, listener, obj;

      listener = {
        updatecount: 0,
        onupdate: function() {
          listener.updatecount += 1;
        },
        emitters: []
      };

      list = new ListModel();
      model = new ListCollectorModel(list, ValueModel);
      model.registerListener(listener);

      assert.equal(model.emitters.length, 0, 'starting without any emitters');

      list.push(new ValueModel());

      assert.equal(model.emitters.length, 1, 'automatically adding emitters');

      list.get(0).set(5);
      assert.equal(listener.updatecount, 1,
          'recieving update events from inside the list');

      obj = list.pop();
      assert.equal(model.emitters.length, 0,
          'unregistering from emitters when they are removed from the list');

      listener.updatecount = 0;
      obj.set(8);
      assert.equal(listener.updatecount, 0,
          'removed emitters are unregistered from');

      list.push(obj);
      list.push(obj);
      list.push(obj);
      listener.updatecount = 0;
      obj.set(13);
      assert.equal(listener.updatecount, 1,
          'events of multiply inserted emitters are re-emitted exactly once');

      list.pop();
      listener.updatecount = 0;
      obj.set(20);
      assert.equal(listener.updatecount, 1,
          'not unregistering a multiply inserted element if removed once');
    });
  };
});
