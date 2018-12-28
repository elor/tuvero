/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var extend, BinaryTreeModel, IndexedModel

    extend = getModule('lib/extend')
    BinaryTreeModel = getModule('ui/binarytreemodel')
    IndexedModel = getModule('list/indexedmodel')

    QUnit.test('BinaryTreeModel', function (assert) {
      var node

      assert.ok(extend.isSubclass(BinaryTreeModel, IndexedModel),
        'BinaryTreeModel is subclass of IndexedModel')

      node = new BinaryTreeModel()
      assert.equal(node.getID(), 1, 'default ID === 1')
      assert.equal(node.getParentID(), 0, 'parent ID === 0')
      assert.equal(node.getLeftChildID(), 2, 'left child ID === 1')
      assert.equal(node.getRightChildID(), 3, 'right child ID === 1')
      assert.equal(node.getSiblingID(), 1, 'default ID === 1')
      assert.equal(node.getDepth(), 0, 'default depth === 0')

      node = new BinaryTreeModel(439)
      assert.equal(node.getID(), 439, 'ID(439) === 1')
      assert.equal(node.getParentID(), 219, 'parent ID(439) === 0')
      assert.equal(node.getLeftChildID(), 878, 'left child ID(439) === 1')
      assert.equal(node.getRightChildID(), 879, 'right child ID(439) === 1')
      assert.equal(node.getSiblingID(), 438, 'sibling ID(439) === 1')
      assert.equal(node.getDepth(), 8, 'Depth(439) === 0')

      node = new BinaryTreeModel(0)
      assert.equal(node.getID(), 0, 'default ID === 1')
      assert.equal(node.getParentID(), 0, 'parent ID === 0')
      assert.equal(node.getLeftChildID(), 1, 'left child ID === 1')
      assert.equal(node.getRightChildID(), 1, 'right child ID === 1')
      assert.equal(node.getSiblingID(), 0, 'default ID === 1')
      assert.equal(node.getDepth(), 0, 'default depth === 0')
    })
  }
})
