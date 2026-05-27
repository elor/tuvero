/**
 * SwissVotesView
 *
 * @return SwissVotesView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery'
import View from '../core/view.js'
import BoxView from './boxview.js'
import SwissVotePropView from './swissvotepropview.js'
import PropertyValueModel from '../core/propertyvaluemodel.js'
import ClassView from '../core/classview.js'

/**
 * Constructor
 *
 * @param model
 *          a TournamentModel instance
 * @param $view
 *          the associated DOM element
 */
class SwissVotesView extends View {
  constructor (model, $view) {
    super(model, $view)
    this.boxview = new BoxView(this.$view.find('.boxview'))
    this.votesenabled = new PropertyValueModel(this.model, 'enableupdown')
    this.hiddenclassview = new ClassView(this.votesenabled, this.$view, undefined, 'hidden')
    this.initProps()
  }

  /**
   * for every .prop subview, initiate a SwissVotePropView
   */
  initProps () {
    let tournament, regex
    tournament = this.model
    regex = /^(\S*\s)*(\S+after\S+)(\s\S*)*$/ // extract "XafterY" string
    this.$view.find('.prop').each(function () {
      let prop, $view
      $view = $(this)
      prop = $view.attr('class').replace(regex, '$2')
      return new SwissVotePropView(new PropertyValueModel(tournament, prop), $view)
    })
  }
}

export default SwissVotesView
