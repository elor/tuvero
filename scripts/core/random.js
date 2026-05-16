import tuvero from 'tuvero';
var Random = function () {
  this.nextInt = tuvero.random.int;
  this.pick = tuvero.random.pick;
  this.pickAndRemove = tuvero.random.pluck;
};
export default Random;