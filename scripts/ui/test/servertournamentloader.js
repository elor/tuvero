/**
 * unit tests
 *
 * @return a test function
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
// @vitest-environment jsdom
import { test, expect, vi } from 'vitest'

import ServerTournamentLoader from '../servertournamentloader.js'
import State from '../state.js'
import UploadLog from '../uploadlog.js'
import { syncState, SYNC_SYNCED } from '../../core/syncstatus.js'

test('a fresh server download starts as fully synced', () => {
  if (!window.localStorage) {
    // this jsdom setup ships no storage (same stub as timemachine's
    // query test); TimeMachine and UploadLog read window.localStorage
    window.localStorage = {
      getItem (key) {
        return Object.prototype.hasOwnProperty.call(this, key)
          ? this[key]
          : null
      },
      setItem (key, value) { this[key] = String(value) },
      removeItem (key) { delete this[key] }
    }
  }

  // Every clock read advances by 1ms: in a real browser the restore
  // and save take time, so the download-materialising save always
  // lands on a later timestamp than any stamp taken before it.
  const RealDate = Date
  let tick = RealDate.now()
  vi.stubGlobal('Date', class extends RealDate {
    constructor (...args) {
      if (args.length) {
        super(...args)
      } else {
        super(tick++)
      }
    }

    static now () {
      return tick++
    }
  })

  // any valid state body will do as the "server" payload
  const statejson = State.save()
  ServerTournamentLoader.loadTournament({
    alias: 'sommer26',
    name: 'Sommer',
    stateid: 42,
    statejson
  })

  const commit = ServerTournamentLoader.findLocalCommit('sommer26')
  expect(commit, 'download must materialise as a local commit').toBeDefined()

  // Local and server state are identical right now. The save that
  // materialises the download must not count as a local change, so
  // the recorded sync point may not be older than the commit's save.
  expect(syncState({
    serverlink: 'sommer26',
    lastUpload: UploadLog.lastUpload('sommer26'),
    lastSave: new Date(commit.key.saveDate)
  })).toBe(SYNC_SYNCED)

  vi.unstubAllGlobals()
})
