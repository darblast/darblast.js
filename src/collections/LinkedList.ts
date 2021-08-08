namespace Darblast {
export namespace Collections {


class Node<Element> {
  public element: Element;
  public previous: Node<Element> | null = null;
  public next: Node<Element> | null = null;

  public constructor(element: Element) {
    this.element = element;
  }
}


type MaybeNode<Element> = Node<Element> | null;


export class LinkedList<Element> implements Iterable<Element> {
  private _size: number = 0;
  private _head: MaybeNode<Element> = null;
  private _tail: MaybeNode<Element> = null;

  public constructor(...elements: Element[]) {
    this.push(...elements);
  }

  public get size(): number {
    return this._size;
  }

  public get length(): number {
    return this._size;
  }

  public isEmpty(): boolean {
    return !this._size;
  }

  public *[Symbol.iterator](): Iterator<Element> {
    for (let node = this._head; node !== null; node = node.next) {
      yield node.element;
    }
  }

  private readonly _reverse: Iterable<Element> = {
    [Symbol.iterator]: function* () {
      for (let node = this._tail; node !== null; node = node.previous) {
        yield node.element;
      }
    }.bind(this),
  };

  public get reverse(): Iterable<Element> {
    return this._reverse;
  }

  public push(...elements: Element[]): void {
    for (let element of elements) {
      const node = new Node<Element>(element);
      if (this._size > 0) {
        node.previous = this._tail;
        this._tail!.next = node;
        this._tail = node;
      } else {
        this._head = node;
        this._tail = node;
      }
      this._size++;
    }
  }

  public pop(): Element {
    if (!this._size) {
      throw new Error('cannot pop from an empty list');
    }
    const {element} = this._tail!;
    this._tail = this._tail!.previous;
    if (this._tail) {
      this._tail.next = null;
    } else {
      this._head = null;
    }
    this._size--;
    return element;
  }

  public shift(): Element {
    if (!this._size) {
      throw new Error('cannot shift an empty list');
    }
    const {element} = this._head!;
    this._head = this._head!.next;
    if (this._head) {
      this._head.previous = null;
    } else {
      this._tail = null;
    }
    this._size--;
    return element;
  }

  public unshift(...elements: Element[]): void {
    for (let element of elements) {
      const node = new Node<Element>(element);
      if (this._size > 0) {
        node.next = this._head;
        this._head!.previous = node;
        this._head = node;
      } else {
        this._head = node;
        this._tail = node;
      }
      this._size++;
    }
  }
}


}  // namespace Collections
}  // namespace Darblast


/**
 * @hidden
 */
type LinkedList<Element> = Darblast.Collections.LinkedList<Element>;

/**
 * @hidden
 */
const LinkedList = Darblast.Collections.LinkedList;
