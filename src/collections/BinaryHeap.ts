namespace Darblast {
export namespace Collections {


type CompareFn<Element> = (element1: Element, element2: Element) => number;


export class BinaryHeap<Element> {
  private readonly _compareFn: CompareFn<Element>;
  private _data: Element[] = [];

  public constructor(compare: CompareFn<Element>) {
    this._compareFn = compare;
  }

  public isEmpty(): boolean {
    return !this._data.length;
  }

  private _parent(i: number): number {
    return i >>> 1;
  }

  private _left(i: number): number {
    return i * 2;
  }

  private _right(i: number): number {
    return i * 2 + 1;
  }

  private _compare(i: number, j: number): number {
    return this._compareFn(this._data[i], this._data[j]);
  }

  private _swap(i: number, j: number): void {
    const t = this._data[i];
    this._data[i] = this._data[j];
    this._data[j] = t;
  }

  public push(element: Element): void {
    let i = this._data.length;
    this._data.push(element);
    while (i > 0) {
      const j = this._parent(i);
      if (this._compare(i, j) < 0) {
        this._swap(i, j);
        i = j;
      } else {
        return;
      }
    }
  }

  public top(): Element {
    if (this._data.length) {
      return this._data[0];
    } else {
      throw new Error('top invoked on empty heap');
    }
  }

  private _siftDown(i: number): void {
    const j = this._left(i);
    if (j >= this._data.length) {
      return;
    }
    const k = this._right(i);
    if (k < this._data.length) {
      if (this._compare(i, j) > 0) {
        if (this._compare(j, k) > 0) {
          this._swap(i, k);
          this._siftDown(k);
        } else {
          this._swap(i, j);
          this._siftDown(j);
        }
      } else if (this._compare(i, k) > 0) {
        this._swap(i, k);
        this._siftDown(k);
      }
    } else if (this._compare(i, j) > 0) {
      this._swap(i, j);
      this._siftDown(j);
    }
  }

  public pop(): Element {
    if (!this._data.length) {
      throw new Error('pop invoked on empty heap');
    }
    const element = this._data[0];
    this._data[0] = this._data[this._data.length - 1];
    if (this._data.length > 1) {
      this._data.length--;
    }
    this._siftDown(0);
    return element;
  }

  public clear(): void {
    this._data.length = 0;
  }

  private _heapify(): void {
    const halfSize = (this._data.length + 1) >>> 1;
    for (let i = 0; i < halfSize; i++) {
      this._siftDown(i);
    }
  }

  public swap(data: Element[]): Element[] {
    const result = this._data;
    this._data = data;
    this._heapify();
    return result;
  }

  public static fromArray<Element>(
      data: Element[], compare: CompareFn<Element>): BinaryHeap<Element>
  {
    const heap = new BinaryHeap<Element>(compare);
    heap.swap(data);
    return heap;
  }
}


}  // namespace Collections
}  // namespace Darblast


type BinaryHead<Element> = Darblast.Collections.BinaryHeap<Element>;
const BinaryHeap = Darblast.Collections.BinaryHeap;
