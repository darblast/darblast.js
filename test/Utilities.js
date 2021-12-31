const {expect} = require('chai');

const Darblast = require('../dist/darblast.js');
const {Utilities} = Darblast;


describe('Utilities.range', () => {
  it('returns an empty array', () => {
    expect(Utilities.range(0)).to.eql([]);
  });

  it('ranges from 0 to 0', () => {
    expect(Utilities.range(1)).to.eql([0]);
  });

  it('ranges from 0 to 1', () => {
    expect(Utilities.range(2)).to.eql([0, 1]);
  });

  it('ranges from 1 to 3', () => {
    expect(Utilities.range(3, 1)).to.eql([1, 2, 3]);
  });

  it('ranges from 2 to 4', () => {
    expect(Utilities.range(3, 2)).to.eql([2, 3, 4]);
  });
});


describe('Utilities.shuffle', () => {
  it('permutates the input array', () => {
    const array = Utilities.range(1024);
    const shuffled = Utilities.shuffle(array.slice());
    expect(shuffled).to.not.eql(array);
    expect(shuffled.sort((a, b) => a - b)).to.eql(array);
  });
});


describe('Utilities.binarySearch', () => {
  it('does not find anything in an empty array', () => {
    expect(Utilities.binarySearch([], 42)).to.equal(-1);
  });

  it('does not find an element in an array with one element', () => {
    expect(Utilities.binarySearch([123], 42)).to.equal(-1);
  });

  it('does not find an element in an array with two elements', () => {
    expect(Utilities.binarySearch([12, 34], 42)).to.equal(-1);
  });

  it('does not find an element in an array with three elements', () => {
    expect(Utilities.binarySearch([12, 34, 56], 42)).to.equal(-1);
  });

  it('finds an element in an array with one element', () => {
    expect(Utilities.binarySearch([42], 42)).to.equal(0);
  });

  it('finds the first element in an array with two elements', () => {
    expect(Utilities.binarySearch([12, 34], 12)).to.equal(0);
  });

  it('finds the second element in an array with two elements', () => {
    expect(Utilities.binarySearch([12, 34], 34)).to.equal(1);
  });

  it('finds the first element in an array with three elements', () => {
    expect(Utilities.binarySearch([12, 34, 56], 12)).to.equal(0);
  });

  it('finds the second element in an array with three elements', () => {
    expect(Utilities.binarySearch([12, 34, 56], 34)).to.equal(1);
  });

  it('finds the third element in an array with three elements', () => {
    expect(Utilities.binarySearch([12, 34, 56], 56)).to.equal(2);
  });

  it('finds a random element', () => {
    const array = Utilities.range(1024);
    const value = Math.floor(Math.random() * 1024);
    const index = Utilities.binarySearch(array, value);
    expect(array[index]).to.equal(value);
  });
});
