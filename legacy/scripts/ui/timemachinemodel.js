/**
 * TimeMachineModel
 *
 * TODO TEST!
 *
 * @return TimeMachineModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'ui/timemachinereflog',
    'ui/timemachinekeymodel', 'ui/timemachinecommitmodel',
    'ui/timemachinekeyquerymodel'], function(extend, Model, TimeMachineRefLog,
    TimeMachineKeyModel, TimeMachineCommitModel, TimeMachineKeyQueryModel) {

  /**
   * Constructor
   */
  function TimeMachineModel() {
    var latestKey;
    TimeMachineModel.superconstructor.call(this);

    latestKey = TimeMachineRefLog.getLatestGlobalKey();

    if (latestKey) {
      this.commit = new TimeMachineCommitModel(latestKey);
    } else {
      console.warn('No saved tournament found.');
      this.commit = undefined;
    }
  }
  extend(TimeMachineModel, Model);

  /**
   * stores the given state under a fresh key as the root of a new tree
   *
   * @param state
   *          the string to save
   * @return the generated key
   */
  TimeMachineModel.prototype.init = function(state) {
    this.commit = TimeMachineCommitModel.init(state);
    return this.commit;
  };

  /**
   * stores te given state under a key, which is a descendant of parentKey
   *
   * @param state
   *          the string to save
   * @param parentKey
   *          the key of any parent in the same tree
   *
   * @return the generated key
   */
  TimeMachineModel.prototype.save = function(state) {
    if (this.commit && this.commit.isValid()) {
      this.commit = this.commit.save(state);
    } else {
      return this.init(state);
    }

    return this.commit;
  };

  TimeMachineModel.prototype.getOrphans = function() {
    var query, orphanedCommits;

    /*
     * check all localStorage keys
     */
    query = new TimeMachineKeyQueryModel(TimeMachineKeyQueryModel.ALLKEYS);
    orphanedCommits = query.filter().map(function(keyString) {
      return new TimeMachineCommitModel(keyString);
    }).filter(function(commit) {
      return !commit.isValid();
    });

    /*
     * check all reflog entries
     */
    orphanedCommits = orphanedCommits.concat(TimeMachineRefLog.getAllKeys()
        .map(function(key) {
          return new TimeMachineCommitModel(key);
        }).filter(function(commit) {
          return !commit.isValid();
        }));

    return orphanedCommits.sort(TimeMachineCommitModel.sortFunction);
  };

  TimeMachineModel.prototype.getTreeRoots = function() {
    return TimeMachineRefLog.getInitKeys().map(function(key) {
      return new TimeMachineCommitModel(key);
    });
  };

  window.reflog = TimeMachineRefLog;
  window.timeMachine = new TimeMachineModel()

  var lastReflog;
  window.setInterval(function() {
    if (TimeMachineRefLog.toString() != lastReflog) {
      lastReflog = TimeMachineRefLog.toString();
      console.log(lastReflog);
    }
  }, 50);

  TimeMachineModel.prototype.usedStorage = function() {
    var tuveroQuery, keys, targetSizes, total;

    targetSizes = {};

    tuveroQuery = new TimeMachineKeyQueryModel(
        TimeMachineKeyQueryModel.ALLTUVEROKEYS);
    tuveroQuery.filter().forEach(function(key) {
      var target, data;

      target = key.split('_')[0];
      data = localStorage[key] || '';

      targetSizes[target] = (targetSizes[target] || 0) + data.length;
    });

    total = 0;
    Object.keys(targetSizes).forEach(function(target) {
      targetSizes[target] += (localStorage[target + '-reflog'] || '').length;
      total += targetSizes[target];
    });
    targetSizes.total = total;

    return targetSizes;
  };

  return TimeMachineModel;
});
