const {expect} = require('chai');

const Darblast = require('../dist/darblast.js');
const {Utilities} = Darblast;
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
  const presetSequence = [
    { x: 816617827, y: 863568329, z: 587038946, id: 26, status: 170 },
    { x: 87209183, y: 289605493, z: 704531420, id: 208, status: 166 },
    { x: 561686274, y: 51722782, z: 36442940, id: 22, status: 177 },
    { x: 5747038, y: 377747871, z: 343827632, id: 247, status: 45 },
    { x: 800849925, y: 171244954, z: 19137726, id: 8, status: 91 },
    { x: 15617169, y: 627061959, z: 314950937, id: 70, status: 141 },
    { x: 897991440, y: 546611176, z: 177582891, id: 26, status: 76 },
    { x: 996393044, y: 974115644, z: 354984088, id: 245, status: 126 },
    { x: 989826495, y: 393308628, z: 904484450, id: 45, status: 37 },
    { x: 910892591, y: 997720146, z: 436688122, id: 147, status: 8 },
    { x: 573088888, y: 853180319, z: 47788652, id: 27, status: 53 },
    { x: 875272608, y: 185208317, z: 812592282, id: 156, status: 33 },
    { x: 777424869, y: 800659199, z: 625540932, id: 190, status: 21 },
    { x: 51241356, y: 874125454, z: 211970674, id: 129, status: 112 },
    { x: 765302681, y: 673873916, z: 800157265, id: 60, status: 238 },
    { x: 960387844, y: 624446930, z: 934118332, id: 10, status: 17 },
    { x: 646556465, y: 797401961, z: 173005017, id: 97, status: 23 },
    { x: 912564590, y: 135664089, z: 710641323, id: 189, status: 52 },
    { x: 30304498, y: 296875655, z: 52313956, id: 12, status: 193 },
    { x: 839148415, y: 49577368, z: 470871405, id: 169, status: 51 },
    { x: 20929530, y: 137531171, z: 724209165, id: 144, status: 102 },
    { x: 594980887, y: 23406145, z: 900135932, id: 168, status: 193 },
    { x: 74787435, y: 775951514, z: 934550670, id: 13, status: 226 },
    { x: 77405570, y: 646037498, z: 26336990, id: 76, status: 135 },
    { x: 228063099, y: 29653993, z: 177076824, id: 142, status: 206 },
    { x: 422374030, y: 136620581, z: 257105834, id: 1, status: 92 },
    { x: 781115246, y: 815452253, z: 673759786, id: 164, status: 129 },
    { x: 348670898, y: 460396132, z: 531276183, id: 45, status: 4 },
    { x: 548703747, y: 145460209, z: 264330377, id: 104, status: 33 },
    { x: 34955174, y: 843814127, z: 92032525, id: 58, status: 27 },
  ];

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
    checkRecordArray([...tree.reverse.fullScan0()], []);
    checkRecordArray([...tree.reverse.fullScan0_()], []);
    checkRecordArray([...tree.reverse.fullScan1()], []);
    checkRecordArray([...tree.reverse.fullScan1_()], []);
    checkRecordArray([...tree.reverse.fullScan()], []);
    checkRecordArray([...tree.reverse.fullScan_()], []);
    checkRecordArray([...tree.scan0()], []);
    checkRecordArray([...tree.scan0_()], []);
    checkRecordArray([...tree.scan1()], []);
    checkRecordArray([...tree.scan1_()], []);
    checkRecordArray([...tree.scan()], []);
    checkRecordArray([...tree.scan_()], []);
    checkRecordArray([...tree.reverse.scan0()], []);
    checkRecordArray([...tree.reverse.scan0_()], []);
    checkRecordArray([...tree.reverse.scan1()], []);
    checkRecordArray([...tree.reverse.scan1_()], []);
    checkRecordArray([...tree.reverse.scan()], []);
    checkRecordArray([...tree.reverse.scan_()], []);
  });

  it('yields an inserted element on the first index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    const array = [e];
    checkRecordArray([...tree.fullScan0()], array);
    checkRecordArray([...tree.fullScan0_()], array);
    checkRecordArray([...tree.fullScan()], array);
    checkRecordArray([...tree.fullScan_()], array);
    checkRecordArray([...tree.reverse.fullScan0()], array);
    checkRecordArray([...tree.reverse.fullScan0_()], array);
    checkRecordArray([...tree.reverse.fullScan()], array);
    checkRecordArray([...tree.reverse.fullScan_()], array);
    checkRecordArray([...tree.scan0()], array);
    checkRecordArray([...tree.scan0_()], array);
    checkRecordArray([...tree.scan()], array);
    checkRecordArray([...tree.scan_()], array);
    checkRecordArray([...tree.reverse.scan0()], array);
    checkRecordArray([...tree.reverse.scan0_()], array);
    checkRecordArray([...tree.reverse.scan()], array);
    checkRecordArray([...tree.reverse.scan_()], array);
  });

  it('yields an inserted element on the second index', () => {
    const e = element();
    tree.insertOrUpdate(e);
    const array = [e];
    checkRecordArray([...tree.fullScan1()], array);
    checkRecordArray([...tree.fullScan1_()], array);
    checkRecordArray([...tree.reverse.fullScan1()], array);
    checkRecordArray([...tree.reverse.fullScan1_()], array);
    checkRecordArray([...tree.scan1()], array);
    checkRecordArray([...tree.scan1_()], array);
    checkRecordArray([...tree.reverse.scan1()], array);
    checkRecordArray([...tree.reverse.scan1_()], array);
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
    checkRecordArray([...tree.reverse.fullScan0()], array);
    checkRecordArray([...tree.reverse.fullScan()], array);
    checkRecordArray([...tree.reverse.scan0()], array);
    checkRecordArray([...tree.reverse.scan()], array);
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
    checkRecordArray([...tree.reverse.fullScan1()], array);
    checkRecordArray([...tree.reverse.scan1()], array);
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

  it('removes an element', () => {
    const e = element();
    tree.insertOrUpdate(e);
    tree.removeRecord(e);
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
    i = 1024;
    for (let {value} of tree.reverse) {
      expect(value).to.equal(--i);
    }
  });

  it('stays balanced throughout reverse incremental insertion', () => {
    const tree = new TestAVL();
    for (let value = 1024; value > 0; value--) {
      tree.insertOrUpdate({value});
      tree._checkConsistency();
    }
    expect(tree.size).to.equal(1024);
    let i = 0;
    for (let {value} of tree) {
      expect(value).to.equal(++i);
    }
    i = 1024;
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
    i = 1024;
    for (let {value} of tree.reverse) {
      expect(value).to.equal(--i);
    }
  });

  // Override this if you have a known failing sequence.
  const presetSequence = null;

  it('stays balanced throughout random insertion', () => {
    const elements = presetSequence || Utilities.shuffle(
        Array.from({length: 1024}, (_, i) => i));
    const tree = new TestAVL();
    for (value of elements) {
      tree.insertOrUpdate({value});
      tree._checkConsistency();
    }
    expect(tree.size).to.equal(elements.length);
    let i = 0;
    for (let {value} of tree) {
      expect(value).to.equal(i++);
    }
    i = tree.size;
    for (let {value} of tree.reverse) {
      expect(value).to.equal(--i);
    }
  });
});
