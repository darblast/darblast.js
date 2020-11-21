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


after(() => {
  tree._checkConsistency();
});


describe('AVL', () => {
  describe('size and capacity', () => {
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
      expect(tree.capacity).to.equal(3);
      tree.insertOrUpdate({x: 2, y: 0, z: 0, id: 0, status: 0});
      tree.insertOrUpdate({x: 3, y: 0, z: 0, id: 0, status: 0});
      expect(tree.size).to.equal(4);
      expect(tree.capacity).to.equal(7);
    });
  });

  describe('insertOrUpdate', () => {
    it('inserts an element', () => {
      const result = tree.insertOrUpdate(
          {x: 1, y: 2, z: 3, id: 42, status: 123});
      expect(result).to.equal(true);
    });

    it('updates an element at the second insertion', () => {
      const element = {x: 3, y: 2, z: 1, id: 42, status: 123};
      tree.insertOrUpdate(element);
      const result = tree.insertOrUpdate(element);
      expect(result).to.equal(false);
    });
  });
});
