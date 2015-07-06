/**
 * BinaryTreeNode: A node of a binary tree, which has a unique ID and supports
 * querying the ids of parent, left/right children and the sibling.
 *
 * @return BinaryTreeNode
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/indexedmodel', 'core/type'], function(extend,
    IndexedModel, Type) {
  /**
   * Constructor
   *
   * @param id
   *          Optional. the id of the node.
   */
  function BinaryTreeNode(id) {
    BinaryTreeNode.superconstructor.call(this);

    if (Type.isNumber(id)) {
      this.id = id;
    } else {
      this.id = 1;
    }
  }
  extend(BinaryTreeNode, IndexedModel);

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
    if (this.id > 1) {
      return this.id ^ 0x1;
    }
    return this.id; // root (1) and default (0)
  };

  /**
   * @return the ID of this nodes' left child
   */
  BinaryTreeNode.prototype.getLeftChildID = function() {
    if (this.id > 0) {
      return this.id << 1;
    } else if (this.id === 0) {
      return 1;
    }
    return 0;
  };

  /**
   * @return the ID of this nodes' right child
   */
  BinaryTreeNode.prototype.getRightChildID = function() {
    return this.getLeftChildID() + (this.id <= 0 ? 0 : 1);
  };

  /**
   * @return the depth of this node within the binary tree
   */
  BinaryTreeNode.prototype.getDepth = function() {
    if (this.id >= 1) {
      return Math.floor(Math.log(this.id) / Math.LN2);
    }
    return 0;
  };

  return BinaryTreeNode;
});
