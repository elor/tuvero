import { random } from 'tuvero'
const Random = function () {
  this.nextInt = random.int
  this.pick = random.pick
  this.pickAndRemove = random.pluck
}
export default Random
