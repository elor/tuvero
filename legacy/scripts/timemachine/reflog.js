/**
 * RefLogModel
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
   * Constructor
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

  RefLogModel.prototype.isValid = function() {
    if (!this.data) {
      return false;
    }

    // TODO check format!
    return true;
  };

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

  RefLogModel.prototype.getChildren = function(refKey) {
    if (!this.contains(refKey)) {
      this.emit('error', 'reflog does not contain key for children search');
      return undefined;
    }

    return Object.keys(this.data[refKey.startDate]).filter(function(saveDate) {
      var parentDate = this.data[refKey.startDate][saveDate];
      return parentDate === refKey.saveDate;
    }, this).map(function(saveDate) {
      return new KeyModel(refKey.startDate, saveDate);
    });
  };

  RefLogModel.prototype.getAllKeys = function() {
    var keys;

    keys = this.getInitKeys();

    Object.keys(this.data).forEach(function(startDate) {
      Object.keys(this.data[startDate]).forEach(function(saveDate) {
        keys.push(new KeyModel(startDate, saveDate));
      });
    }, this);

    return keys.sort();
  }

  RefLogModel.prototype.getInitKeys = function() {
    return Object.keys(this.data).sort().map(function(startDate) {
      return new KeyModel(startDate, startDate);
    });
  };

  RefLogModel.prototype.getLatestGlobalKey = function() {
    var data, latestKey;

    data = this.data;
    latestKey = Object.keys(this.data).map(function(startDate) {
      var saveDate = Object.keys(data[startDate]).sort().pop() || startDate;
      return new KeyModel(startDate, saveDate);
    }).sort(KeyModel.sortFunction).pop();

    if (!latestKey) {
      this.emit('error', 'reflog contains no data');
      return undefined;
    }

    return latestKey;
  };

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

    saveDate = Object.keys(this.data[startDate]).sort().pop() || startDate;

    return new KeyModel(startDate, saveDate);
  };

  RefLogModel.prototype.reset = function() {
    if (!this.data) {
      this.emit('error', 'RefLog.reset(): data is undefined');
      this.data = {};
      return;
    }

    if (Object.keys(this.data).length === 0) {
      // data is already empty. Nothing to do here. (Don't overwrite storage!)
      return;
    }

    this.data = {};

    this.emit('reset');

    this.store();
  };

  RefLogModel.prototype.deleteTree = function(refKey) {
    delete this.data[refKey.startDate];

    this.store();
  };

  RefLogModel.prototype.deleteKey = function(refKey) {
    var parentKey, children;

    if (refKey.isRoot()) {
      this.emit('error', 'cannot delete a single init key. '
          + 'use deleteTree() instead');
      return undefined;
    }

    if (!this.contains(refKey)) {
      // this.emit('error', 'deleteKey(): refKey is not in reflog!');
      return undefined;
    }

    parentKey = this.getParent(refKey);
    if (!parentKey) {
      this.emit('error', 'deleteKey(): parent key is not in reflog!');
      return undefined;
    }

    children = this.getChildren(refKey);
    if (children === undefined) {
      this.emit('error', 'deleteKey(): Children cannot be extracted!');
      return undefined;
    }

    children.forEach(function(child) {
      this.data[refKey.startDate][child.saveDate] = parentKey.saveDate;
    }, this);

    delete this.data[refKey.startDate][refKey.saveDate];

    this.store();
  };

  RefLogModel.prototype.toString = function() {
    return JSON.stringify(this.data);
  };

  RefLogModel.prototype.formatTargetKey = function(target) {
    return target + '-reflog';
  };

  RefLog = new RefLogModel();

  return RefLog;
});
