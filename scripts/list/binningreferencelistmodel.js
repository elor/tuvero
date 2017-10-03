/**
 * BinningReferenceListModel: Group elements of another list in bins while
 * preserving the order of items within the bins. This was primarily intended
 * for grouping matches by their group.
 *
 * @return BinningReferenceListModel
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'list/listmodel', 'core/type', 'list/sortedreferencelistmodel'], //
function(extend, ListModel, Type, SortedReferenceListModel) {
  /**
   * Constructor
   *
   * @param list
   *          a ListModel instance, preferably sorted for higher efficiency
   * @param binningFunction
   *          a function
   */
  function BinningReferenceListModel(list, binningFunction) {
    BinningReferenceListModel.superconstructor.call(this);

    this.makeReadonly();

    if (list === undefined) {
      throw new Error('list argument is missing');
    }

    if (binningFunction === undefined) {
      throw new Error('binning function is missing');
    }

    this.binningFunction = binningFunction;
    this.bins = new ListModel();
    this.sortedBins = new SortedReferenceListModel(this.bins,
        this.binSortFunction, true);
    this.refList = list;

    this.refList.map(function(element, index) {
      BinningReferenceListModel.insertElement(this, index);
    }, this);

    this.refList.registerListener(this);
  }
  extend(BinningReferenceListModel, ListModel);

  /**
   * @return a readonly ListModel instance, which contains the names of all
   *         bins, in the bin order.
   */
  BinningReferenceListModel.prototype.getBinNames = function() {
    return this.sortedBins;
  };

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
  BinningReferenceListModel.prototype.getBin = function(binName) {
    var index;

    index = this.sortedBins.indexOf(binName);

    if (index === -1) {
      return undefined;
    }

    return this.get(index);
  };

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
  BinningReferenceListModel.prototype.createBinWithObject = function(binName,
      object) {
    var index, bin;

    bin = undefined;
    index = this.sortedBins.indexOf(binName);

    if (index === -1) {
      this.bins.push(binName);
      index = this.sortedBins.indexOf(binName);

      bin = new ListModel([object]);
      BinningReferenceListModel.superclass.insert.call(this, index, bin);
    }

    return bin;
  };

  /**
   * @param binIndex
   *          the index of the bin, as used in this.get()
   *
   * @return the name of the bin, as returned by the binning function for each
   *         element in the respective bin
   */
  BinningReferenceListModel.prototype.getBinName = function(binIndex) {
    return this.sortedBins.get(binIndex);
  };

  /**
   * Remnove
   *
   * @param binName
   *          the name of the bin
   */
  BinningReferenceListModel.prototype.removeEmptyBin = function(binName) {
    var binIndex, sortedBinIndex;
    binIndex = this.bins.indexOf(binName);
    sortedBinIndex = this.sortedBins.indexOf(binName);

    if (binIndex !== -1 && sortedBinIndex !== -1) {
      if (this.get(sortedBinIndex).length === 0) {
        this.bins.remove(binIndex);
        BinningReferenceListModel.superclass.remove.call(this, sortedBinIndex);
      }
    }
  };

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
  BinningReferenceListModel.insertElement = function(list, elementIndex) {
    var bin, binName, element, nextElementIndex;

    element = list.refList.get(elementIndex);
    binName = list.binningFunction(element);
    bin = list.getBin(binName);

    if (bin === undefined) {
      bin = list.createBinWithObject(binName, element);
    } else {

      nextElementIndex = BinningReferenceListModel.getNextBinElementIndex(list,
          elementIndex, binName);

      if (nextElementIndex === -1) {
        nextElementIndex = bin.length;
      } else {
        nextElementIndex = bin.indexOf(list.refList.get(nextElementIndex));
        if (nextElementIndex === -1) {
          nextElementIndex = bin.length;
        }
      }

      bin.insert(nextElementIndex, element);
    }

    return bin;
  };

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
  BinningReferenceListModel.getNextBinElementIndex = function(list, begin,
      binName) {
    var index;

    for (index = begin + 1; index < list.refList.length; index += 1) {
      if (list.binningFunction(list.refList.get(index)) === binName) {
        return index;
      }
    }

    return -1;
  };

  /**
   * remove an element from its bin
   *
   * @param list
   *          the BinningReferenceListModel instance
   * @param element
   *          the element to remove
   */
  BinningReferenceListModel.removeElement = function(list, element) {
    var bin, binName, index;

    binName = list.binningFunction(element);
    bin = list.getBin(binName);

    if (bin === undefined) {
      return;
    }

    index = bin.indexOf(element);
    if (index !== -1) {
      bin.remove(index);
      if (bin.length === 0) {
        list.removeEmptyBin(binName);
      }
    }
  };

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
  BinningReferenceListModel.prototype.oninsert = function(emitter, event, data) //
  {
    if (emitter === this.refList) {
      BinningReferenceListModel.insertElement(this, data.id);
    }
  };

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
  BinningReferenceListModel.prototype.onremove = function(emitter, event, data) //
  {
    if (emitter === this.refList) {
      BinningReferenceListModel.removeElement(this, data.object);
    }
  };

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
  BinningReferenceListModel.prototype.binSortFunction = function(a, b) {
    if (Type.isNumber(a) && Type.isNumber(b)) {
      return a - b;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  };

  return BinningReferenceListModel;
});
