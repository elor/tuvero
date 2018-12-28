/**
 * Unit tests for IndexedModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, IndexedModel, Model

    extend = getModule('lib/extend')
    Model = getModule('core/model')
    IndexedModel = getModule('list/indexedmodel')

    QUnit.test('IndexedModel', function (assert) {
      var model, listener, data

      assert.ok(extend.isSubclass(IndexedModel, Model),
        'IndexedModel is subclass of Model')

      listener = {
        updatecount: 0,
        /**
         * Callback listener
         */
        onupdate: function () {
          listener.updatecount += 1
        },
        /**
         * counter reset
         */
        reset: function () {
          listener.updatecount = 0
        },
        emitters: []
      }

      model = new IndexedModel()
      assert.equal(model.getID(), -1, 'empty initialization sets id to -1')

      model.setID(0)
      assert.equal(model.getID(), 0,
        'setID(0) actually sets the id to 0, not -1')

      model = new IndexedModel(5)

      assert.equal(model.getID(), 5, 'proper initialization sets id')

      model.registerListener(listener)

      model.setID(8)
      assert.equal(model.getID(), 8, 'setID sets the id')
      assert.equal(listener.updatecount, 1, 'setID emits update')

      listener.reset()
      model.setID(8)
      assert.equal(listener.updatecount, 0,
        'setID does not emit update if the ids are identical')

      model.setID()
      assert.equal(model.getID(), -1, 'empty setID sets the id to -1')

      model.setID(5)
      data = model.save()
      assert.ok(data, 'Model.save() returns something')
      model = new IndexedModel(3)
      assert.equal(model.restore(data), true, 'restore() works')
      assert.equal(model.getID(), 5, 'save() and restore() work')
    })
  }
})
