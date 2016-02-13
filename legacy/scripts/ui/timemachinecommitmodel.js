/**
 * TimeMachineCommitModel *
 *
 * @return TimeMachineCommitModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'ui/timemachinereflog', 'core/type',
    'ui/timemachinekeymodel', 'ui/timemachinekeyquerymodel'], function(extend,
    Model, TimeMachineRefLog, Type, TimeMachineKeyModel,
    TimeMachineKeyQueryModel) {

  /**
   * Constructor.
   *
   * @param key
   *          a TimeMachineKeyModel instance
   */
  function TimeMachineCommitModel(key) {
    TimeMachineCommitModel.superconstructor.call(this);

    if (Type.isString(key)) {
      key = new TimeMachineKeyModel(key);
    }

    this.key = key;
  }
  extend(TimeMachineCommitModel, Model);

  TimeMachineCommitModel.prototype.EVENTS = {
    'remove': true,
    'child': true
  };

  TimeMachineCommitModel.prototype.isValid = function() {
    return !!this.key && TimeMachineKeyModel.isValidKey(this.key)
        && TimeMachineRefLog.contains(this.key)
        && !!window.localStorage[this.key];
  }

  TimeMachineCommitModel.prototype.isInitialCommit = function() {
    return TimeMachineKeyModel.isInitKey(this.key);
  };

  TimeMachineCommitModel.prototype.getChildren = function() {
    if (!TimeMachineRefLog.contains(this.key)) {
      return [];
    }
    return TimeMachineRefLog.getChildren(this.key).map(function(key) {
      return new TimeMachineCommitModel(key);
    });
  };

  TimeMachineCommitModel.prototype.getParent = function() {
    if (this.isInitialCommit()) {
      return undefined;
    }

    return new TimeMachineCommitModel(TimeMachineRefLog.getParent(this.key));
  };

  TimeMachineCommitModel.prototype.eraseTree = function() {
    var query;

    // first: properly delete all children to send the proper events
    this.getChildren().forEach(function(child) {
      child.eraseTree();
    });

    if (this.isInitialCommit()) {
      // delete eventual orphans (Won't send remove events)
      query = new TimeMachineKeyQueryModel(this.key);
      query.filter().forEach(
          window.localStorage.removeItem.bind(window.localStorage));
      TimeMachineRefLog.deleteTree(this.key);
    } else {
      // only delete everything that's depending on this commit
      this.remove();
    }
  };

  TimeMachineCommitModel.prototype.remove = function() {
    if (this.isInitialCommit()) {
      // removing the initial commit necessarily removes everything else, too
      this.eraseTree();
    } else {
      window.localStorage.removeItem(this.key.toString());
      TimeMachineRefLog.deleteKey(this.key);
    }
  };

  TimeMachineCommitModel.prototype.load = function() {
    if (this.isValid()) {
      return window.localStorage[this.key];
    }
    return undefined;
  };

  TimeMachineCommitModel.prototype.save = function(data) {
    var newKey = TimeMachineRefLog.newSaveKey(this.key);
    localStorage[newKey] = data;

    return new TimeMachineCommitModel(newKey);
  };

  TimeMachineCommitModel.init = function(data) {
    var newKey = TimeMachineRefLog.newInitKey();
    localStorage[newKey] = data;

    return new TimeMachineCommitModel(newKey);
  };

  TimeMachineCommitModel.sortFunction = function(commitA, commitB) {
    return TimeMachineKeyModel.sortFunction(commitA.key, commitB.key);
  };

  return TimeMachineCommitModel;
});
