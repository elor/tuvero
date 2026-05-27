import TextView from './textview.js'
import Strings from './strings.js'
/**
 * Look for a prepared text representation within the Strings global object.
 *
 * @param text
 *          the key
 * @return if available, the string representation. if not, the key itself.
 */
function getString (text) {
  return Strings['ranking_' + text] || text
}

/**
 * Constructor
 *
 * @param name
 *          the name of the RankingComponent, e.g. "wins"
 * @param $view
 *          a JQuery object into which the component information is to be
 *          written
 */
class RankingComponentView extends TextView {
  constructor (name, $view) {
    super(name, $view)
  }

  /**
   * set the "value" attribute to the text and read the displayed text from
   * Strings
   */
  update () {
    this.$view.val(this.model.text)
    this.$view.text(getString(this.model.text))
  }
}

export default RankingComponentView
