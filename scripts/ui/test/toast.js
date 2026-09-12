/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
// @vitest-environment jsdom
import { test, expect } from 'vitest'

import Toast from '../toast.js'
test('Toast.mute', () => {
  expect(Toast.isMuted(), 'toasts are not muted initially').toBe(false)

  const audible = Toast.once('audible')
  expect(audible.muted, 'toast created while unmuted is not muted').toBe(false)
  audible.close()

  Toast.mute()
  expect(Toast.isMuted(), 'mute() mutes').toBe(true)

  const muted = Toast.once('muted')
  expect(muted.muted, 'toast created while muted is muted').toBe(true)
  expect(muted.$toast, 'muted toast never gets a DOM node').toBe(undefined)
  muted.close() // must not throw
  muted.display() // must not throw or queue anything

  Toast.mute()
  expect(Toast.isMuted(), 'mute() nests').toBe(true)
  Toast.unmute()
  expect(Toast.isMuted(), 'inner unmute() keeps the outer mute').toBe(true)
  Toast.unmute()
  expect(Toast.isMuted(), 'balanced unmute() unmutes').toBe(false)

  Toast.unmute()
  expect(Toast.isMuted(), 'excess unmute() does not go negative').toBe(false)
  Toast.mute()
  expect(Toast.isMuted(), 'mute() still works after excess unmute()').toBe(true)
  Toast.unmute()
  expect(Toast.isMuted(), 'unmuted again').toBe(false)

  const afterwards = Toast.once('afterwards')
  expect(afterwards.muted, 'toast created after unmute is not muted').toBe(false)
  afterwards.close()
})
