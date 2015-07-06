/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
  return function(QUnit, getModule) {
    var extend, BinaryTreeNode, IndexedModel;

    extend = getModule('lib/extend');
    BinaryTreeNode = getModule('ui/binarytreenode');
    IndexedModel = getModule('core/indexedmodel');

    QUnit.test('BinaryTreeNode', function() {
      var node;

      QUnit.ok(extend.isSubclass(BinaryTreeNode, IndexedModel),
          'BinaryTreeNode is subclass of IndexedModel');

      node = new BinaryTreeNode();
      QUnit.equal(node.getID(), 1, 'default ID === 1');
      QUnit.equal(node.getParentID(), 0, 'parent ID === 0');
      QUnit.equal(node.getLeftChildID(), 2, 'left child ID === 1');
      QUnit.equal(node.getRightChildID(), 3, 'right child ID === 1');
      QUnit.equal(node.getSiblingID(), 1, 'default ID === 1');
      QUnit.equal(node.getDepth(), 0, 'default depth === 0');

      node = new BinaryTreeNode(439);
      QUnit.equal(node.getID(), 439, 'ID(439) === 1');
      QUnit.equal(node.getParentID(), 219, 'parent ID(439) === 0');
      QUnit.equal(node.getLeftChildID(), 878, 'left child ID(439) === 1');
      QUnit.equal(node.getRightChildID(), 879, 'right child ID(439) === 1');
      QUnit.equal(node.getSiblingID(), 438, 'sibling ID(439) === 1');
      QUnit.equal(node.getDepth(), 8, 'Depth(439) === 0');

      node = new BinaryTreeNode(0);
      QUnit.equal(node.getID(), 0, 'default ID === 1');
      QUnit.equal(node.getParentID(), 0, 'parent ID === 0');
      QUnit.equal(node.getLeftChildID(), 1, 'left child ID === 1');
      QUnit.equal(node.getRightChildID(), 1, 'right child ID === 1');
      QUnit.equal(node.getSiblingID(), 0, 'default ID === 1');
      QUnit.equal(node.getDepth(), 0, 'default depth === 0');
    });
  };
});
