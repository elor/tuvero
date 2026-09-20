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
  // built in DOM-ready handlers, after the storage layer restores
  // this one
  expect(logins.length, 'not emitted before the listeners exist').toBe(0)
  await new Promise(function (resolve) { $(function () { window.setTimeout(resolve, 1) }) })
  expect(logins.length, 'emitted once the page is ready').toBe(1)
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

test('an expired token is replaced from a live tuvero.de session', () => {
  const server = new ServerModel()
  server.restore({ token: 'expired-token' })
  const authentications = []
  Listener.bind(server, 'authenticate', function () {
    authentications.push(true)
  })
  requests.length = 0

  const message = server.message('t')
  message.send()
  requests[0].error({ status: 401 })

  // the token is gone, but the browser may still hold a session
  // cookie: mint a fresh one rather than making the user click
  const mint = requests.find(function (request) {
    return String(request.url).indexOf('/profile/token/new') !== -1
  })
  expect(mint, 'a silent mint is attempted').toBeTruthy()

  mint.success({ fulltoken: 'fresh-token' })
  expect(server.token.get(), 'back in business').toBe('fresh-token')
  expect(server.logged_in.get(), 'and logged in').toBe(true)
  expect(authentications.length, 'without a login popup').toBe(0)
})

test('an expired token without a session logs out for good', () => {
  const server = new ServerModel()
  server.restore({ token: 'expired-token' })
  const authentications = []
  Listener.bind(server, 'authenticate', function () {
    authentications.push(true)
  })
  requests.length = 0

  const message = server.message('t')
  message.send()
  requests[0].error({ status: 401 })
  const mint = requests.find(function (request) {
    return String(request.url).indexOf('/profile/token/new') !== -1
  })
  mint.success({ error: 'Login required' })
  mint.complete({})

  expect(server.token.get(), 'no token').toBeFalsy()
  expect(server.logged_in.get(), 'logged out').toBe(false)
  // a popup nobody asked for is worse than the login button
  expect(authentications.length, 'and no popup').toBe(0)
})

test('a 401 for an already replaced token is ignored', () => {
  const server = new ServerModel()
  server.restore({ token: 'old-token' })
  requests.length = 0

  // a request goes out with the old token...
  const straggler = server.message('t')
  straggler.send()
  // ...while the token is replaced (a mint that overtook it)
  server.setToken('fresh-token')
  // and only then does the old request come back rejected
  requests[0].error({ status: 401 })

  expect(server.token.get(), 'the fresh token survives').toBe('fresh-token')
  expect(server.logged_in.get(), 'still logged in').toBe(true)
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
