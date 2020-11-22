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

  const value = domain => Math.floor(Math.random() * domain);
  const element = () => ({
    x: value(1e9),
    y: value(1e9),
    z: value(1e9),
    id: value(256),
    status: value(256),
  });

  beforeEach(() => {
    tree = new TestAVL();
  });

  afterEach(() => {
    tree._checkConsistency();
  });

  it('should be initially empty', () => {
    expect(tree.size).to.equal(0);
    expect(tree.capacity).to.equal(0);
  });

  it('grows upon insertion', () => {
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(1);
    expect(tree.capacity).to.equal(1);
  });

  it('grows more', () => {
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(2);
    expect(tree.capacity).to.equal(3);
  });

  it('grows exponentially', () => {
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    tree.insertOrUpdate(element());
    expect(tree.size).to.equal(4);
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

  it('retrieves an inserted element', () => {
    const e = element();
    tree.insertOrUpdate(e);
    expect(tree.lookup(e.x, e.y, e.z)).to.eql(e);
  });
});
