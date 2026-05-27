import View from '../core/view.js'
import $ from 'jquery'
import KOLine from './koline.js'
import KOTreePosition from './kotreeposition.js'

/**
 * Constructor
 *
 * @param model
 *          a MatchResult instance
 * @param $view
 *          the container element
 * @param numTeams
 *          the total number of teams in the KO tournament
 * @param fullwidth
 *          a ValueModel which evaluates to true if any name should be shown
 */
class KOLineView extends View {
  constructor (model, $view, numTeams, fullwidth) {
    super(model, $view)
    this.numTeams = numTeams
    this.fullwidth = fullwidth
    this.render()
    fullwidth.registerListener(this)
  }

  clear () {
    if (this.$line) {
      this.$line.remove()
      this.$line = undefined
    }
  }

  render () {
    this.clear()
    if (this.model.getID() > 1) {
      this.$line = this.createLine()
      this.$view.append(this.$line)
    }
  }

  /**
   * @param model
   *          a MatchModel instance
   * @param numTeams
   *          the total number of teams in the KO tournament
   * @return a jquery object of a KO line, ready to be inserted
   */
  createLine () {
    let pos
    pos = new KOTreePosition(this.model.getID(), this.model.getGroup(), this.numTeams, this.fullwidth.get())
    this.x = pos.x
    this.y = pos.y
    pos = pos.getFollowingPosition()
    const from = [this.x + KOTreePosition.getWidth(this.fullwidth.get()) - 1, this.y + 2]
    const to = [pos.x + 0.4, pos.y + 2]
    const line = new KOLine(from, to)
    return $(line.svg).addClass('.koline')
  }

  onupdate (emitter, event, data) {
    this.render()
  }
}

export default KOLineView
