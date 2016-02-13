/**
 * TimeMachineRefLogModel
 *
 * @return TimeMachineRefLogModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'presets', 'ui/timemachinekeyquerymodel',
    'core/listmodel', 'core/listener', 'ui/timemachinekeymodel'], function(
    extend, Model, Presets, TimeMachineKeyQueryModel, ListModel, Listener,
    TimeMachineKeyModel) {
  var reflogKey, reflogRegex, TimeMachineRefLog;

  reflogKey = Presets.target + '-reflog';
  reflogRegex = /^[a-z]*-reflog$/;

  /**
   * Constructor
   */
  function TimeMachineRefLogModel() {
    TimeMachineRefLogModel.superconstructor.call(this);

    this.data = {};

    Listener.bind(this, 'error', function(event, emitter, message) {
      console.error(message);
    })

    this.refresh();
  }
  extend(TimeMachineRefLogModel, Model);

  TimeMachineRefLogModel.prototype.EVENTS = {
    'error': true
  };

  TimeMachineRefLogModel.prototype.refresh = function() {
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

    this.data = undefined;
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

  TimeMachineRefLogModel.prototype.reconstruct = function() {
    var query, data;

    query = new TimeMachineKeyQueryModel(TimeMachineKeyQueryModel.INITKEYS);
    data = {};

    query.filter().forEach(function(initKey) {
      var keyQuery, initDate, refDate;

      initKey = new TimeMachineKeyModel(initKey);
      keyQuery = new TimeMachineKeyQueryModel(initKey);

      initDate = initKey.startDate;
      data[initDate] = {};
      refDate = initKey.startDate;

      keyQuery.filter().forEach(function(saveKey) {
        saveKey = new TimeMachineKeyModel(saveKey);

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

  TimeMachineRefLogModel.prototype.store = function() {
    var dataString;

    if (!this.isValid()) {
      this.emit('error', 'RefLogModel: this.data is not valid!');
      return false;
    }

    dataString = JSON.stringify(this.data);

    window.localStorage[reflogKey] = dataString;

    return window.localStorage[reflogKey] === dataString;
  };

  TimeMachineRefLogModel.prototype.isValid = function() {
    if (!this.data) {
      return false;
    }

    // TODO check format!
    return true;
  };

  TimeMachineRefLogModel.prototype.newSaveKey = function(parentKey) {
    var newKey, startDate, refDate, saveDate;
    if (!parentKey) {
      this.emit('error', 'newSaveKey: no parent key given');
      return undefined;
    }

    newKey = new TimeMachineKeyModel(parentKey);

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

  TimeMachineRefLogModel.prototype.newInitKey = function() {
    var newKey = new TimeMachineKeyModel();

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

  TimeMachineRefLogModel.prototype.contains = function(refKey) {
    if (!this.data[refKey.startDate]) {
      return false;
    }

    if (TimeMachineKeyModel.isInitKey(refKey)) {
      return true;
    }

    if (!this.data[refKey.startDate][refKey.saveDate]) {
      return false;
    }

    return true;
  };

  TimeMachineRefLogModel.prototype.getParent = function(refKey) {
    if (!this.contains(refKey)) {
      this.emit('error', 'reflog does not contain key for parent search!');
      return undefined;
    }

    if (TimeMachineKeyModel.isInitKey(refKey)) {
      return undefined;
    }

    return TimeMachineKeyModel.construct(refKey.startDate,
        this.data[refKey.startDate][refKey.saveDate]);
  };

  TimeMachineRefLogModel.prototype.getChildren = function(refKey) {
    if (!this.contains(refKey)) {
      this.emit('error', 'reflog does not contain key for children search');
      return undefined;
    }

    return Object.keys(this.data[refKey.startDate]).filter(function(saveDate) {
      var parentDate = this.data[refKey.startDate][saveDate];
      return parentDate === refKey.saveDate;
    }, this).map(function(saveDate) {
      return TimeMachineKeyModel.construct(refKey.startDate, saveDate);
    });
  };

  TimeMachineRefLogModel.prototype.getAllKeys = function() {
    var keys;

    keys = this.getInitKeys();

    Object.keys(this.data).forEach(function(startDate) {
      Object.keys(this.data[startDate]).forEach(function(saveDate) {
        keys.push(TimeMachineKeyModel.construct(startDate, saveDate));
      });
    }, this);

    return keys.sort();
  }

  TimeMachineRefLogModel.prototype.getInitKeys = function() {
    return Object.keys(this.data).sort().map(function(startDate) {
      return TimeMachineKeyModel.construct(startDate, startDate);
    });
  };

  TimeMachineRefLogModel.prototype.getLatestGlobalKey = function() {
    var data, latestKey;

    data = this.data;
    latestKey = Object.keys(this.data).map(function(startDate) {
      var saveDate = Object.keys(data[startDate]).sort().pop() || startDate;
      return TimeMachineKeyModel.construct(startDate, saveDate);
    }).sort(TimeMachineKeyModel.sortFunction).pop();

    if (!latestKey) {
      this.emit('error', 'reflog contains no data');
      return undefined;
    }

    return latestKey;
  };

  TimeMachineRefLogModel.prototype.getLatestRelatedKey = function(refKey) {
    var startDate, saveDate, latestKey;

    if (!TimeMachineKeyModel.isValidKey(refKey)) {
      this.emit('error', 'getLatestRelatedKey(): refKey is invalid')
      return undefined;
    }

    startDate = refKey.startDate;

    if (!this.data[startDate]) {
      this.emit('error', 'init-key object is missing in reflog');
      return undefined;
    }

    saveDate = Object.keys(this.data[startDate]).sort().pop() || startDate;

    return TimeMachineKeyModel.construct(startDate, saveDate);
  };

  TimeMachineRefLogModel.prototype.reset = function() {
    this.data = {};

    this.store();
  };

  TimeMachineRefLogModel.prototype.deleteTree = function(refKey) {
    delete this.data[refKey.startDate];

    this.store();
  };

  TimeMachineRefLogModel.prototype.deleteKey = function(refKey) {
    var parentKey, children;

    if (TimeMachineKeyModel.isInitKey(refKey)) {
      this.emit('error', 'cannot delete a single init key. '
          + 'use deleteTournament() instead');
    }

    if (!this.contains(refKey)) {
      this.emit('error', 'deleteKey(): refKey is not in reflog!');
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

  TimeMachineRefLogModel.prototype.toString = function() {
    return JSON.stringify(this.data);
  };

  TimeMachineRefLog = new TimeMachineRefLogModel();

  return TimeMachineRefLog;
});
