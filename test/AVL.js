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


const compareRecords0 = (record1, record2) => {
  if (record1.x < record2.x) {
    return -1;
  } else if (record1.x > record2.x) {
    return 1;
  } else if (record1.y < record2.y) {
    return -1;
  } else if (record1.y > record2.y) {
    return 1;
  } else if (record1.z < record2.z) {
    return -1;
  } else if (record1.z > record2.z) {
    return 1;
  } else {
    return 0;
  }
};

const compareRecords1 = (record1, record2) => {
  if (record1.y < record2.y) {
    return -1;
  } else if (record1.y > record2.y) {
    return 1;
  } else if (record1.x < record2.x) {
    return -1;
  } else if (record1.x > record2.x) {
    return 1;
  } else if (record1.z < record2.z) {
    return -1;
  } else if (record1.z > record2.z) {
    return 1;
  } else {
    return 0;
  }
};


const checkRecords = (record1, record2) => {
  expect(record1.x).to.equal(record2.x);
  expect(record1.y).to.equal(record2.y);
  expect(record1.z).to.equal(record2.z);
  expect(record1.id).to.equal(record2.id);
  expect(record1.status).to.equal(record2.status);
};

const checkRecordArray = (array1, array2) => {
  expect(array1.length).to.equal(array2.length);
  for (let i = 0; i < array1.length; i++) {
    checkRecords(array1[i], array2[i]);
  }
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
    expect(tree.length).to.equal(0);
    expect(tree.isEmpty()).to.equal(true);
    expect(tree.capacity).to.equal(0);
  });

  it('grows upon insertion', () => {
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(1);
    expect(tree.length).to.equal(1);
    expect(tree.isEmpty()).to.equal(false);
    expect(tree.capacity).to.equal(1);
  });

  it('grows more', () => {
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(2);
    expect(tree.length).to.equal(2);
    expect(tree.isEmpty()).to.equal(false);
    expect(tree.capacity).to.equal(3);
  });

  it('grows exponentially', () => {
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(4);
    expect(tree.length).to.equal(4);
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

  it('yields nothing when empty', () => {
    checkRecordArray([...tree.fullScan0()], []);
    checkRecordArray([...tree.fullScan0_()], []);
    checkRecordArray([...tree.fullScan1()], []);
    checkRecordArray([...tree.fullScan1_()], []);
    checkRecordArray([...tree.fullScan()], []);
    checkRecordArray([...tree.fullScan_()], []);
    checkRecordArray([...tree.reverseFullScan0()], []);
    checkRecordArray([...tree.reverseFullScan0_()], []);
    checkRecordArray([...tree.reverseFullScan1()], []);
    checkRecordArray([...tree.reverseFullScan1_()], []);
    checkRecordArray([...tree.reverseFullScan()], []);
    checkRecordArray([...tree.reverseFullScan_()], []);
    checkRecordArray([...tree.scan0()], []);
    checkRecordArray([...tree.scan0_()], []);
    checkRecordArray([...tree.scan1()], []);
    checkRecordArray([...tree.scan1_()], []);
    checkRecordArray([...tree.scan()], []);
    checkRecordArray([...tree.scan_()], []);
    checkRecordArray([...tree.reverseScan0()], []);
    checkRecordArray([...tree.reverseScan0_()], []);
    checkRecordArray([...tree.reverseScan1()], []);
    checkRecordArray([...tree.reverseScan1_()], []);
    checkRecordArray([...tree.reverseScan()], []);
    checkRecordArray([...tree.reverseScan_()], []);
  });

  it('yields an inserted element on the first index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    const array = [e];
    checkRecordArray([...tree.fullScan0()], array);
    checkRecordArray([...tree.fullScan0_()], array);
    checkRecordArray([...tree.fullScan()], array);
    checkRecordArray([...tree.fullScan_()], array);
    checkRecordArray([...tree.reverseFullScan0()], array);
    checkRecordArray([...tree.reverseFullScan0_()], array);
    checkRecordArray([...tree.reverseFullScan()], array);
    checkRecordArray([...tree.reverseFullScan_()], array);
    checkRecordArray([...tree.scan0()], array);
    checkRecordArray([...tree.scan0_()], array);
    checkRecordArray([...tree.scan()], array);
    checkRecordArray([...tree.scan_()], array);
    checkRecordArray([...tree.reverseScan0()], array);
    checkRecordArray([...tree.reverseScan0_()], array);
    checkRecordArray([...tree.reverseScan()], array);
    checkRecordArray([...tree.reverseScan_()], array);
  });

  it('yields an inserted element on the second index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    const array = [e];
    checkRecordArray([...tree.fullScan1()], array);
    checkRecordArray([...tree.fullScan1_()], array);
    checkRecordArray([...tree.reverseFullScan1()], array);
    checkRecordArray([...tree.reverseFullScan1_()], array);
    checkRecordArray([...tree.scan1()], array);
    checkRecordArray([...tree.scan1_()], array);
    checkRecordArray([...tree.reverseScan1()], array);
    checkRecordArray([...tree.reverseScan1_()], array);
  });

  it('yields two inserted elements on the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    const array = [e1, e2].sort(compareRecords0);
    checkRecordArray([...tree.fullScan0()], array);
    checkRecordArray([...tree.fullScan()], array);
    checkRecordArray([...tree.scan0()], array);
    checkRecordArray([...tree.scan()], array);
  });

  it('yields two inserted elements on the first index in reverse order', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    const array = [e1, e2].sort(compareRecords0).reverse();
    checkRecordArray([...tree.reverseFullScan0()], array);
    checkRecordArray([...tree.reverseFullScan()], array);
    checkRecordArray([...tree.reverseScan0()], array);
    checkRecordArray([...tree.reverseScan()], array);
  });

  it('yields two inserted elements on the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    const array = [e1, e2].sort(compareRecords1);
    checkRecordArray([...tree.fullScan1()], array);
    checkRecordArray([...tree.scan1()], array);
  });

  it('yields two inserted elements on the second index in reverse order', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    const array = [e1, e2].sort(compareRecords1).reverse();
    checkRecordArray([...tree.reverseFullScan1()], array);
    checkRecordArray([...tree.reverseScan1()], array);
  });

  it('retrieves an inserted element with the first index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    checkRecords(tree.lookup0(e.x, e.y, e.z), e);
    checkRecords(tree.lookup(e.x, e.y, e.z), e);
  });

  it('retrieves an inserted element with the second index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    checkRecords(tree.lookup1(e.y, e.x, e.z), e);
  });

  it('retrieves another inserted element with the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    checkRecords(tree.lookup0(e2.x, e2.y, e2.z), e2);
    checkRecords(tree.lookup0(e2.x, e2.y, e2.z), e2);
  });

  it('retrieves another inserted element with the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    checkRecords(tree.lookup1(e2.y, e2.x, e2.z), e2);
  });

  it('retrieves the first inserted element with the first index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    checkRecords(tree.lookup0(e1.x, e1.y, e1.z), e1);
    checkRecords(tree.lookup(e1.x, e1.y, e1.z), e1);
  });

  it('retrieves the first inserted element with the second index', () => {
    const e1 = element();
    const e2 = element();
    tree.insertOrUpdate(e1);
    tree.insertOrUpdate(e2);
    checkRecords(tree.lookup1(e1.y, e1.x, e1.z), e1);
  });
});


describe('Stress-tested AVL', () => {
  const TestAVL = AVL.compileFromSchema({value: 'uint32'}, [['value']]);

  it('stays balanced throughout incremental insertion', () => {
    const tree = new TestAVL();
    for (let value = 0; value < 1024; value++) {
      tree.insertOrUpdate({value});
      tree._checkConsistency();
    }
    expect(tree.size).to.equal(1024);
    let i = 0;
    for (let {value} of tree) {
      expect(value).to.equal(i++);
    }
    i = 1023;
    for (let {value} of tree.reverse) {
      expect(value).to.equal(i--);
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
      tree.insertOrUpdate({value});
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
    for (let {value} of tree) {
      expect(value).to.equal(i++);
    }
    i = 1023;
    for (let {value} of tree.reverse) {
      expect(value).to.equal(i--);
    }
  });
});
