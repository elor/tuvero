import { expect } from "chai";
import { range } from "lodash";

import random from "./random";

const ITERATIONS = 100;
type mapCall = (v: number, i: number, a: number[]) => any;
const repeat = (fn: mapCall, start?: number) => range(start || 0, ITERATIONS).map(fn);

const numerically = (a: number, b: number) => a - b;

describe("random/random.ts", () => {

  describe("int()", () => {
    it("int(0) equals 0", () => {
      repeat(() => expect(random.int(0)).to.equal(0));
    });

    it("int(1) always equals 0", () => {
      repeat(() => expect(random.int(1)).to.equal(0), 1);
    });

    it("stays in range", () => {
      repeat(max => expect(range(max)).to.include(random.int(max), `max=${max}`), 1);
    });

    it("swaps max and min if necessary", () => {
      const min = 0;
      const max = 10;
      repeat(() => expect(range(min, max)).to.contain(random.int(max, min)));
    });

    it("is min if max=min", () => {
      repeat(min => expect(random.int(min, min)).to.equal(min), 10);
    });
  });

  describe("range()", () => {
    it("is empty for range(0)", () => {
      expect(random.range(0)).to.be.empty;
    });

    it("range(1) to contain only 0", () => {
      expect(random.range(1)).to.deep.equal([0]);
    });

    it("to contain every index once", () => {
      expect(random.range(ITERATIONS).sort(numerically)).to.deep.equal(range(ITERATIONS));
    });

    it("to not be sorted", () => {
      expect(random.range(ITERATIONS)).to.not.deep.equal(range(ITERATIONS));
    });
  });

  describe("range1()", () => {
    it("is empty for range1(0)", () => {
      expect(random.range1(0)).to.be.empty;
    });

    it("range1(1) to contain only 1", () => {
      expect(random.range1(1)).to.deep.equal([1]);
    });

    it("to contain every index once", () => {
      expect(random.range1(ITERATIONS).sort(numerically)).to.deep.equal(range(ITERATIONS).map(n => n + 1));
    });

    it("to not be sorted", () => {
      expect(random.range1(ITERATIONS)).to.not.deep.equal(range(ITERATIONS).map(n => n + 1));
    });
  });

  describe("pick()", () => {
    it("throws RangeError on empty arrays", () => {
      expect(() => random.pick([])).to.throw(RangeError);
    });

    it("really picks an element from the array", () => {
      const array = range(10, 20).map(i => i * i);

      repeat(() => expect(array).to.contain(random.pick(array)));
    });

    it("does not alter the array", () => {
      const array = range(10);
      const original = array.slice();

      repeat(() => random.pick(array));

      expect(array).to.deep.equal(original);
    });

    it("picks every element eventually", () => {
      const array = range(10, 20);
      const copy: number[] = [];

      range(array.length ** 2)
        .map(() => random.pick(array))
        .forEach(i => copy[i - 10] = i);

      expect(copy).to.deep.equal(array);
    });
  });

  describe("pluck()", () => {
    it("throws RangeError on empty arrays", () => {
      expect(() => random.pluck([])).to.throw(RangeError);
    });

    it("really plucks an element from the array", () => {
      const array = random.range(10, 20).map(i => i * i);

      range(array.length - 1).forEach(() => expect(array).to.not.contain(random.pluck(array)));
    });

    it("alters the array", () => {
      const array = range(10);
      const original = array.slice();

      const plucked = random.pluck(array);

      expect(array.length).to.equal(original.length - 1);

      expect(array.concat(plucked).sort(numerically)).to.deep.equal(original.sort(numerically));
    });

    it("plucks every element eventually", () => {
      const array = range(10, 20);
      const original = array.slice();
      const copy: number[] = [];

      range(array.length)
        .map(() => random.pluck(array))
        .forEach(i => copy[i - 10] = i);

      expect(array).to.be.empty;
      expect(copy).to.deep.equal(original);
    });
  });

  describe("shuffle()", () => {
    it("works with empty arrays", () => {
      expect(random.shuffle([])).to.deep.equal([]);
    });

    it("preserves single-element arrays", () => {
      expect(random.shuffle([5])).to.deep.equal([5]);
    });

    it("preserves array length", () => {
      repeat(length => expect(random.shuffle(range(length))).to.be.of.length(length));
    });

    it("returns a copy of the array", () => {
      expect(random.shuffle([])).to.not.equal([]);
      expect(random.shuffle([6])).to.not.equal([6]);
    });

    it("contains the original elements", () => {
      repeat(length => expect(random.shuffle(range(length)).sort(numerically)).to.deep.equal(range(length)), 10);
    });

    it("returns an unsorted array", () => {
      repeat(length => expect(random.shuffle(range(length))).to.not.deep.equal(range(length)), 10);
    });
  });
});
