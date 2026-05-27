import $ from 'jquery'
import State from '../ui/state.js'
import ClassView from '../core/classview.js'
const ServerStateLink = {}
$(function ($) {
  ServerStateLink.classView = new ClassView(State.serverlink, $('body'), 'statelink', 'nostatelink')
})
export default ServerStateLink
