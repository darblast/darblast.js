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

const tree = new TestAVL();


describe('AVL', () => {
  it('should be initially empty', () => {
    expect(tree.size).to.equal(0);
    expect(tree.capacity).to.equal(0);
  });

  it('grows upon insertion', () => {
    tree.insertOrUpdate({
      x: 0,
      y: 0,
      z: 0,
      id: 0,
      status: 0,
    });
    expect(tree.size).to.equal(1);
    expect(tree.capacity).to.equal(1);
  });

  it('grows exponentially', () => {
    tree.insertOrUpdate({x: 0, y: 0, z: 0, id: 0, status: 0});
    tree.insertOrUpdate({x: 1, y: 0, z: 0, id: 0, status: 0});
    expect(tree.size).to.equal(2);
    expect(tree.capacity).to.equal(2);
    tree.insertOrUpdate({x: 2, y: 0, z: 0, id: 0, status: 0});
    expect(tree.size).to.equal(3);
    expect(tree.capacity).to.equal(4);
    tree.insertOrUpdate({x: 3, y: 0, z: 0, id: 0, status: 0});
    tree.insertOrUpdate({x: 4, y: 0, z: 0, id: 0, status: 0});
    expect(tree.size).to.equal(5);
    expect(tree.capacity).to.equal(8);
  });
});
