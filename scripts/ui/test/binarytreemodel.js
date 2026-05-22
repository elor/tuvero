/**
 * Unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import extend from '../../lib/extend.js';
import BinaryTreeModel from '../binarytreemodel.js';
import IndexedModel from '../../list/indexedmodel.js';
test('BinaryTreeModel', () => {
  var node;
  expect(
    extend.isSubclass(BinaryTreeModel, IndexedModel),
    'BinaryTreeModel is subclass of IndexedModel'
  ).toBeTruthy();
  node = new BinaryTreeModel();
  expect(node.getID(), 'default ID === 1').toBe(1);
  expect(node.getParentID(), 'parent ID === 0').toBe(0);
  expect(node.getLeftChildID(), 'left child ID === 1').toBe(2);
  expect(node.getRightChildID(), 'right child ID === 1').toBe(3);
  expect(node.getSiblingID(), 'default ID === 1').toBe(1);
  expect(node.getDepth(), 'default depth === 0').toBe(0);
  node = new BinaryTreeModel(439);
  expect(node.getID(), 'ID(439) === 1').toBe(439);
  expect(node.getParentID(), 'parent ID(439) === 0').toBe(219);
  expect(node.getLeftChildID(), 'left child ID(439) === 1').toBe(878);
  expect(node.getRightChildID(), 'right child ID(439) === 1').toBe(879);
  expect(node.getSiblingID(), 'sibling ID(439) === 1').toBe(438);
  expect(node.getDepth(), 'Depth(439) === 0').toBe(8);
  node = new BinaryTreeModel(0);
  expect(node.getID(), 'default ID === 1').toBe(0);
  expect(node.getParentID(), 'parent ID === 0').toBe(0);
  expect(node.getLeftChildID(), 'left child ID === 1').toBe(1);
  expect(node.getRightChildID(), 'right child ID === 1').toBe(1);
  expect(node.getSiblingID(), 'default ID === 1').toBe(0);
  expect(node.getDepth(), 'default depth === 0').toBe(0);
});