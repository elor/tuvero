/**
 * Unit tests for IndexedModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, IndexedModel, Model;

    extend = getModule('lib/extend');
    Model = getModule('core/model');
    IndexedModel = getModule('ui/indexedmodel');

    QUnit.test('IndexedModel tests', function() {
      var model, listener;

      QUnit.ok(extend.isSubclass(IndexedModel, Model),
          'IndexedModel is subclass of Model');

      listener = {
        updatecount: 0,
        /**
         * Callback listener
         */
        onupdate: function() {
          listener.updatecount += 1;
        },
        /**
         * counter reset
         */
        reset: function() {
          listener.updatecount = 0;
        },
        emitters: []
      };

      model = new IndexedModel();
      QUnit.equal(model.getID(), -1, 'empty initialization sets id to -1');

      model.setID(0);
      QUnit.equal(model.getID(), 0,
          'setID(0) actually sets the id to 0, not -1');

      model = new IndexedModel(5);

      QUnit.equal(model.getID(), 5, 'proper initialization sets id');

      model.registerListener(listener);

      model.setID(8);
      QUnit.equal(model.getID(), 8, 'setID sets the id');
      QUnit.equal(listener.updatecount, 1, 'setID emits update');

      listener.reset();
      model.setID(8);
      QUnit.equal(listener.updatecount, 0,
          'setID does not emit update if the ids are identical');

      model.setID();
      QUnit.equal(model.getID(), -1, 'empty setID sets the id to -1');
    });
  };
});
