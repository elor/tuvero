/**
 * RefLogModel
 *
 * @return RefLogModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'presets', 'timemachine/keyquerymodel',
    'core/listmodel', 'core/listener', 'timemachine/keymodel'], function(
    extend, Model, Presets, KeyQueryModel, ListModel, Listener, KeyModel) {
  var reflogKey, reflogRegex, RefLog;

  reflogKey = Presets.target + '-reflog';
  reflogRegex = /^[a-z]*-reflog$/;

  /**
   * Constructor
   */
  function RefLogModel() {
    RefLogModel.superconstructor.call(this);

    this.data = {};

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

    if (!window.localStorage[reflogKey]
        || window.localStorage[reflogKey] === 'undefined') {
      this.emit('error', reflogKey
          + ' key missing in LocalStorage! Reconstructing...');
      return this.reconstruct();
    }

    try {
      this.data = JSON.parse(window.localStorage[reflogKey]);
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

    query = new KeyQueryModel(KeyQueryModel.INITKEYS);
    data = {};

    query.filter().forEach(function(initKey) {
      var keyQuery, initDate, refDate;

      initKey = new KeyModel(initKey);
      keyQuery = new KeyQueryModel(initKey);

      initDate = initKey.startDate;
      data[initDate] = {};
      refDate = initKey.startDate;

      keyQuery.filter().forEach(function(saveKey) {
        saveKey = new KeyModel(saveKey);

        if (saveKey.isEqual(initKey)) {
          return;
        }

        date[initDate][saveKey.saveDate] = refDate;

        refDate = saveKey.saveDate;
      });
    });

    this.data = data;

    console.log(this.data)

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

    window.localStorage[reflogKey] = dataString;

    return window.localStorage[reflogKey] === dataString;
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

    newKey = new KeyModel(parentKey);

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
    var newKey = new KeyModel();

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

    if (KeyModel.isInitKey(refKey)) {
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

    if (KeyModel.isInitKey(refKey)) {
      return undefined;
    }

    return KeyModel.construct(refKey.startDate,
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
      return KeyModel.construct(refKey.startDate, saveDate);
    });
  };

  RefLogModel.prototype.getAllKeys = function() {
    var keys;

    keys = this.getInitKeys();

    Object.keys(this.data).forEach(function(startDate) {
      Object.keys(this.data[startDate]).forEach(function(saveDate) {
        keys.push(KeyModel.construct(startDate, saveDate));
      });
    }, this);

    return keys.sort();
  }

  RefLogModel.prototype.getInitKeys = function() {
    return Object.keys(this.data).sort().map(function(startDate) {
      return KeyModel.construct(startDate, startDate);
    });
  };

  RefLogModel.prototype.getLatestGlobalKey = function() {
    var data, latestKey;

    data = this.data;
    latestKey = Object.keys(this.data).map(function(startDate) {
      var saveDate = Object.keys(data[startDate]).sort().pop() || startDate;
      return KeyModel.construct(startDate, saveDate);
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

    return KeyModel.construct(startDate, saveDate);
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

    if (KeyModel.isInitKey(refKey)) {
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

  RefLog = new RefLogModel();

  return RefLog;
});
