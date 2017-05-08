/**
 * RefLogModel: A reference log of storage keys.
 *
 * RefLogModel does not use ValueModel, ListModel and the like because it has to
 * be periodically synchronized between multiple instances, and because the
 * Model.save() mechanism isn't sophisticated enough for the data object due to
 * its usage of dynamic keys.
 *
 * Instead, a 2D data object is used, with the startdate as the outer key and
 * the savedate as the inner key. Inside the start-object, there's a 'name'
 * property, too. The value inner savedate-objects are the name of their
 * previous key, e.g. another savedate-key or the startdate-key. This yields a
 * tree-like structure.
 *
 * @return RefLogModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'presets', 'timemachine/query',
    'list/listmodel', 'core/listener', 'timemachine/keymodel'], function(
    extend, Model, Presets, Query, ListModel, Listener, KeyModel) {
  var RefLog;

  /**
   * Constructor of the singleton. Don't expose.
   */
  function RefLogModel() {
    RefLogModel.superconstructor.call(this);

    this.source = undefined;
    this.data = {};
    this.storageKey = this.formatTargetKey(Presets.target);

    Listener.bind(this, 'error', function(event, emitter, message) {
      console.error(message);
    });

    this.refresh();
  }
  extend(RefLogModel, Model);

  RefLogModel.prototype.EVENTS = {
    'error': true,
    'rename': true,
    'refresh': true,
    'reset': true
  };

  /**
   * re-read the RefLog from localStorage.
   *
   * @return true on success, false otherwise
   */
  RefLogModel.prototype.refresh = function() {
    var newSource, newData;

    if (window.localStorage) {
      newSource = window.localStorage[this.storageKey];
    } else {
      newSource = this.source;
    }

    if (!newSource) {
      console.log('creating new reflog');
      newSource = '{}';
    } else if (this.source === newSource || newSource === 'undefined') {
      return true;
    }

    try {
      newData = JSON.parse(newSource);
    } catch (e) {
      console.error(e.stack);
      this.emit('error', 'cannot JSON-parse reflog from localStorage.');
      return false;
    }

    if (!newData) {
      this.emit('error', 'RefLog from localStorage contains no data.');
      return false;
    }

    this.data = newData;
    this.source = newSource;

    this.store();
    this.emit('refresh');

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

    if (window.localStorage) {
      window.localStorage[this.storageKey] = dataString;
      return window.localStorage[this.storageKey] === dataString;
    }

    return false;
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

    if (!this.contains(parentKey)) {
      this.emit('error', 'newSaveKey(): parentKey is not in reflog!');
      return undefined;
    }

    this.data[startDate][saveDate] = refDate;

    this.store();

    return newKey;
  };

  /**
   * @return a new root key which hasn't been in the reflog before
   */
  RefLogModel.prototype.newInitKey = function(name) {
    var newKey;

    /*
     * Creating keys within milliseconds of another can cause rootkey collision
     *
     * Reading the reflog takes care of that.
     */
    do {
      newKey = KeyModel.createRoot();
    } while (this.contains(newKey));

    this.data[newKey.startDate] = {
      name: name
    };

    this.store();

    return newKey;
  };

  /**
   * @param refKey
   *          a reference key
   * @return true if refKey is contained in the reflog, false otherwise
   */
  RefLogModel.prototype.contains = function(refKey) {
    this.refresh();

    if (!this.data) {
      this.emit('error', 'reflog contains no data!');
      return false;
    }

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
    this.refresh();

    if (!this.data) {
      return [];
    }

    return Object.keys(this.data).filter(KeyModel.isValidDate);
  };

  /**
   * @param startDate
   *          the start date for which to list the save dates (excluding the
   *          start date itself)
   * @return a list of save dates under the start date. Excludes the start date
   *         itself.
   */
  RefLogModel.prototype.listSaveDates = function(startDate) {
    this.refresh();

    if (!this.data || !this.data[startDate]) {
      this.emit('error', 'reflog does not contain start Date ' + startDate);
      return [];
    }

    return Object.keys(this.data[startDate]).filter(KeyModel.isValidDate);
  };

  /**
   * retrieve the name of the whole tree
   *
   * @param key
   *          a KeyModel instance
   * @return the name of the root element of the tree
   */
  RefLogModel.prototype.getName = function(key) {
    if (!this.contains(key)) {
      key = new KeyModel(key.startDate, key.startDate);
      if (!this.contains(key)) {
        this.emit('error', 'reflog does not contain key for name query');
        return '';
      }
    }

    return this.data[key.startDate].name || '';
  };

  /**
   * @param key
   *          any key of the tree for which to change the name
   * @param name
   *          the new name
   * @return true if the tree now carries the new name, false otherwise
   */
  RefLogModel.prototype.setName = function(key, name) {
    if (!this.contains(key)) {
      key = new KeyModel(key.startDate, key.startDate);
      if (!this.contains(key)) {
        this.emit('error', 'RefLog does not contain key for name setting');
        return false;
      }
    }

    if (name === this.getName(key)) {
      return true;
    }

    this.data[key.startDate].name = name;
    if (!this.store()) {
      this.emit('error', 'RefLog: store() error during name change');
      return false;
    }
    this.emit('rename', key);
    return true;
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
  };

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
      // this.emit('error', 'no latest key found');
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
    var startDate, saveDate, latestKey, rootKey;

    if (!KeyModel.isValidKey(refKey)) {
      this.emit('error', 'getLatestRelatedKey(): refKey is invalid');
      return undefined;
    }

    startDate = refKey.startDate;

    if (!this.contains(refKey)) {
      rootKey = new KeyModel(startDate, startDate);
      if (!this.contains(rootKey)) {
        this.emit('error', 'root key is missing in reflog');
        return undefined;
      }
    }

    saveDate = this.listSaveDates(startDate).sort().pop() || startDate;

    return new KeyModel(startDate, saveDate);
  };

  /**
   * if the reflog is not empty, it's reset to an empty object. Emits 'remove'
   */
  RefLogModel.prototype.reset = function() {
    this.refresh();

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
    if (!this.contains(refKey)) {
      if (!this.contains(new KeyModel(refKey.startDate, refKey.startDate))) {
        // Nothing to do here. It's already deleted
        return;
      }
    }

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
