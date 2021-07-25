namespace Darblast {
export namespace Collections {


export class BinaryHeap<Element> {
  private readonly _compareFn: (element1: Element, element2: Element) => number;
  private readonly _data: Element[] = [];

  public constructor(
      compare: (element1: Element, element2: Element) => number)
  {
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

  public push(element: Element): number {
    let i = this._data.length;
    this._data.push(element);
    while (i > 0) {
      const j = this._parent(i);
      if (this._compare(i, j) < 0) {
        this._swap(i, j);
        i = j;
      } else {
        break;
      }
    }
    return i;
  }

  public top(): Element {
    if (this._data.length) {
      return this._data[0];
    } else {
      throw new Error('top invoked on empty heap');
    }
  }

  public remove(i: number): Element {
    if (i >= this._data.length) {
      throw new Error('out of range heap removal');
    }
    const element = this._data[i];
    this._data[i] = this._data[this._data.length - 1];
    if (this._data.length > 1) {
      this._data.length--;
    }
    while (true) {
      const j = this._left(i);
      const k = this._right(i);
      if (this._compare(i, j) > 0) {
        this._swap(i, j);
        i = j;
      } else if (this._compare(i, k) > 0) {
        this._swap(i, k);
        i = k;
      } else {
        break;
      }
    }
    return element;
  }

  public pop(): Element {
    if (this._data.length) {
      return this.remove(0);
    } else {
      throw new Error('pop invoked on empty heap');
    }
  }
}


}  // namespace Collections
}  // namespace Darblast
