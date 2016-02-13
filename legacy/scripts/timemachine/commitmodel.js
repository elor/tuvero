/**
 * CommitModel
 *
 * @return CommitModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'core/model', 'timemachine/reflog', 'core/type',
    'timemachine/keymodel', 'timemachine/keyquerymodel'], function(extend,
    Model, RefLog, Type, KeyModel, KeyQueryModel) {

  /**
   * Constructor.
   *
   * @param key
   *          a KeyModel instance
   */
  function CommitModel(key) {
    CommitModel.superconstructor.call(this);

    if (Type.isString(key)) {
      key = new KeyModel(key);
    }

    this.key = key;
  }
  extend(CommitModel, Model);

  CommitModel.prototype.EVENTS = {
    'remove': true,
    'newchild': true,
    'newparent': true,
  };

  CommitModel.prototype.isValid = function() {
    return !!this.key && KeyModel.isValidKey(this.key)
        && RefLog.contains(this.key) && !!window.localStorage[this.key];
  }

  CommitModel.prototype.isInitialCommit = function() {
    return KeyModel.isInitKey(this.key);
  };

  CommitModel.prototype.getChildren = function() {
    if (!RefLog.contains(this.key)) {
      return [];
    }
    return RefLog.getChildren(this.key).map(function(key) {
      return new CommitModel(key);
    }).sort(CommitModel.sortFunction);
  };

  CommitModel.prototype.getYoungestAncestor = function() {
    var children, youngestChild;

    children = this.getChildren();

    if (children.length === 0) {
      return undefined;
    }

    youngestChild = children[children.length - 1];

    children.forEach(function(child) {
      var youngestGrandChild = child.getYoungestAncestor();
      if (!youngestGrandChild) {
        return;
      }
      if (CommitModel.sortFunction(youngestGrandChild, youngestChild) === 1) {
        youngestChild = youngestGrandChild;
      }
    });

    return youngestChild;
  };

  CommitModel.prototype.getParent = function() {
    if (this.isInitialCommit()) {
      return undefined;
    }

    return new CommitModel(RefLog.getParent(this.key));
  };

  CommitModel.prototype.eraseTree = function() {
    var query;

    // first: properly delete all children to send the proper events
    this.getChildren().forEach(function(child) {
      child.eraseTree();
    });

    if (this.isInitialCommit()) {
      // delete eventual orphans (Won't send remove events)
      query = new KeyQueryModel(this.key);
      query.filter().forEach(
          window.localStorage.removeItem.bind(window.localStorage));
      RefLog.deleteTree(this.key);
    } else {
      // only delete everything that's depending on this commit
      this.remove();
    }
  };

  CommitModel.prototype.remove = function() {
    if (this.isInitialCommit()) {
      // removing the initial commit necessarily removes everything else,
      // too
      this.eraseTree();
    } else {
      window.localStorage.removeItem(this.key.toString());
      RefLog.deleteKey(this.key);
    }
  };

  CommitModel.prototype.load = function() {
    if (this.isValid()) {
      return window.localStorage[this.key];
    }
    return undefined;
  };

  CommitModel.prototype.save = function(data) {
    var newKey = RefLog.newSaveKey(this.key);
    localStorage[newKey] = data;

    return new CommitModel(newKey);
  };

  CommitModel.init = function(data) {
    var newKey = RefLog.newInitKey();
    localStorage[newKey] = data;

    return new CommitModel(newKey);
  };

  CommitModel.sortFunction = function(commitA, commitB) {
    return KeyModel.sortFunction(commitA.key, commitB.key);
  };

  return CommitModel;
});
