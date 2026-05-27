/**
 * Unit Tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import { test, expect } from 'vitest'

import RLE from '../rle.js'
test('RLE', () => {
  let success, data, exp, e, d

  /*
   * encoding tests: static function
   */
  success = true
  try {
    RLE.encode(undefined)
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with undefined').toBeTruthy()
  success = true
  try {
    RLE.encode(null)
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with null').toBeTruthy()
  success = true
  try {
    RLE.encode('')
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with ""').toBeTruthy()
  success = true
  try {
    RLE.encode({})
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with {}').toBeTruthy()
  success = true
  try {
    RLE.encode(/5/)
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with /5/').toBeTruthy()
  success = true
  try {
    RLE.encode({
      a: 4
    })
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with {a:4}').toBeTruthy()
  success = true
  try {
    RLE.encode('loremipsum')
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with "loremipsum"').toBeTruthy()
  success = true
  try {
    RLE.encode('5')
    success = false
  } catch (e) {
    //
  }
  expect(success, 'RLE.encode() with "5"').toBeTruthy()
  expect(RLE.encode([]), 'RLE.encode() with []').toBe('')
  expect(RLE.encode(0), 'RLE.encode() with 0').toBe('0')
  expect(RLE.encode(3), 'RLE.encode() with 3').toBe('3')
  expect(RLE.encode([0]), 'RLE.encode() with [0]').toBe('[n1]')
  expect(RLE.encode([1.3]), 'RLE.encode() with [1.3]').toBe('[1.3]')
  expect(RLE.encode([-1.3e2]), 'RLE.encode() with [1.3]').toBe('[-130]')
  data = []
  data[3] = 5
  expect(RLE.encode(data), 'RLE.encode() with [null,null,null,5]').toBe('[n3,5]')
  expect(RLE.encode([[]]), 'RLE.encode() with [[]]').toBe('[n1]')
  expect(RLE.encode([[[]]]), 'RLE.encode() with [[[]]]').toBe('[n1]')
  expect(RLE.encode([{}]), 'RLE.encode() with [{}]').toBe('[undefined]')
  expect(RLE.encode([/5/]), 'RLE.encode() with [/5/]').toBe('[undefined]')
  expect(RLE.encode([undefined, null, 0]), 'RLE.encode() with [undefined,null,0]').toBe('[n3]')
  expect(RLE.encode([undefined, null, 30]), 'RLE.encode() with [undefined,null,30]').toBe('[n2,30]')
  expect(
    RLE.encode([1, undefined, null, 30]),
    'RLE.encode() with [undefined,null,30]'
  ).toBe('[1,n2,30]')

  /*
   * Nesting Tests
   */

  data = []
  data[3] = [1, 2, undefined, 4]
  expect(RLE.encode(data), 'RLE.encode() with singly nested data').toBe('[n3,[1,2,n,4]]')
  data[3] = undefined
  expect(RLE.encode(data), 'RLE.encode() with singly nested data, all nulled').toBe('[n4]')

  /*
   * RLE.decode()
   */

  expect(RLE.decode(''), 'RLE decode test with empty string').toEqual([])
  expect(RLE.decode('[]'), 'RLE decode test with an empty string').toEqual([])
  expect(RLE.decode('[1]'), 'RLE decode test with single entry').toEqual([1])
  expect(RLE.decode('[n,1]'), 'RLE decode test with single null entry').toEqual([undefined, 1])
  expect(RLE.decode('[n1,1]'), 'RLE decode test with single null entry').toEqual([undefined, 1])
  exp = []
  exp[3] = 1
  expect(RLE.decode('[n3,1]'), 'RLE decode test with single null entry').toEqual(exp)
  expect(RLE.decode('[n3,1,n]'), 'RLE decode test with single null entry').toEqual(exp)
  expect(RLE.decode('[n12]'), 'RLE decode test with only null entries').toEqual(
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
  )
  expect(
    RLE.decode('[n5,n6]'),
    'RLE decode test with only consecutive null entries'
  ).toEqual(
    [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
  )

  // Number variations
  expect(RLE.decode('[+3]'), 'RLE decode test with [+3]').toEqual([3])
  expect(RLE.decode('[-0]'), 'RLE decode test with [-0]').toEqual([-0])
  expect(RLE.decode('[1.23]'), 'RLE decode test with [1.23]').toEqual([1.23])
  expect(RLE.decode('[-1.23e+4]'), 'RLE decode test with [-1.23e+4]').toEqual([-12300])
  expect(RLE.decode('[5,n2]'), 'RLE decode with trailing null values').toEqual([5, undefined, undefined])
  expect(RLE.decode('[5,n2]').length, 'RLE decode with trailing null values').toEqual(3)
  expect(RLE.decode('[n12]').length, 'RLE decode with only null values').toEqual(12)

  // invalid numbers
  expect(RLE.decode('[.]'), 'RLE decode test with [.] as input').toEqual(undefined)
  expect(RLE.decode('[-]'), 'RLE decode test with [-] as input').toEqual(undefined)
  expect(RLE.decode('[+]'), 'RLE decode test with [+] as input').toEqual(undefined)
  expect(RLE.decode('[--6]'), 'RLE decode test with [--6] as input').toEqual(undefined)
  exp = [1, [2], [5, [6, undefined, undefined, undefined]], []]
  exp[1][4] = 4
  exp[3][8] = 9
  exp[3][9] = [10]
  expect(
    RLE.decode('[1,[2,n3,4],[5,[6,n3]],[n8,9,[10]]]'),
    'RLE decode test with nested arrays'
  ).toEqual(exp)
  exp = []
  exp[3] = [1, 2, undefined, 4]
  expect(RLE.decode('[n3,[1,2,n,4]]'), 'RLE decode test with nested arrays').toEqual(exp)

  /*
   * wrong input
   */

  expect(RLE.decode(undefined), 'RLE.decode() with undefined').toBe(undefined)
  expect(RLE.decode(null), 'RLE.decode() with null').toBe(undefined)
  expect(RLE.decode({}), 'RLE.decode() with {}').toBe(undefined)
  expect(RLE.decode(/5/), 'RLE.decode() with /5/').toBe(undefined)
  expect(RLE.decode({
    a: 4
  }), 'RLE.decode() with {a:4}').toBe(undefined)

  /*
   * malformatted data
   */

  expect(RLE.decode('5'), 'RLE.decode() with "5"').toBe(undefined)
  expect(RLE.decode('asd'), 'RLE.decode() with "asd"').toBe(undefined)
  expect(RLE.decode('{}'), 'RLE.decode() with "{}"').toBe(undefined)
  expect(RLE.decode('{asd:5}'), 'RLE.decode() with "{asd:5}"').toBe(undefined)
  expect(RLE.decode('[{asd:5}]'), 'RLE.decode() with "[{asd:5}]"').toBe(undefined)

  /*
   * Self-Consistency and Stability tests
   */
  e = RLE.encode
  d = RLE.decode
  exp[123] = -123.433e-43
  expect(d(e(d(e(d(e(d(e(d(e(d(e(exp)))))))))))), 'RLE re-encoding chain').toEqual(exp)
  exp = [[[[[]]]]]
  expect(
    d(e(d(e(d(e(d(e(d(e(d(e(exp)))))))))))),
    'RLE re-encoding chain of nested arrays'
  ).toEqual([undefined])
  expect(RLE.encode([0, 1, 1, 1]), 'encoding leading null value').toBe('[n,1,1,1]')
  expect(RLE.decode('[n,1,1,1]'), 'decoding leading null value').toEqual([undefined, 1, 1, 1])
})
