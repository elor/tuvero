import IndexedModel from '../list/indexedmodel.js'
import Type from '../core/type.js'

/**
 * Constructor
 *
 * @param id
 *          Optional. the id of the node.
 */
class BinaryTreeModel extends IndexedModel {
  constructor (id) {
    super()
    if (Type.isNumber(id)) {
      this.id = id
    } else {
      this.id = 1
    }
  }

  /**
   * @return the ID of this nodes' parent. returns 0 for the root
   */
  getParentID () {
    return this.id >> 1
  }

  /**
   * @return the ID of this nodes' sibling
   */
  getSiblingID () {
    if (this.id > 1) {
      return this.id ^ 0x1
    }
    return this.id // root (1) and default (0)
  }

  /**
   * @return the ID of this nodes' left child
   */
  getLeftChildID () {
    if (this.id > 0) {
      return this.id << 1
    } else if (this.id === 0) {
      return 1
    }
    return 0
  }

  /**
   * @return the ID of this nodes' right child
   */
  getRightChildID () {
    return this.getLeftChildID() + (this.id <= 0 ? 0 : 1)
  }

  /**
   * @return the depth of this node within the binary tree
   */
  getDepth () {
    if (this.id >= 1) {
      return Math.floor(Math.log(this.id) / Math.LN2)
    }
    return 0
  }
}

export default BinaryTreeModel
