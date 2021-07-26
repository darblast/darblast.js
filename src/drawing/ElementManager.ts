/// <reference path="View.ts"/>
/// <reference path="Element.ts"/>
/// <reference path="../collections/AVL.ts"/>
/// <reference path="../collections/BinaryHeap.ts"/>


namespace Darblast {
export namespace Drawing {


export class ElementManager {
  private readonly _view: View;

  private readonly _elements: {[id: number]: BaseElement} = Object.create(null);

  private readonly _tree = AVL.fromSchema({
    x: 'int32',
    y: 'int32',
    z: 'int32',
    id: 'uint32',
  }, [['x', 'y', 'z', 'id']]);

  private readonly _widthQueue: BinaryHeap<BaseElement> =
      new BinaryHeap<BaseElement>(
          (element1: BaseElement, element2: BaseElement) =>
              element2.width - element1.width);

  private readonly _heightQueue: BinaryHeap<BaseElement> =
      new BinaryHeap<BaseElement>(
          (element1: BaseElement, element2: BaseElement) =>
              element2.height - element1.height);

  public constructor(view: View) {
    this._view = view;
  }
}


}  // namespace Drawing
}  // namespace Darblast
