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
    var extend, BinaryTreeNode, TreeNode;

    extend = getModule('lib/extend');
    BinaryTreeNode = getModule('ui/binarytreenode');
    TreeNode = getModule('core/treenode');

    QUnit.test('BinaryTreeNode', function() {
      QUnit.ok(extend.isSubclass(BinaryTreeNode, TreeNode),
          'BinaryTreeNode is subclass of TreeNode');

      // TODO write tests for BinaryTreeNode
      QUnit.ok(false, 'TODO: write tests for BinaryTreeNode');
    });
  };
});
