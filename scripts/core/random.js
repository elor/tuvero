define(['tuvero'], function (tuvero) {

  var Random = function () {
    this.nextInt = tuvero.random.int;
    this.pick = tuvero.random.pick;
    this.pickAndRemove = tuvero.random.pluck;
  };

  return Random;
});
