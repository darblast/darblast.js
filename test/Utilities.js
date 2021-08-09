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
