const {expect} = require('chai');

const Darblast = require('../dist/darblast.js');
const {AVL} = Darblast.Collections;


const TestAVL = AVL.fromSchema({
  x: 'int32',
  y: 'int32',
  z: 'int32',
  id: 'uint8',
  status: 'uint8',
}, [
  ['x', 'y', 'z'],
  ['y', 'x', 'z'],
]);


describe('AVL', () => {
  let tree;

  // Override this if you have a known failing sequence.
  const presetSequence = null;

  const sequence = [];

  const value = domain => Math.floor(Math.random() * domain);

  const generateElement = () => {
    const index = sequence.length;
    if (presetSequence && index < presetSequence.length) {
      return presetSequence[index];
    } else {
      return {
        x: value(1e9),
        y: value(1e9),
        z: value(1e9),
        id: value(256),
        status: value(256),
      };
    }
  };

  const element = () => {
    const element = generateElement();
    sequence.push(element);
    return element;
  };

  beforeEach(() => {
    tree = new TestAVL();
  });

  afterEach(() => {
    try {
      tree._checkConsistency();
    } catch (e) {
      console.error(e);
      console.error('Failing sequence follows:');
      console.dir(sequence);
      throw e;
    }
  });

  it('should be initially empty', () => {
    expect(tree.size).to.equal(0);
    expect(tree.isEmpty()).to.equal(true);
    expect(tree.capacity).to.equal(0);
  });

  it('grows upon insertion', () => {
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(1);
    expect(tree.isEmpty()).to.equal(false);
    expect(tree.capacity).to.equal(1);
  });

  it('grows more', () => {
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(2);
    expect(tree.isEmpty()).to.equal(false);
    expect(tree.capacity).to.equal(3);
  });

  it('grows exponentially', () => {
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(4);
    expect(tree.isEmpty()).to.equal(false);
    expect(tree.capacity).to.equal(7);
  });

  it('inserts an element', () => {
    const result = tree.insertOrUpdate(element());
    expect(result).to.equal(true);
  });

  it('updates an element at the second insertion', () => {
    const e = element();
    tree.insertOrUpdate(e);
    const result = tree.insertOrUpdate(e);
    expect(result).to.equal(false);
  });

  it('retrieves an inserted element with the first index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    expect(tree.lookup0(e.x, e.y, e.z)).to.eql(e);
    expect(tree.lookup(e.x, e.y, e.z)).to.eql(e);
  });

  it('retrieves an inserted element with the second index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    expect(tree.lookup1(e.y, e.x, e.z)).to.eql(e);
  });

  it('retrieves another inserted element with the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    expect(tree.lookup0(e2.x, e2.y, e2.z)).to.eql(e2);
    expect(tree.lookup(e2.x, e2.y, e2.z)).to.eql(e2);
  });

  it('retrieves another inserted element with the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    expect(tree.lookup1(e2.y, e2.x, e2.z)).to.eql(e2);
  });

  it('retrieves the first inserted element with the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    expect(tree.lookup0(e1.x, e1.y, e1.z)).to.eql(e1);
    expect(tree.lookup(e1.x, e1.y, e1.z)).to.eql(e1);
  });

  it('retrieves the first inserted element with the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    expect(tree.lookup1(e1.y, e1.x, e1.z)).to.eql(e1);
  });
});
