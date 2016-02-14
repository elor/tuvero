/**
 * RefLogModel: A reference log of
 *
 * @return RefLogModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'presets', 'timemachine/query',
    'core/listmodel', 'core/listener', 'timemachine/keymodel'], function(
    extend, Model, Presets, Query, ListModel, Listener, KeyModel) {
  var RefLog;

  /**
   * Constructor of the singleton. Don't expose.
   */
  function RefLogModel() {
    RefLogModel.superconstructor.call(this);

    this.data = {};
    this.storageKey = this.formatTargetKey(Presets.target);

    Listener.bind(this, 'error', function(event, emitter, message) {
      console.error(message);
    })

    this.refresh();
  }
  extend(RefLogModel, Model);

  RefLogModel.prototype.EVENTS = {
    'error': true,
    'reset': true,
    'remove': true,
    'parentchanged': true,
    'initkey': true,
    'savekey': true
  };

  /**
   * re-read the RefLog from localStorage. If it doesn't exist or doesn't
   * contain proper values, it's reconstructed from the existing save states as
   * best as possible
   *
   * @return true on success, false otherwise
   */
  RefLogModel.prototype.refresh = function() {
    this.reset();
    if (!window.localStorage) {
      this.emit('error', 'This browser does not support LocalStorage!');
      return false;
    }

    if (!window.localStorage[this.storageKey]
        || window.localStorage[this.storageKey] === 'undefined') {
      this.emit('error', this.storageKey
          + ' key missing in LocalStorage! Reconstructing...');
      return this.reconstruct();
    }

    try {
      this.data = JSON.parse(window.localStorage[this.storageKey]);
    } catch (e) {
      console.error(e.stack);
    }

    if (!this.data) {
      this.emit('error', 'cannot read RefLog from Storage. Reconstructing...');
      return this.reconstruct();
    }

    if (!this.isValid()) {
      this.emit('error', 'loaded reflog is not valid!');
      return false;
    }

    this.store();

    return true;
  };

  /**
   * Re-read the saved states and try to convert them to a linear reflog
   *
   * @return true on success, false otherwise
   */
  RefLogModel.prototype.reconstruct = function() {
    var query, data;

    this.reset();

    query = new Query(Query.ROOTKEYS);
    data = {};

    query.filter().forEach(function(initKey) {
      var keyQuery, initDate, refDate;

      initKey = KeyModel.fromString(initKey);
      keyQuery = new Query(initKey);

      initDate = initKey.startDate;
      data[initDate] = {};
      refDate = initKey.startDate;

      keyQuery.filter().forEach(function(saveKey) {
        saveKey = KeyModel.fromString(saveKey);

        if (saveKey.isEqual(initKey)) {
          return;
        }

        date[initDate][saveKey.saveDate] = refDate;

        refDate = saveKey.saveDate;
      });
    });

    this.data = data;

    this.store();

    return true;
  };

  /**
   * save the current reflog to localStorage.
   *
   * FIXME REALLY enable multiple parallel tournaments by just changing the
   * currently opened tournament, not others.
   */
  RefLogModel.prototype.store = function() {
    var dataString;

    if (!this.isValid()) {
      this.emit('error', 'RefLogModel: this.data is not valid!');
      return false;
    }

    dataString = JSON.stringify(this.data);

    window.localStorage[this.storageKey] = dataString;

    return window.localStorage[this.storageKey] === dataString;
  };

  /**
   * @return true if the reflog data is valid, false otherwise
   */
  RefLogModel.prototype.isValid = function() {
    if (!this.data) {
      return false;
    }

    // TODO check format!
    return true;
  };

  /**
   * creates a new child key under the parent key and registers it in the reflog
   *
   * @param parentKey
   *          the parent key
   * @return the new key. Returns undefined on error.
   */
  RefLogModel.prototype.newSaveKey = function(parentKey) {
    var newKey, startDate, refDate, saveDate;
    if (!parentKey) {
      this.emit('error', 'newSaveKey: no parent key given');
      return undefined;
    }

    newKey = KeyModel.createChild(parentKey);

    if (!parentKey.isRelated(newKey)) {
      this.emit('error', 'unexpected error: newKey is unrelated to parentKey');
      return undefined;
    }

    startDate = parentKey.startDate;
    refDate = parentKey.saveDate;
    saveDate = newKey.saveDate;

    if (!this.data) {
      this.emit('error', 'reflog contains no data! reconstructing...');
      if (!this.reconstruct()) {
        this.emit('error', 'reflog reconstruction failed!');
        return undefined;
      }
    }

    if (!this.contains(parentKey)) {
      this.emit('error', 'newSaveKey(): parentKey is not in reflog!');
      return undefined;
    }

    this.data[startDate][saveDate] = refDate;

    this.store();

    return newKey;
  };

  /**
   * @return a new root key
   */
  RefLogModel.prototype.newInitKey = function() {
    var newKey = KeyModel.createRoot();

    if (!this.data) {
      this.emit('error', 'reflog contains no data! reconstructing...');
      if (!this.reconstruct()) {
        this.emit('error', 'reflog reconstruction failed!');
        return undefined;
      }
    }

    this.data[newKey.startDate] = {};

    this.store();

    return newKey;
  };

  /**
   * @param refKey
   *          a reference key
   * @return true if refKey is contained in the reflog, false otherwise
   */
  RefLogModel.prototype.contains = function(refKey) {
    if (!this.data[refKey.startDate]) {
      return false;
    }

    if (refKey.isRoot()) {
      return true;
    }

    if (!this.data[refKey.startDate][refKey.saveDate]) {
      return false;
    }

    return true;
  };

  /**
   * @return a list of start dates. returns an empty array if the reflog is
   *         empty
   */
  RefLogModel.prototype.listStartDates = function() {
    if (!this.data) {
      return [];
    }

    return Object.keys(this.data).filter(KeyModel.isValidDate);
  }

  /**
   * @param startDate
   *          the start date for which to list the save dates (excluding the
   *          start date itself)
   * @return a list of save dates under the start date. Excludes the start date
   *         itself.
   */
  RefLogModel.prototype.listSaveDates = function(startDate) {
    if (!this.data || !this.data[startDate]) {
      this.emit('error', 'reflog does not contain start Date ' + startDate);
      return [];
    }

    return Object.keys(this.data[startDate]).filter(KeyModel.isValidDate);
  };

  /**
   * @param refKey
   *          a KeyModel instance
   * @return a KeyModel instance of the parent key. Returns undefined if the key
   *         is a root key (has no parent)
   */
  RefLogModel.prototype.getParent = function(refKey) {
    if (!this.contains(refKey)) {
      this.emit('error', 'reflog does not contain key for parent search!');
      return undefined;
    }

    if (refKey.isRoot()) {
      return undefined;
    }

    return new KeyModel(refKey.startDate,
        this.data[refKey.startDate][refKey.saveDate]);
  };

  /**
   * @param refKey
   *          a parent key
   * @return an array of children. Returns an empty array if the parent key is
   *         not in the reflog
   */
  RefLogModel.prototype.getChildren = function(refKey) {
    if (!this.contains(refKey)) {
      this.emit('error', 'reflog does not contain key for children search');
      return [];
    }

    return this.listSaveDates(refKey.startDate).filter(function(saveDate) {
      var parentDate = this.data[refKey.startDate][saveDate];
      return parentDate === refKey.saveDate;
    }, this).map(function(saveDate) {
      return new KeyModel(refKey.startDate, saveDate);
    });
  };

  /**
   * @return an array of all keys in the reflog.
   */
  RefLogModel.prototype.getAllKeys = function() {
    var keys;

    keys = this.getInitKeys();

    this.listStartDates().forEach(function(startDate) {
      this.listSaveDates(startDate).forEach(function(saveDate) {
        keys.push(new KeyModel(startDate, saveDate));
      });
    }, this);

    return keys.sort();
  }

  /**
   * @return an array of all root keys in the reflog
   */
  RefLogModel.prototype.getInitKeys = function() {
    return this.listStartDates().sort().map(function(startDate) {
      return new KeyModel(startDate, startDate);
    });
  };

  /**
   * @return the youngest key in the whole reflog. Should be the key of the
   *         latest save state
   */
  RefLogModel.prototype.getLatestGlobalKey = function() {
    var data, latestKey;

    latestKey = this.listStartDates().map(function(startDate) {
      var saveDate = this.listSaveDates(startDate).sort().pop() || startDate;
      return new KeyModel(startDate, saveDate);
    }, this).sort(KeyModel.sortFunction).pop();

    if (!latestKey) {
      this.emit('error', 'reflog contains no data');
      return undefined;
    }

    return latestKey;
  };

  /**
   * @param refKey
   *          a key in a tree
   * @return the youngest key in the whole tree
   */
  RefLogModel.prototype.getLatestRelatedKey = function(refKey) {
    var startDate, saveDate, latestKey;

    if (!KeyModel.isValidKey(refKey)) {
      this.emit('error', 'getLatestRelatedKey(): refKey is invalid')
      return undefined;
    }

    startDate = refKey.startDate;

    if (!this.data[startDate]) {
      this.emit('error', 'init-key object is missing in reflog');
      return undefined;
    }

    saveDate = this.listSaveDates(startDate).sort().pop() || startDate;

    return new KeyModel(startDate, saveDate);
  };

  /**
   * if the reflog is not empty, it's reset to an empty object. Emits 'remove'
   */
  RefLogModel.prototype.reset = function() {
    if (!this.data) {
      this.emit('error', 'RefLog.reset(): data is undefined');
      this.data = {};
      return;
    }

    if (this.listStartDates().length === 0) {
      // data is already empty. Nothing to do here. (Don't overwrite storage!)
      return;
    }

    this.data = {};

    this.emit('reset');

    this.store();
  };

  /**
   * Deletes the whole tree with the startDate of refKey
   *
   * @param refKey
   *          any key in the tree, not necessarily the root key
   */
  RefLogModel.prototype.deleteTree = function(refKey) {
    delete this.data[refKey.startDate];

    this.store();
  };

  /**
   * Deletes a single key and sets its children's parent to its parent
   *
   * @param refKey
   *          save key. root keys cannot be deleted.
   */
  RefLogModel.prototype.deleteKey = function(refKey) {
    var parentKey, children;

    if (refKey.isRoot()) {
      this.emit('error', 'cannot delete a single init key. '
          + 'use deleteTree() instead');
      return;
    }

    if (!this.contains(refKey)) {
      // this.emit('error', 'deleteKey(): refKey is not in reflog!');
      return;
    }

    parentKey = this.getParent(refKey);
    if (!parentKey) {
      this.emit('error', 'deleteKey(): parent key is not in reflog!');
      return;
    }

    children = this.getChildren(refKey);
    if (children === undefined) {
      this.emit('error', 'deleteKey(): Children cannot be extracted!');
      return;
    }

    children.forEach(function(child) {
      this.data[refKey.startDate][child.saveDate] = parentKey.saveDate;
    }, this);

    delete this.data[refKey.startDate][refKey.saveDate];

    this.store();
  };

  /**
   * converts the whole reflog to a single JSON string.
   *
   * @return a serialized representation of the RefLog
   */
  RefLogModel.prototype.toString = function() {
    return JSON.stringify(this.data);
  };

  /**
   * @param target
   *          a target name, e.g 'basic' or 'tac'
   * @return the key of the target's reflog in the localStorage
   */
  RefLogModel.prototype.formatTargetKey = function(target) {
    return target + '-reflog';
  };

  /*
   * RefLog is a singleton. Since we're dealing with localStorage, it wouldn't
   * make sense to use multiple of them, anyway
   */
  RefLog = new RefLogModel();

  return RefLog;
});
