/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
// @vitest-environment jsdom
import { test, expect, vi, afterEach } from 'vitest'
import $ from 'jquery'

import './helpers/localstorage-stub.js'
import LoginView from '../loginview.js'
import Server from '../server.js'

function fixture () {
  const $view = $(
    '<div class="loginview">' +
    '<img class="avatar userinfo" /><span class="username userinfo"></span>' +
    '<button class="login"></button><button class="logout"></button>' +
    '<span class="busy spin" data-img="reload"></span>' +
    '<p class="popupnotice"></p>' +
    '<p class="offline"></p>' +
    '<p class="errornotice"><span class="online"></span></p>' +
    '</div>'
  )
  $('body').append($view)
  return $view
}

/**
 * The popup the browser would open. `closed` is the only property
 * readable across origins, and the real login page is one.
 */
function stubPopup () {
  const popup = { parent: window, closed: false, close () { popup.closed = true } }
  window.open = function () { return popup }
  return popup
}

// every view registers with the shared Server model and competes
// for the one login window, so each test cleans up after itself
const views = []
function loginView () {
  const view = new LoginView(Server, fixture())
  views.push(view)
  return view
}

afterEach(() => {
  while (views.length) {
    const view = views.pop()
    view.closeLoginWindow()
    view.destroy()
  }
  vi.useRealTimers()
})

test('the polling asks a few times and then gives up', () => {
  vi.useFakeTimers()
  stubPopup()
  let tokens = 0
  // the server answers "not yet" by asking for authentication again,
  // which is what kept the poll going round forever
  Server.createToken = function () {
    tokens += 1
    Server.emit('authenticate')
  }
  const view = loginView()

  Server.emit('authenticate')
  vi.advanceTimersByTime(10 * 60 * 1000)
  const afterTenMinutes = tokens

  expect(afterTenMinutes, 'not two requests a second for ten minutes')
    .toBeLessThan(60)
  expect(afterTenMinutes, 'but it does try').toBeGreaterThan(3)

  vi.advanceTimersByTime(10 * 60 * 1000)
  expect(tokens, 'and it has stopped for good').toBe(afterTenMinutes)
  expect(view.isLoginWindowOpen(), 'the window is let go of').toBe(false)
})

test('closing the login window stops the polling', () => {
  vi.useFakeTimers()
  const popup = stubPopup()
  let tokens = 0
  Server.createToken = function () {
    tokens += 1
    Server.emit('authenticate')
  }
  const view = loginView()

  Server.emit('authenticate')
  vi.advanceTimersByTime(2000)
  expect(tokens, 'polling while the window is open').toBeGreaterThan(0)

  popup.closed = true
  const whenClosed = tokens
  vi.advanceTimersByTime(60 * 1000)
  expect(tokens, 'nothing more once the user closed it')
    .toBeLessThanOrEqual(whenClosed + 1)
  expect(view.isLoginWindowOpen(), 'and the view knows').toBe(false)
})

test('a second attempt polls again', () => {
  vi.useFakeTimers()
  stubPopup()
  let tokens = 0
  Server.createToken = function () { tokens += 1 }
  const view = loginView()

  Server.emit('authenticate')
  vi.advanceTimersByTime(1000)
  expect(tokens, 'the first attempt polls').toBe(1)

  view.closeLoginWindow()
  stubPopup()
  Server.emit('authenticate')
  vi.advanceTimersByTime(1000)
  expect(tokens, 'and so does the next one').toBe(2)
})
