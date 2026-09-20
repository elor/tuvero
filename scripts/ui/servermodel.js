/**
 * ServerModel
 *
 * @return ServerModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Model from '../core/model.js'
import ValueModel from '../core/valuemodel.js'
import Online from '../background/online.js'
import MessageModel from './messagemodel.js'

/**
 * @param  {String} token the API token for the current user
 * @returns {undefined}
 */
class ServerModel extends Model {
  constructor (token) {
    super()
    this.logged_in = new ValueModel(false)

    /*
     * The identity behind the token, filled from /profile and kept
     * in storage next to it. Cached, because a stored token means
     * the user was logged in when they closed the app: they should
     * see their name and avatar right away, not after a round trip
     * — and offline they should still see them at all.
     */
    this.username = new ValueModel(undefined)
    this.avatar = new ValueModel(undefined)
    // the settings page expands the dev console for admins instead
    // of hiding it behind a collapse
    this.is_admin = new ValueModel(false)

    this.token = new ValueModel(token || undefined)
    this.tokenvalid = new ValueModel(undefined)

    /*
     * Set once the server has rejected a token in this session.
     * The silent mint at start-up (HomeTab) keys off "no token at
     * all"; without this flag it would mint a fresh one right after
     * a rejection -- whether it does depends on which of the two
     * lands first, and a logout that only sometimes happens is
     * worse than either outcome.
     */
    this.rejected = false
    this.openTransactions = new ValueModel(0)
    this.token.registerListener(this)
    this.username.registerListener(this)
    this.avatar.registerListener(this)
    this.is_admin.registerListener(this)
    this.validateToken()
  }

  /**
   * Take the token at face value and verify it in the background.
   *
   * A token only exists because the user logged in at some point,
   * so the app starts in the logged-in state and only leaves it
   * when the server actually rejects the token (see
   * unauthorized()). Anything else — no network, a server hiccup —
   * leaves the session alone.
   */
  validateToken () {
    this.tokenvalid.set(undefined)
    if (!this.token.get()) {
      return
    }
    this.tokenvalid.set(true)
    this.logged_in.set(true)

    /*
     * Deferred: the storage layer restores this model while the
     * modules that listen for 'login' are still being constructed,
     * and they would miss a synchronous event.
     */
    window.setTimeout(function () {
      if (this.logged_in.get()) {
        this.emit('login')
      }
    }.bind(this), 0)

    const message = this.message('/')
    message.onerror = function () {
      this.emit('error')
    }.bind(this)
    message.send()
  }

  /**
   * The server rejected the token: it expired, was revoked, or the
   * server rotated its key. Whichever call noticed, the session is
   * over.
   */
  unauthorized () {
    if (this.token.get()) {
      this.rejected = true
      this.invalidateToken()
    }
  }

  setToken (token) {
    this.invalidateToken()
    this.token.set(token)
    this.validateToken()
  }

  createToken (token) {
    // Re-entrancy guard: ServerAutoloadModel and HomeTab can both
    // call this synchronously in the same tick (the first call's
    // invalidateToken() clears the token, so the second caller's
    // `!server.token.get()` guard then mints again). Without this
    // flag each mint succeeds, emits 'login', and triggers
    // onlogin -> loadTournament twice.
    if (this.minting) {
      return
    }
    this.minting = true
    this.invalidateToken()
    this.registerMessage()
    $.ajax({
      method: 'POST',
      url: (window.TUVERO_WEB_ORIGIN || window.location.origin).replace(/\/$/, '') + '/profile/token/new/json',
      timeout: 5000,
      xhrFields: {
        withCredentials: true
      },
      dataType: 'json',
      success: function (data) {
        if (!data) {
          this.emit('error')
        } else if (data.error) {
          this.emit('authenticate')
        } else {
          this.setToken(data.fulltoken)
        }
      }.bind(this),
      error: this.emit.bind(this, 'error'),
      complete: function () {
        this.minting = false
        this.unregisterMessage()
      }.bind(this)
    })
  }

  invalidateToken () {
    if (!this.token.get()) {
      this.tokenvalid.set(false)
      return
    }
    const message = this.message('/token/delete')
    if (message) {
      message.send() // fire and forget
    }
    this.token.set(undefined)
    this.tokenvalid.set(undefined)
    this.logged_in.set(false)
    this.username.set(undefined)
    this.avatar.set(undefined)
    this.is_admin.set(false)
    this.emit('logout')
  }

  message (apipath, data) {
    if (this.tokenvalid.get() === false || !this.token.get()) {
      return undefined
    }

    // tokenvalid can be true or undefined.
    // true: it's deemed valid
    // undefined: validation pending

    return new MessageModel(this, apipath, data)
  }

  registerMessage () {
    this.openTransactions.set(this.openTransactions.get() + 1)
  }

  unregisterMessage () {
    this.openTransactions.set(this.openTransactions.get() - 1)
  }

  communicationStatus () {
    const causes = {
      online: Online(),
      validtoken: this.token.get() && this.tokenvalid.get()
    }
    causes.all = Object.keys(causes).every(function (value) {
      return causes[value] === true
    })
    return causes
  }

  /**
   * Relay 'update' event from this.token
   *
   * @returns {undefined}
   */
  onupdate () {
    this.emit('update')
  }

  save () {
    const data = super.save()
    data.token = this.token.get() || ''
    data.name = this.username.get() || ''
    data.avatar = this.avatar.get() || ''
    data.admin = !!this.is_admin.get()
    return data
  }

  restore (data) {
    // the profile cache is younger than the stored token: a payload
    // written before it must still restore
    data = Object.assign({ name: '', avatar: '', admin: false }, data)
    if (!super.restore(data)) {
      return false
    }
    this.username.set(data.name || undefined)
    this.avatar.set(data.avatar || undefined)
    this.is_admin.set(!!data.admin)
    this.setToken(data.token || undefined)
    return true
  }
}

ServerModel.prototype.EVENTS = {
  error: true,
  authenticate: true,
  login: true,
  logout: true,
  update: true
}
ServerModel.prototype.SAVEFORMAT = Object.create(Model.prototype.SAVEFORMAT)
ServerModel.prototype.SAVEFORMAT.token = String
ServerModel.prototype.SAVEFORMAT.name = String
ServerModel.prototype.SAVEFORMAT.avatar = String
ServerModel.prototype.SAVEFORMAT.admin = Boolean
export default ServerModel
