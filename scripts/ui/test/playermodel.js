/**
 * Unit tests for PlayerModel
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest';

import PlayerModel from '../playermodel.js';

// TODO test the emitted events

test('PlayerModel', () => {
  let model, res, ref, listener;
  listener = {
    updatecount: 0,
    /**
     * Callback listener
     */
    onupdate: function () {
      listener.updatecount += 1;
    },
    /**
     * counter reset
     */
    reset: function () {
      listener.updatecount = 0;
    },
    emitters: []
  };
  model = new PlayerModel();
  model.registerListener(listener);
  ref = PlayerModel.NONAME;
  res = model.getName();
  expect(res, 'initialization without argument').toBe(ref);
  model.setName('');
  ref = PlayerModel.NONAME;
  res = model.getName();
  expect(res, 'empty setName').toBe(ref);
  expect(listener.updatecount, 'empty setName, no update event emitted').toBe(0);
  model.setName('asd');
  ref = 'asd';
  res = model.getName();
  expect(res, 'proper setName').toBe(ref);
  expect(listener.updatecount, 'proper setName, update event emitted').toBe(1);
  listener.reset();
  model.setName('\r\n \tdsa \t\r\n');
  ref = 'dsa';
  res = model.getName();
  expect(res, 'setName, auto-removing trailing/leading whitespaces').toBe(ref);
  expect(listener.updatecount, 'setName whitespace, update event emitted').toBe(1);
  listener.reset();
  model.setName(' dsa ');
  expect(
    listener.updatecount,
    'setName whitespace, no update event emitted if contained text matches'
  ).toBe(0);
  listener.reset();
  model.setName('asd    \t\n\r\n\t   dsa');
  ref = 'asd dsa';
  res = model.getName();
  expect(res, 'setName, auto-removing multiple whitespaces inside the name').toBe(ref);
  expect(listener.updatecount, 'setName multiple whitespace, update event emitted').toBe(1);
  model = new PlayerModel('\tlorem  ipsum\tdolor  sit \t\namet\r\n\t ');
  ref = 'lorem ipsum dolor sit amet';
  res = model.getName();
  expect(res, 'initialization with a lot of white spaces').toBe(ref);
  model = new PlayerModel('\t  \t   \t\n\t\r\n\t ');
  ref = PlayerModel.NONAME;
  res = model.getName();
  expect(res, 'initialization with only white spaces').toBe(ref);
  model.setName('asd dsa');
  res = model.getName();
  res = model.getName();
  ref = 'asd dsa';
  expect(res, 'getName: returned value is a copy, not a reference').toBe(ref);
});