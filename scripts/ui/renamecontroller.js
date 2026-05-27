/**
 * RenameController
 *
 * @return RenameController
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Controller from '../core/controller.js'

/**
 * Constructor
 */
class RenameController extends Controller {
  constructor (view, mouseSupport) {
    super(view)
    this.$anchor = undefined
    this.$rename = undefined
    this.mouseSupport = !!mouseSupport
    const events = 'click' + (this.mouseSupport ? ' mouseenter' : '')
    this.view.$view.on(events, '.rename', this.startRename.bind(this))
    this.view.$view.filter('.rename').on(events, this.startRename.bind(this))
  }

  setName (name) {
    console.error('setName() needs to be overloaded')
    return false
  }

  getName () {
    console.error('getName() needs to be overloaded')
    return 'overload RenameController.prototype.getName()!'
  }

  initRenameInput () {
    if (!this.$rename) {
      this.$rename = $('<input>').addClass('rename')
      this.$rename.on('blur' + (this.mouseSupport ? ' mouseleave' : ''), this.endRename.bind(this))
      this.$rename.keydown(this.renameKeyDown.bind(this))
    }
  }

  startRename (evt) {
    if (this.$anchor) {
      return
    }
    this.$anchor = $(evt.target)
    if (!this.$anchor) {
      return
    }
    const name = this.getName()
    if (name === undefined) {
      this.$anchor = undefined
      return
    }
    this.initRenameInput()
    this.$anchor.before(this.$rename)
    this.$anchor.addClass('hidden')
    this.$rename.val(name)
    this.$rename.focus()
    evt.preventDefault()
    return false
  }

  endRename (evt) {
    if (!this.$anchor) {
      return
    }
    const name = this.$rename.val().trim()
    if (this.setName(name)) {
      this.$anchor.removeClass('hidden')
      this.$anchor = undefined
      this.$rename.detach()
    }
    evt.preventDefault()
    return false
  }

  renameKeyDown (evt) {
    if (!evt || !this.$rename) {
      return
    }
    switch (evt.which) {
      case 27:
        // escape
        this.$rename.val(this.getName())
        return this.endRename(evt)
      case 13:
        // enter
        return this.endRename(evt)
    }
  }

  destroy () {
    if (this.$rename) {
      this.$rename.remove()
    }
    super.destroy()
  }
}

export default RenameController
