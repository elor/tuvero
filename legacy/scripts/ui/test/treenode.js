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
    var extend, TreeNode, Model;

    extend = getModule('lib/extend');
    TreeNode = getModule('ui/treenode');
    Model = getModule('core/model');

    QUnit.test('TreeNode', function() {
      var node, node2, parent;

      QUnit.ok(extend.isSubclass(TreeNode, Model),
          'TreeNode is subclass of Model');

      parent = new TreeNode();

      QUnit.ok(parent, 'default construction works');
      QUnit.equal(parent.isRoot(), true,
          'default-constructed TreeNode is always root');

      node = new TreeNode(parent);
      QUnit.ok(node, 'parent-construction works');
      QUnit.equal(node.isRoot(), false,
          'parent-constructed TreeNode is not root');
      QUnit.equal(node.isChildOf(parent), true,
          'parent-constructed node really is a child of the parent');
      QUnit.equal(parent.isParentOf(node), true,
          'parent recognizes its parenthood');
      QUnit.equal(parent.isSiblingOf(node), false,
          'a node is no sibling of its parent');
      QUnit.equal(node.isSiblingOf(parent), false,
          'a parent is no sibling of its children');

      node2 = new TreeNode();
      parent.attach(node2);

      QUnit.deepEqual(node, node2,
          'different node-attachment methods are exactly equivalent');

      QUnit.equal(node.isParentOf(node2), false,
          'nodes are no parents of another (1)');
      QUnit.equal(node2.isParentOf(node), false,
          'nodes are no parents of another (2)');
      QUnit.equal(node.isChildOf(node2), false,
          'nodes are no children of another (1)');
      QUnit.equal(node2.isChildOf(node), false,
          'nodes are no children of another (2)');
      QUnit.equal(node.isSiblingOf(node2), true, 'nodes are siblings (1)');
      QUnit.equal(node2.isSiblingOf(node), true, 'nodes are siblings (2)');

    });
  };
});
