/**
 * Save button logic which initiates a file download of the current state for
 * later loading
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import Toast from '../ui/toast.js'
import Strings from '../ui/strings.js'
import Server from '../ui/server.js'
import State from '../ui/state.js'
import Listener from '../core/listener.js'
import UploadLog from '../ui/uploadlog.js'
function upload () {
  const serverlink = State.serverlink.get()
  let uploadToast
  if (!Server.logged_in.get()) {
    Toast.once(Strings.not_logged_in)
  } else if (!serverlink) {
    Toast.once(Strings.state_not_linked)
  } else {
    const message = Server.message('/t/' + serverlink + '/state/upload', State.save())
    uploadToast = Toast.once(Strings.state_uploading, Toast.INFINITE)
    Listener.bind(message, 'error', function (emitter, event, data) {
      Toast.once(Strings.state_upload_failed)
      console.error(data)
    })
    Listener.bind(message, 'receive', function () {
      UploadLog.recordUpload(serverlink)
      Toast.once(Strings.state_upload_complete)
    })
    Listener.bind(message, 'complete', function (emitter, event, data) {
      uploadToast.close()
    })
    message.send()
  }
}
$(function ($) {
  $('#tabs').on('click', 'button.upload', function () {
    upload()
  })
})
export default upload
