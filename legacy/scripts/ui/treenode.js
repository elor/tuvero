/**
 * TreeNode
 *
 * @return TreeNode
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model'], function(extend, Model) {
  /**
   * Constructor
   *
   * @param parent
   *          Optional. Another TreeNode
   */
  function TreeNode(parent) {
    TreeNode.superconstructor.call(this);

    this.parent = undefined;
    this.children = [];

    if (parent instanceof TreeNode) {
      parent.attach(this);
    } else if (parent !== undefined) {
      throw new Error('new TreeNode(): passed parent is not a TreeNode');
    }

    TreeNode.superconstructor.call(this);
  }
  extend(TreeNode, Model);

  /**
   * @return true if this is a root node, false otherwise
   */
  TreeNode.prototype.isRoot = function() {
    return this.parent === undefined;
  };

  /**
   * @param potentialChild
   *          a TreeNode of which this might be the parent
   * @return true if this is the parent of potentialChild, false otherwise.
   *         undefined on error.
   */
  TreeNode.prototype.isParentOf = function(potentialChild) {
    if (potentialChild instanceof TreeNode) {
      return potentialChild.parent === this;
    }
    return undefined;
  };

  /**
   * @param potentialParent
   *          a TreeNode of which this might be the child
   * @return true if this is a child of potentialParent, false otherwise.
   *          undefined on error.
   */
  TreeNode.prototype.isChildOf = function(potentialParent) {
    if (potentialParent instanceof TreeNode) {
      return this.parent === potentialParent;
    }
    return undefined;
  };

  /**
   * @param potentialSibling
   * @return true if this is a sibling of potentialSibling, false otherwise.
   *         Returns false if both instances match exactly. undefined on error.
   */
  TreeNode.prototype.isSiblingOf = function(potentialSibling) {
    if (potentialSibling instanceof TreeNode) {
      return this.parent === potentialSibling.parent //
          && this !== potentialSibling;
    }
    return undefined;
  };

  /**
   * Attach a child to this node
   *
   * Note that this formulation isn't symmetric to its detach() counterpart
   *
   * @param child
   * @return undefined on error, true otherwise
   */
  TreeNode.prototype.attach = function(child) {
    if (child instanceof TreeNode) {
      if (this.children.indexOf(child) === -1) {
        child.detach();
        child.parent = this;
        this.children.push(child);
      }

      return true;
    }
    return undefined;
  };

  /**
   * Detach this node from its parent.
   *
   * Note that this formulation isn't symmetric to its attach() counterpart
   */
  TreeNode.prototype.detach = function() {
    var index;

    if (this.isRoot()) {
      return;
    }

    while ((index = this.parent.children.indexOf(this)) !== -1) {
      this.parent.children.splice(index, 1);
    }

    this.parent = undefined;
  };

  /**
   * inherited function: destroy the whole tree.
   */
  TreeNode.prototype.destroy = function() {
    this.detach();
    this.children.forEach(function(child) {
      child.destroy();
    });

    this.superclass.destroy.call(this);
  };

  return TreeNode;
});
