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
   * Constructor. Constructs a CommitModel from a KeyModel, regardless of the
   * presence in the localStorage or the RefLog
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
    'remove': true
  };

  /**
   * @return true if the key is valid, is in the RefLog and is in the
   *         localStorage, false otherwise
   */
  CommitModel.prototype.isValid = function() {
    return !!this.key && KeyModel.isValidKey(this.key)
        && RefLog.contains(this.key) && !!window.localStorage[this.key];
  }

  /**
   * @return true if the key is an initial key (has no parent and dates match),
   *         false otherwise
   */
  CommitModel.prototype.isInitialCommit = function() {
    return KeyModel.isInitKey(this.key);
  };

  /**
   * @return an array of CommitModels of children of this commit. If there's no
   *         child, the array is empty.
   */
  CommitModel.prototype.getChildren = function() {
    if (!RefLog.contains(this.key)) {
      return [];
    }
    return RefLog.getChildren(this.key).map(function(key) {
      return new CommitModel(key);
    }).sort(CommitModel.sortFunction);
  };

  /**
   * traverses the RefLog to find the youngest ancestor (highest save date)
   *
   * @return the youngest ancestor of this commit
   */
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

  /**
   * @return the parent if this commit. If this is an initial commit, undefined
   *         is returned
   */
  CommitModel.prototype.getParent = function() {
    if (this.isInitialCommit()) {
      return undefined;
    }

    return new CommitModel(RefLog.getParent(this.key));
  };

  /**
   * @param commit
   *          a CommitModel instance
   * @return true if the keys are equal, false otherwise
   */
  CommitModel.prototype.isEqual = function(commit) {
    return !!commit && this.key.isEqual(commit.key);
  }

  /**
   * @param descendant
   *          a CommitModel instance which might be a descendant of this commit
   * @return true if 'this' is in the parent chain of descendant, false
   *         otherwise
   */
  CommitModel.prototype.isAncestorOf = function(descendant) {
    var parent;

    if (!descendant || this.isInitialCommit()) {
      return false;
    }

    if (this.key.isRelated(descendant.key)) {
      return false;
    }

    for (parent = descendant.getParent(); parent; parent = parent.getParent()) {
      if (this.isEqual(parent)) {
        return true
      }
    }

    return false;
  };

  /**
   * Removes all descendant and itself. Emits 'remove' on all removed elements.
   *
   * If eraseTree is called on an initial commit, orphans with the same
   * startDate are cleaned up, too.
   */
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
      this.emit('remove');
    } else {
      // only delete everything that's depending on this commit
      this.remove();
    }
  };

  /**
   * removes this commit from the RefLog and localStorage and emits 'remove'.
   *
   * If an initial commit is removed, the whole tree is removed. See eraseTree()
   */
  CommitModel.prototype.remove = function() {
    if (this.isInitialCommit()) {
      // removing the initial commit necessarily removes everything else,
      // too
      this.eraseTree();
    } else {
      window.localStorage.removeItem(this.key.toString());
      RefLog.deleteKey(this.key);

      this.emit('remove');
    }
  };

  /**
   * read the contents of the localStorage under this key
   *
   * @return the locally stored data of this commit
   */
  CommitModel.prototype.load = function() {
    if (this.isValid()) {
      return window.localStorage[this.key];
    }
    return undefined;
  };

  /**
   * Creates a Child commit and saves data on it. Properly deals with the RefLog
   * and the localStorage.
   *
   * @param data
   *          the data to store locally under a new key
   * @return the newly created child commit
   */
  CommitModel.prototype.save = function(data) {
    var newKey = RefLog.newSaveKey(this.key);
    localStorage[newKey] = data;

    return new CommitModel(newKey);
  };

  /**
   * initialize a new commit with the given data. An init-key will be created,
   * which serves as the root of the commit tree
   *
   * @param data
   *          the data do store locally under a new key
   * @return the newly created root commit
   */
  CommitModel.init = function(data) {
    var newKey = RefLog.newInitKey();
    localStorage[newKey] = data;

    return new CommitModel(newKey);
  };

  /**
   * a sort function for CommitModels
   *
   * @param commitA
   * @param commitB
   * @return -1, 0, or 1, depending on the sort relation between the two
   */
  CommitModel.sortFunction = function(commitA, commitB) {
    return KeyModel.sortFunction(commitA.key, commitB.key);
  };

  return CommitModel;
});
