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

test('a single login window for all views of the same server', () => {
  const opened = []
  window.open = function () {
    const popup = { parent: window, close () {} }
    opened.push(popup)
    return popup
  }
  // the login view lives on the home tab *and* on the settings page;
  // both listen to the same model, so a naive second view would open
  // its own popup for the same authentication
  const home = new LoginView(Server, fixture())
  const settings = new LoginView(Server, fixture())
  Server.createToken = function () {}

  Server.emit('authenticate')

  expect(opened.length, 'one popup per authentication').toBe(1)
  expect(home.isLoginWindowOpen() || settings.isLoginWindowOpen()).toBe(true)
})
