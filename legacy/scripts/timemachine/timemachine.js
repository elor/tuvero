/**
 * TimeMachineModel
 *
 * TODO TEST!
 *
 * @return TimeMachineModelModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'timemachine/reflog',
    'timemachine/keymodel', 'timemachine/commitmodel', 'core/listmodel',
    'timemachine/keyquerymodel', 'core/sortedreferencelistmodel'], function(
    extend, Model, RefLog, KeyModel, CommitModel, ListModel, KeyQueryModel,
    SortedReferenceListModel) {

  /**
   * Constructor
   */
  function TimeMachineModel() {
    var latestKey;
    TimeMachineModel.superconstructor.call(this);

    latestKey = RefLog.getLatestGlobalKey();

    this.unsortedRoots = new ListModel();
    this.roots = new SortedReferenceListModel(this.unsortedRoots,
        CommitModel.sortFunction);

    this.updateRoots();

    if (latestKey) {
      this.commit = new CommitModel(latestKey);
    } else {
      console.warn('No saved tournament found.');
      this.commit = undefined;
    }
  }
  extend(TimeMachineModel, Model);

  TimeMachineModel.prototype.EVENTS = {
    'init': true,
    'save': true
  };

  TimeMachineModel.prototype.updateRoots = function() {
    var initCommits, initKeyStrings, index, keyString;

    initCommits = RefLog.getInitKeys().map(function(key) {
      return new CommitModel(key);
    });
    initKeyStrings = initCommits.map(function(commit) {
      return commit.key.toString();
    });

    /*
     * remove old commits
     */
    for (index = this.unsortedRoots.length - 1; index >= 0; index -= 1) {
      keyString = this.unsortedRoots.get(index).key.toString();
      if (initKeyStrings.indexOf(keyString) === -1) {
        this.unsortedRoots.remove(index);
      }
    }

    /*
     * add new commits
     */
    initKeyStrings = this.unsortedRoots.map(function(commit) {
      return commit.key.toString();
    });
    initCommits.forEach(function(commit) {
      keyString = commit.key.toString();
      if (initKeyStrings.indexOf(keyString) === -1) {
        this.unsortedRoots.push(commit);
      }
    }, this);
  };

  /**
   * stores the given state under a fresh key as the root of a new tree
   *
   * @param state
   *          the string to save
   * @return the generated key
   */
  TimeMachineModel.prototype.init = function(state) {
    this.commit = CommitModel.init(state);

    this.emit('init', this.commit);

    this.updateRoots();

    return this.commit;
  };

  /**
   * stores the given state under a key, which is a descendant of parentKey
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

    this.emit('save', this.commit);

    return this.commit;
  };

  TimeMachineModel.prototype.getOrphans = function() {
    var query, orphanedCommits;

    /*
     * check all localStorage keys
     */
    query = new KeyQueryModel(KeyQueryModel.ALLKEYS);
    orphanedCommits = query.filter().map(function(keyString) {
      return new CommitModel(keyString);
    }).filter(function(commit) {
      return !commit.isValid();
    });

    /*
     * check all reflog entries
     */
    orphanedCommits = orphanedCommits.concat(RefLog.getAllKeys().map(
        function(key) {
          return new CommitModel(key);
        }).filter(function(commit) {
      return !commit.isValid();
    }));

    return orphanedCommits.sort(CommitModel.sortFunction);
  };

  TimeMachineModel.prototype.usedStorage = function() {
    var tuveroQuery, keys, targetSizes, total;

    targetSizes = {};

    tuveroQuery = new KeyQueryModel(KeyQueryModel.ALLTUVEROKEYS);
    tuveroQuery.filter().forEach(function(key) {
      var target, data;

      target = key.split('_')[0];
      data = localStorage[key] || '';

      targetSizes[target] = (targetSizes[target] || 0) + data.length;
    });

    total = 0;
    Object.keys(targetSizes).forEach(function(target) {
      // TODO use RefLog.dbstring() function or something
      targetSizes[target] += (localStorage[target + '-reflog'] || '').length;
      total += targetSizes[target];
    });
    targetSizes.total = total;

    return targetSizes;
  };

  window.RefLog = RefLog;

  var lastReflog;
  window.setInterval(function() {
    if (RefLog.toString() != lastReflog) {
      lastReflog = RefLog.toString();
      console.log(lastReflog);
      console.log(JSON.stringify(window.TimeMachine.usedStorage()));
    }
  }, 50);

  window.TimeMachine = new TimeMachineModel()
  return window.TimeMachine;
});
