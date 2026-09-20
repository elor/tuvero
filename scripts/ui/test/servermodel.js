/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
// @vitest-environment jsdom
import { test, expect, beforeEach, afterEach } from 'vitest'
import $ from 'jquery'

import './helpers/localstorage-stub.js'
import ServerModel from '../servermodel.js'
import Listener from '../../core/listener.js'

let requests
const realAjax = $.ajax

beforeEach(() => {
  requests = []
  $.ajax = function (options) {
    requests.push(options)
  }
})

afterEach(() => {
  $.ajax = realAjax
})

test('a stored token is trusted until the server says otherwise', async () => {
  const server = new ServerModel()
  const logins = []
  Listener.bind(server, 'login', function () {
    logins.push(true)
  })

  expect(server.restore({ token: 'stored-token' }), 'restore succeeds').toBe(true)

  // no round trip has happened yet: the user was logged in when
  // they closed the app, so they are logged in when they open it
  expect(server.tokenvalid.get(), 'the token counts as valid').toBe(true)
  expect(server.logged_in.get(), 'and the user as logged in').toBe(true)
  expect(requests.length, 'the token is verified in the background').toBe(1)

  // the login event is deferred: the models that listen for it are
  // built after the storage layer restores this one
  expect(logins.length, 'not emitted before the listeners exist').toBe(0)
  await new Promise(function (resolve) { window.setTimeout(resolve, 0) })
  expect(logins.length, 'emitted once the call stack is clear').toBe(1)
})

test('an expired token logs the user out', () => {
  const server = new ServerModel()
  server.restore({ token: 'expired-token' })
  requests.length = 0
  server.username.set('Erik')

  // any call can be the one that notices, so the message layer
  // reports it: 401 means the session is over
  const message = server.message('t')
  message.send()
  requests[0].error({ status: 401 })

  expect(server.token.get(), 'the token is dropped').toBeFalsy()
  expect(server.logged_in.get(), 'logged out').toBe(false)
  expect(server.username.get(), 'the cached name is dropped').toBeFalsy()
  expect(server.rejected, 'and no silent mint papers over it').toBe(true)
})

test('a network error keeps the user logged in', () => {
  const server = new ServerModel()
  server.restore({ token: 'stored-token' })

  // offline: jQuery reports status 0
  requests[0].error({ status: 0 })

  expect(server.token.get(), 'the token survives').toBe('stored-token')
  expect(server.logged_in.get(), 'still logged in').toBe(true)
})

test('name, avatar and admin flag survive a restart', () => {
  const server = new ServerModel()
  server.restore({ token: 'stored-token' })
  server.username.set('Erik E. Lorenz')
  server.avatar.set('https://example.invalid/avatar.png')
  server.is_admin.set(true)

  const revived = new ServerModel()
  expect(revived.restore(server.save()), 'restore succeeds').toBe(true)
  expect(revived.username.get()).toBe('Erik E. Lorenz')
  expect(revived.avatar.get()).toBe('https://example.invalid/avatar.png')
  expect(revived.is_admin.get()).toBe(true)
})

test('a stored payload from before the profile cache still restores', () => {
  const server = new ServerModel()
  expect(server.restore({ token: 'old-token' }), 'no missing-key failure').toBe(true)
  expect(server.username.get(), 'no name cached yet').toBeFalsy()
})
