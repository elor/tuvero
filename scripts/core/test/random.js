/**
 * No Description
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
/*
 * Random Test
 */
import { test, expect } from 'vitest';

import Random from '../random.js';
test('Random', () => {
  var min, max, r, x, i;
  r = new Random();
  max = min = r.nextInt(64);
  for (i = 0; i < 10000; i += 1) {
    x = r.nextInt(64);
    if (x < min) {
      min = x;
    }
    if (x > max) {
      max = x;
    }
  }
  expect(min, 'int min').toBe(0);
  expect(max, 'int max').toBe(63);
});