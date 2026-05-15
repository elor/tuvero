import { rand } from "mersenne";
import { range as _range } from "lodash";

const random = {
  /**
   * Return a single integer within the given range.
   * Will be swapped if min > max.
   *
   * @param min Inclusive minimum.
   * @param max Optional. Exclusive maximum.
   * @returns a random integer in [min, max) or [max, min), if max < min
   */
  int (min: number, max: number = 0): number {
    if (min > max) {
      return random.int(max, min);
    }

    if (min == max) {
      return min;
    }

    return min + rand(max - min);
  },

  /**
   * Randomly pick an element from an array.
   * Will not remove the element from the array.
   * See pluck() for that.
   *
   * @param array The array to pick from
   * @returns a random element from the array.
   */
  pick<T> (array: T[]): T {
    if (array.length === 0) {
      throw new RangeError();
    }
    return array[random.int(array.length)];
  },

  /**
   * Randomly pluck an element from an array.
   * Will remove the element from the array.
   * See pick() otherwise
   *
   * @param array The array to pick and remove from
   * @returns a random element from the array.
   */
  pluck<T> (array: T[]): T {
    if (array.length === 0) {
      throw new RangeError();
    }
    return array.splice(random.int(array.length), 1)[0];
  },

  range (from: number, to?: number): number[] {
    const indices = _range(from, to);

    return indices.slice().map(() => random.pluck(indices));
  },

  range1 (count: number): number[] {
    return random.range(count).map(n => n + 1);
  },

  shuffle<T> (array: T[]): T[] {
    return random.range(array.length).map(i => array[i]);
  }
};

export default random;
