import { random } from 'tuvero';
var Random = function () {
  this.nextInt = random.int;
  this.pick = random.pick;
  this.pickAndRemove = random.pluck;
};
export default Random;