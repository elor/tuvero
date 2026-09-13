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

import './helpers/localstorage-stub.js'
import { linkTournament, unlinkTournament } from '../../background/serverlinker.js'
import Server from '../server.js'
import State from '../state.js'
import StateSaver from '../statesaver.js'
import UploadLog from '../uploadlog.js'
import Model from '../../core/model.js'

class FakeMessage extends Model {
  constructor (response) {
    super()
    this.response = response
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

test('unlinkTournament: drops the link, keeps the upload history', () => {
  StateSaver.createNewEmptyTree('Local Cup')
  State.serverlink.set('oldlink')
  State.tabOptions.autouploadState.set(true)
  UploadLog.recordUpload('oldlink', new Date(), 7)

  expect(unlinkTournament()).toBe(true)
  expect(State.serverlink.get()).toBeFalsy()
  expect(State.tabOptions.autouploadState.get()).toBe(false)
  // history survives for a later re-link
  expect(UploadLog.lastUpload('oldlink')).toBeDefined()

  // nothing linked: a second unlink is a no-op
  expect(unlinkTournament()).toBe(false)
})

test('linkTournament: creates on the server, links and auto-uploads', () => {
  StateSaver.createNewEmptyTree('Online Cup')
  State.serverlink.set(undefined)

  const sent = []
  Server.logged_in.set(true)
  Server.message = function (apipath, data) {
    sent.push({ apipath, data })
    return new FakeMessage({ alias: 'fresh1' })
  }

  expect(linkTournament('Online Cup')).toBe(true)
  expect(State.serverlink.get()).toBe('fresh1')
  expect(State.tabOptions.autouploadState.get()).toBe(true)
  expect(sent[0].apipath).toBe('/t/new')
  expect(sent[0].data.name).toBe('Online Cup')
  // the fresh link gets the current state right away
  expect(sent[1].apipath).toBe('/t/fresh1/state/upload')

  // already linked: no second tournament is minted
  expect(linkTournament('Online Cup')).toBe(false)
})
