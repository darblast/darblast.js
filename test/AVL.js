const {expect} = require('chai');

const Darblast = require('../dist/darblast.js');
const {AVL, LinkedList} = Darblast.Collections;


const TestAVL = AVL.compileFromSchema({
  x: 'int32',
  y: 'int32',
  z: 'int32',
  id: 'uint8',
  status: 'uint8',
}, [
  ['x', 'y', 'z'],
  ['y', 'x', 'z'],
]);


const compareRecords = (record1, record2) => {
  expect(record1.x).to.equal(record2.x);
  expect(record1.y).to.equal(record2.y);
  expect(record1.z).to.equal(record2.z);
  expect(record1.id).to.equal(record2.id);
  expect(record1.status).to.equal(record2.status);
};


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
    compareRecords(tree.lookup0(e.x, e.y, e.z), e);
    compareRecords(tree.lookup(e.x, e.y, e.z), e);
  });

  it('retrieves an inserted element with the second index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    compareRecords(tree.lookup1(e.y, e.x, e.z), e);
  });

  it('retrieves another inserted element with the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    compareRecords(tree.lookup0(e2.x, e2.y, e2.z), e2);
    compareRecords(tree.lookup0(e2.x, e2.y, e2.z), e2);
  });

  it('retrieves another inserted element with the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    compareRecords(tree.lookup1(e2.y, e2.x, e2.z), e2);
  });

  it('retrieves the first inserted element with the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    compareRecords(tree.lookup0(e1.x, e1.y, e1.z), e1);
    compareRecords(tree.lookup(e1.x, e1.y, e1.z), e1);
  });

  it('retrieves the first inserted element with the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    compareRecords(tree.lookup1(e1.y, e1.x, e1.z), e1);
  });
});


describe('Stress-tested AVL', () => {
  const TestAVL = AVL.compileFromSchema({asd: 'uint32'}, [['asd']]);

  it('stays balanced throughout incremental insertion', () => {
    const tree = new TestAVL();
    for (let value = 0; value < 1024; value++) {
      tree.insertOrUpdate({asd: value});
      tree._checkConsistency();
    }
    expect(tree.size).to.equal(1024);
    let i = 0;
    for (let {asd} of tree) {
      expect(asd).to.equal(i++);
    }
  });

  it('stays balanced throughout level-wise insertion', () => {
    const tree = new TestAVL();
    const queue = new LinkedList({
      offset: 0,
      value: 512,
    });
    while (queue.size > 0) {
      const {offset, value} = queue.shift();
      tree.insertOrUpdate({asd: value});
      tree._checkConsistency();
      if (value > offset) {
        const half = (value - offset) >>> 1;
        queue.push({
          offset: offset,
          value: offset + half,
        }, {
          offset: value,
          value: value + half,
        });
      }
    }
    expect(tree.size).to.equal(1024);
    let i = 0;
    for (let {asd} of tree) {
      expect(asd).to.equal(i++);
    }
  });
});
