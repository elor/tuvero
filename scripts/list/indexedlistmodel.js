import ListModel from './listmodel.js'
import ListUpdateListener from './listupdatelistener.js'

/**
 * Constructor for an empty list
 */
class IndexedListModel extends ListModel {
  constructor () {
    super()
    ListUpdateListener.bind(this, this.updateIDs)
  }

  /**
   * update the ids, starting at the specified index
   *
   * @param data
   *          event callback data
   */
  updateIDs (data) {
    let index, startindex
    if (data === undefined) {
      // 'reset' event, where no data is sent
      return
    }
    startindex = data.id || 0
    for (index = startindex; index < this.length; index += 1) {
      this.get(index).setID(index)
    }
  }
}

export default IndexedListModel
