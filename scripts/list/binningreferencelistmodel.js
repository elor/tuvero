import ListModel from './listmodel.js'
import Type from '../core/type.js'
import SortedReferenceListModel from './sortedreferencelistmodel.js'

/**
 * Constructor
 *
 * @param list
 *          a ListModel instance, preferably sorted for higher efficiency
 * @param binningFunction
 *          a function
 */
class BinningReferenceListModel extends ListModel {
  constructor (list, binningFunction) {
    super()
    this.makeReadonly()
    if (list === undefined) {
      throw new Error('list argument is missing')
    }
    if (binningFunction === undefined) {
      throw new Error('binning function is missing')
    }
    this.binningFunction = binningFunction
    this.bins = new ListModel()
    this.sortedBins = new SortedReferenceListModel(this.bins, this.binSortFunction, true)
    this.refList = list
    this.refList.forEach(function (element, index) {
      BinningReferenceListModel.insertElement(this, index)
    }, this)
    this.refList.registerListener(this)
  }

  /**
  * @return a readonly ListModel instance, which contains the names of all
  *         bins, in the bin order.
  */
  getBinNames () {
    return this.sortedBins
  }

  /**
  * creates a new empty bin
  *
  * @param binName
  *          the name of the bin. Preferably a numerical value
  * @param createIfMissing
  *          if true, the bin is created if it's missing
  * @return the bin (i.e. an empty ListModel instance), or undefined if it
  *         couldn't be found and shouldn't be created
  */
  getBin (binName) {
    const index = this.sortedBins.indexOf(binName)
    if (index === -1) {
      return undefined
    }
    return this.get(index)
  }

  /**
  * Since bins are never allowed to be empty, a new bin is instantiated with an
  * object. This avoids event race conditions
  *
  * @param binName
  *          the name of the newly created bin
  * @param object
  *          the first object in the newly created bin
  * @return the newly created bin (a ListModel), or undefined if the bin
  *         already exists
  */
  createBinWithObject (binName, object) {
    let bin
    let index = this.sortedBins.indexOf(binName)
    if (index === -1) {
      this.bins.push(binName)
      index = this.sortedBins.indexOf(binName)
      bin = new ListModel([object])
      super.insert(index, bin)
    }
    return bin
  }

  /**
  * @param binIndex
  *          the index of the bin, as used in this.get()
  *
  * @return the name of the bin, as returned by the binning function for each
  *         element in the respective bin
  */
  getBinName (binIndex) {
    return this.sortedBins.get(binIndex)
  }

  /**
  * Remnove
  *
  * @param binName
  *          the name of the bin
  */
  removeEmptyBin (binName) {
    const binIndex = this.bins.indexOf(binName)
    const sortedBinIndex = this.sortedBins.indexOf(binName)
    if (binIndex !== -1 && sortedBinIndex !== -1) {
      if (this.get(sortedBinIndex).length === 0) {
        this.bins.remove(binIndex)
        super.remove(sortedBinIndex)
      }
    }
  }

  /**
  * Callback function. Also inserts the inserted element into the sorted list,
  * at the correct position
  *
  * @param emitter
  *          Should be this.refList
  * @param event
  *          'insert'
  * @param data
  *          a data object, as emitted by insert() from the original list
  */
  oninsert (emitter, event, data) {
    if (emitter === this.refList) {
      BinningReferenceListModel.insertElement(this, data.id)
    }
  }

  /**
  * Callback function. Also removes the removed element from the sorted list
  *
  * @param emitter
  *          Should be this.refList
  * @param event
  *          'remove'
  * @param data
  *          a data object, as emitted by remove() from the original list
  */
  onremove (emitter, event, data) {
    if (emitter === this.refList) {
      BinningReferenceListModel.removeElement(this, data.object)
    }
  }

  /**
  * General sort function for Numbers, Strings, Dates, etc. Handles Numbers
  * differently.
  *
  * @param a
  *          a bin name
  * @param b
  *          another bin name
  * @return +1 is a > b, -1 if a < b, 0 otherwise
  */
  binSortFunction (a, b) {
    if (Type.isNumber(a) && Type.isNumber(b)) {
      return a - b
    }
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  }

  /**
  * insert an element into the correct bin of the BinningReferenceListModel
  * "list". The bin is created if not already existant.
  *
  * @param list
  *          a BinningReferenceListModel instance to push the element into
  * @param elementIndex
  *          the index of the element inside list.refList.
  * @return the bin into which the element was inserted.
  */
  static insertElement (list, elementIndex) {
    let nextElementIndex
    const element = list.refList.get(elementIndex)
    const binName = list.binningFunction(element)
    let bin = list.getBin(binName)
    if (bin === undefined) {
      bin = list.createBinWithObject(binName, element)
    } else {
      nextElementIndex = BinningReferenceListModel.getNextBinElementIndex(list, elementIndex, binName)
      if (nextElementIndex === -1) {
        nextElementIndex = bin.length
      } else {
        nextElementIndex = bin.indexOf(list.refList.get(nextElementIndex))
        if (nextElementIndex === -1) {
          nextElementIndex = bin.length
        }
      }
      bin.insert(nextElementIndex, element)
    }
    return bin
  }

  /**
  * find the element which is supposed to follow an element in the bin
  *
  * @param list
  *          the BinningReferenceListModel instance
  * @param begin
  *          the index after which to look for similar elements
  * @param binName
  *          the name of the bin
  * @return the index at which to find the next element of the same bin, or -1
  *         if such an element does not exist.
  */
  static getNextBinElementIndex (list, begin, binName) {
    for (let index = begin + 1; index < list.refList.length; index += 1) {
      if (list.binningFunction(list.refList.get(index)) === binName) {
        return index
      }
    }
    return -1
  }

  /**
  * remove an element from its bin
  *
  * @param list
  *          the BinningReferenceListModel instance
  * @param element
  *          the element to remove
  */
  static removeElement (list, element) {
    const binName = list.binningFunction(element)
    const bin = list.getBin(binName)
    if (bin === undefined) {
      return
    }
    const index = bin.indexOf(element)
    if (index !== -1) {
      bin.remove(index)
      if (bin.length === 0) {
        list.removeEmptyBin(binName)
      }
    }
  }
}

export default BinningReferenceListModel
