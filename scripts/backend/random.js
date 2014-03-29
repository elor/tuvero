define(function () {
  var Random = function (x, c) {
    var date;

    if (x !== undefined && c !== undefined) {
      this.x = x;
      this.c = c;
    } else {
      date = new Date();

      this.x = date.getTime() & 0xFFFF;
      this.c = (date.getTime() >> 16) & 0xFFFF;
    }
  };

  Random.prototype.maxInt = 0x10000;

  Random.prototype.nextInt = function (top) {
    if (top !== undefined) {
      return Math.floor(this.nextDouble() * top);
    }

    this.x = 65184 * this.x + this.c;
    this.c = this.x >> 16;
    this.x = this.x & 0xFFFF;

    return this.x;
  };

  Random.prototype.nextDouble = function () {
    return this.nextInt() / this.maxInt;
  };

  Random.prototype.pick = function (array) {
    return array[this.nextInt(array.length)];
  };

  Random.prototype.pickAndRemove = function (array) {
    return array.splice(this.nextInt(array.length), 1)[0];
  };

  return Random;
});