/**
 * No Description
 * 
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define([ 'lib/extend', './interfaces/model' ], function (extend, Model) {
  function ListModel () {
    ListModel.superconstructor.call(this);
    this.length = 0;
    this.list = [];

    this.registerListener(this);
  }
  extend(ListModel, Model);

  ListModel.prototype.push = function (object) {
    var retval;

    retval = this.list.push(object);

    this.emit('insert', {
      id : this.list.length - 1,
      object : object,
    });

    return retval;
  };

  ListModel.prototype.pop = function () {
    var object;

    object = this.list.pop();

    this.emit('remove', {
      id : this.list.length,
      object : object,
    });

    return object;
  };

  ListModel.prototype.insert = function (index, object) {
    if (index >= 0 && index <= this.list.length) {
      this.list.splice(index, 0, object);

      this.emit('insert', {
        id : index,
        object : object,
      });
    }

    return undefined;
  };

  ListModel.prototype.remove = function (index) {
    var object;

    if (index >= 0 && index < this.list.length) {
      object = this.list.splice(index, 1)[0];

      this.emit('remove', {
        id : index,
        object : object,
      });

      return object;
    }

    return undefined;
  };

  ListModel.prototype.clear = function () {
    this.list = [];
    this.emit('reset');
  };

  ListModel.prototype.indexOf = function (object) {
    return this.list.indexOf(object);
  };

  ListModel.prototype.get = function (index) {
    return this.list[index];
  };

  ListModel.prototype.set = function (index, object) {
    if (index >= 0 && index < this.list.length) {
      this.remove(index);
      this.insert(index, object);
      return object;
    }

    return undefined;
  };

  ListModel.prototype.asArray = function () {
    return this.list.slice(0);
  };

  ListModel.prototype.oninsert = function () {
    this.length = this.list.length;
  };

  ListModel.prototype.onremove = function () {
    this.length = this.list.length;
  };

  ListModel.prototype.onreset = function () {
    this.length = this.list.length;
  };

  return ListModel;
});
