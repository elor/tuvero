/**
 * BinaryTreeModel: A node of a binary tree, which has a unique ID and supports
 * querying the ids of parent, left/right children and the sibling.
 *
 * @return BinaryTreeModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(["lib/extend", "list/indexedmodel", "core/type"], function (extend,
    IndexedModel, Type) {
  /**
   * Constructor
   *
   * @param id
   *          Optional. the id of the node.
   */
  function BinaryTreeModel(id) {
    BinaryTreeModel.superconstructor.call(this);

    if (Type.isNumber(id)) {
      this.id = id;
    } else {
      this.id = 1;
    }
  }
  extend(BinaryTreeModel, IndexedModel);

  /**
   * @return the ID of this nodes' parent. returns 0 for the root
   */
  BinaryTreeModel.prototype.getParentID = function () {
    return this.id >> 1;
  };

  /**
   * @return the ID of this nodes' sibling
   */
  BinaryTreeModel.prototype.getSiblingID = function () {
    if (this.id > 1) {
      return this.id ^ 0x1;
    }
    return this.id; // root (1) and default (0)
  };

  /**
   * @return the ID of this nodes' left child
   */
  BinaryTreeModel.prototype.getLeftChildID = function () {
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
  BinaryTreeModel.prototype.getRightChildID = function () {
    return this.getLeftChildID() + (this.id <= 0 ? 0 : 1);
  };

  /**
   * @return the depth of this node within the binary tree
   */
  BinaryTreeModel.prototype.getDepth = function () {
    if (this.id >= 1) {
      return Math.floor(Math.log(this.id) / Math.LN2);
    }
    return 0;
  };

  return BinaryTreeModel;
});
