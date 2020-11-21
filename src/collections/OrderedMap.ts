namespace Darblast {
export namespace Collections {


class Node<Key, Value> {
  public leftChild: Node<Key, Value> | null = null;
  public rightChild: Node<Key, Value> | null = null;
  public balance: number = 0;
  public readonly key: Key;
  public value: Value;

  public constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }
}


type MaybeNode<Key, Value> = Node<Key, Value> | null;


export class OrderedMap<Key, Value> {
  private readonly _compare: (key1: Key, key2: Key) => number;
  private _root: MaybeNode<Key, Value> = null;
  private _size: number = 0;

  public constructor(compare: (key1: Key, key2: Key) => number) {
    this._compare = compare;
  }

  public get size() {
    return this._size;
  }

  public lookup(key: Key): Value {
    let node = this._root;
    while (node) {
      const cmp = this._compare(key, node.key);
      if (cmp < 0) {
        node = node.leftChild;
      } else if (cmp > 0) {
        node = node.rightChild;
      } else {
        return node.value;
      }
    }
    throw new Error(`element with key ${JSON.stringify(key)} not found`);
  }

  public contains(key: Key): boolean {
    let node = this._root;
    while (node) {
      const cmp = this._compare(key, node.key);
      if (cmp < 0) {
        node = node.leftChild;
      } else if (cmp > 0) {
        node = node.rightChild;
      } else {
        return true;
      }
    }
    return false;
  }

  private* _lowerBound(node: MaybeNode<Key, Value>, key: Key):
      Generator<Node<Key, Value>>
  {
    if (node) {
      const cmp = this._compare(key, node.key);
      if (cmp >= 0) {
        yield* this._lowerBound(node.leftChild, key);
        yield node;
        yield* this._lowerBound(node.rightChild, key);
      }
    }
  }

  public* lowerBound(key: Key): Generator<[Key, Value], boolean, boolean> {
    for (const node of this._lowerBound(this._root, key)) {
      if (yield [node.key, node.value]) {
        return false;
      }
    }
    return true;
  }

  private* _upperBound(node: MaybeNode<Key, Value>, key: Key):
      Generator<Node<Key, Value>>
  {
    if (node) {
      const cmp = this._compare(key, node.key);
      if (cmp < 0) {
        yield* this._upperBound(node.leftChild, key);
        yield node;
        yield* this._upperBound(node.rightChild, key);
      }
    }
  }

  public* upperBound(key: Key): Generator<[Key, Value], boolean, boolean> {
    for (const node of this._upperBound(this._root, key)) {
      if (yield [node.key, node.value]) {
        return false;
      }
    }
    return true;
  }

  private* _range(
      node: MaybeNode<Key, Value>, lowerBound: Key, upperBound: Key):
      Generator<Node<Key, Value>>
  {
    if (node) {
      if (this._compare(node.key, lowerBound) >= 0 &&
          this._compare(node.key, upperBound) < 0)
      {
        yield* this._lowerBound(node.leftChild, lowerBound);
        yield node;
        yield* this._upperBound(node.rightChild, upperBound);
      }
    }
  }

  public* range(lowerBound: Key, upperBound: Key):
      Generator<[Key, Value], boolean, boolean>
  {
    for (const node of this._range(this._root, lowerBound, upperBound)) {
      if (yield [node.key, node.value]) {
        return true;
      }
    }
    return false;
  }

  private* _scan(node: MaybeNode<Key, Value>): Generator<Node<Key, Value>> {
    if (node) {
      yield* this._scan(node.leftChild);
      yield node;
      yield* this._scan(node.rightChild);
    }
  }

  public* scan(): Generator<[Key, Value], boolean, boolean> {
    for (const node of this._scan(this._root)) {
      if (yield [node.key, node.value]) {
        return false;
      }
    }
    return false;
  }

  public [Symbol.iterator](): Iterator<[Key, Value], boolean, boolean> {
    return this.scan();
  }

  private _rotateLeft(parent: Node<Key, Value>, node: Node<Key, Value>):
      Node<Key, Value>
  {
    parent.rightChild = node;
    node.leftChild = parent;
    if (node.balance) {
      node.balance = 0;
      parent.balance = 0;
    } else {
      node.balance = -1;
      parent.balance = 1;
    }
    return node;
  }

  private _rotateRight(parent: Node<Key, Value>, node: Node<Key, Value>):
      Node<Key, Value>
  {
    parent.leftChild = node;
    node.rightChild = parent;
    if (node.balance) {
      node.balance = 0;
      parent.balance = 0;
    } else {
      node.balance = 1;
      parent.balance = -1;
    }
    return node;
  }

  private _rotateRightLeft(parent: Node<Key, Value>, node: Node<Key, Value>):
      Node<Key, Value>
  {
    const child = node.leftChild!;
    node.leftChild = child.rightChild;
    parent.rightChild = child.leftChild;
    child.leftChild = parent;
    child.rightChild = node;
    if (child.balance > 0) {
      parent.balance = -1;
      node.balance = 0;
    } else if (child.balance < 0) {
      parent.balance = 0;
      node.balance = 1;
    } else {
      parent.balance = 0;
      node.balance = 0;
    }
    return child;
  }

  private _rotateLeftRight(parent: Node<Key, Value>, node: Node<Key, Value>):
      Node<Key, Value>
  {
    const child = node.rightChild!;
    node.rightChild = child.leftChild;
    parent.leftChild = child.rightChild;
    child.rightChild = parent;
    child.leftChild = node;
    if (child.balance > 0) {
      parent.balance = 1;
      node.balance = 0;
    } else if (child.balance < 0) {
      parent.balance = 0;
      node.balance = -1;
    } else {
      parent.balance = 0;
      node.balance = 0;
    }
    return child;
  }

  private _insertOrUpdate(node: MaybeNode<Key, Value>, key: Key, value: Value):
      Node<Key, Value>
  {
    if (node) {
      const cmp = this._compare(key, node.key);
      if (cmp < 0) {
        const child = this._insertOrUpdate(node.leftChild, key, value);
        node.leftChild = child;
        if (node.balance < 0) {
          if (child.balance > 0) {
            return this._rotateLeftRight(node, child);
          } else {
            return this._rotateRight(node, child);
          }
        } else if (node.balance > 0) {
          node.balance = 0;
          return node;
        } else {
          node.balance = -1;
          return node;
        }
      } else if (cmp > 0) {
        const child = this._insertOrUpdate(node.rightChild, key, value);
        node.rightChild = child;
        if (node.balance > 0) {
          if (child.balance < 0) {
            return this._rotateRightLeft(node, child);
          } else {
            return this._rotateLeft(node, child);
          }
        } else if (node.balance < 0) {
          node.balance = 0;
          return node;
        } else {
          node.balance = 1;
          return node;
        }
      } else {
        node.value = value;
        return node;
      }
    } else {
      this._size++;
      return new Node<Key, Value>(key, value);
    }
  }

  public insertOrUpdate(key: Key, value: Value): void {
    this._root = this._insertOrUpdate(this._root, key, value);
  }
}


}  // namespace Collections
}  // namespace Darblast
