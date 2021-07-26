/// <reference path="Element.ts"/>
/// <reference path="../collections/AVL.ts"/>
/// <reference path="../collections/BinaryHeap.ts"/>


namespace Darblast {
export namespace Drawing {


export class ElementManager {
  private readonly _elements: {[id: number]: BaseElement} = Object.create(null);

  private readonly _tree = AVL.fromSchema({
    x: 'int32',
    y: 'int32',
    z: 'int32',
    id: 'uint32',
  }, [['x', 'y', 'z', 'id']]);
}


}  // namespace Drawing
}  // namespace Darblast
