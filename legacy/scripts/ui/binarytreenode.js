/**
 * BinaryTreeNode
 *
 * @return BinaryTreeNode
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './treenode'], function(extend, TreeNode) {
  /**
   * Constructor
   *
   * @param id
   *          Optional. the id of the node.
   */
  function BinaryTreeNode(id) {
    BinaryTreeNode.superconstructor.call(this);

    this.id = id || 1;
  }
  extend(BinaryTreeNode, TreeNode);

  /**
   * create the two children, if not already present.
   *
   * @return true on success, false otherwise
   */
  BinaryTreeNode.prototype.createChildren = function() {
    if (this.children.length === 0) {
      this.attach(new BinaryTreeNode(this.getLeftChildID));
      this.attach(new BinaryTreeNode(this.getRightChildID));
      return true;
    } else if (this.children.length === 2) {
      return true;
    }
    return false;
  };

  /**
   * @return the tree-unique ID of this node. Defaults to 1 for the root.
   */
  BinaryTreeNode.prototype.getID = function() {
    return this.id;
  };

  /**
   * @return the ID of this nodes' parent. returns 0 for the root
   */
  BinaryTreeNode.prototype.getParentID = function() {
    return this.id >> 1;
  };

  /**
   * @return the ID of this nodes' sibling
   */
  BinaryTreeNode.prototype.getSiblingID = function() {
    return this.id ^ 0x1;
  };

  /**
   * @return the ID of this nodes' left child
   */
  BinaryTreeNode.prototype.getLeftChildID = function() {
    return this.id << 1;
  };

  /**
   * @return the ID of this nodes' right child
   */
  BinaryTreeNode.prototype.getRightChildID = function() {
    return this.id << 1 + 1;
  };

  /**
   * @return the depth of this node within the binary tree
   */
  BinaryTreeNode.prototype.getDepth = function() {
    return Math.floor(Math.log(id) / Math.LN2);
  };

  return BinaryTreeNode;
});
