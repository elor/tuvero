/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
// @vitest-environment jsdom
import { test, expect, beforeEach } from 'vitest'

import './helpers/localstorage-stub.js'
import ServerTournamentListModel from '../servertournamentlistmodel.js'
import Model from '../../core/model.js'
import Listener from '../../core/listener.js'
import Presets from 'presets'

class FakeMessage extends Model {
  constructor (response) {
    super()
    this.response = response
    // like MessageModel: events dispatch to this.on<event>
    this.registerListener(this)
  }

  get EVENTS () {
    return { error: true, receive: true, complete: true }
  }

  send () {
    this.emit('receive', this.response)
    this.emit('complete')
    return true
  }
}

function payload (names) {
  const tournaments = {}
  names.forEach(function (name, index) {
    tournaments['alias' + index] = {
      alias: 'alias' + index,
      name,
      target: Presets.target,
      startdate: '2026-0' + (index + 1) + '-01'
    }
  })
  return { logged_in: true, tournaments }
}

function fakeServer (response) {
  return {
    sent: [],
    message (path) {
      this.sent.push(path)
      return new FakeMessage(response)
    },
    registerListener () {}
  }
}

beforeEach(() => {
  window.localStorage.removeItem('servertournaments')
})

test('the list is cached, so it is there before the server answers', () => {
  const server = fakeServer(payload(['Sommercup', 'Herbstcup']))
  const list = new ServerTournamentListModel(server, 14)
  list.update()
  expect(list.length, 'two tournaments').toBe(2)

  // a fresh page: the cached list is on screen without a request
  const offline = fakeServer(undefined)
  const revived = new ServerTournamentListModel(offline, 14)
  expect(revived.length, 'straight from the cache').toBe(2)
  expect(offline.sent.length, 'and without asking the server').toBe(0)
})

test('the archive list is not cached', () => {
  const server = fakeServer(payload(['Sommercup']))
  const archive = new ServerTournamentListModel(server, undefined, true)
  archive.update()

  const revived = new ServerTournamentListModel(fakeServer(undefined), 14)
  expect(revived.length, 'the overview cache stays untouched').toBe(0)
})

test('logging out drops the cache', () => {
  const server = fakeServer(payload(['Sommercup']))
  const list = new ServerTournamentListModel(server, 14)
  list.update()
  list.onlogout()

  const revived = new ServerTournamentListModel(fakeServer(undefined), 14)
  expect(revived.length, 'nothing left of the previous user').toBe(0)
})

test('loading is on until the server answers', () => {
  const server = fakeServer(payload(['Sommercup']))
  const list = new ServerTournamentListModel(server, 14)
  expect(list.loading.get(), 'nothing pending yet').toBe(false)

  const states = []
  Listener.bind(list.loading, 'update', function () {
    states.push(list.loading.get())
  })
  list.update()
  expect(states, 'on while the request is out, off when it lands')
    .toEqual([true, false])
})
