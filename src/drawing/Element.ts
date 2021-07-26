/// <reference path="../Math.ts"/>
/// <reference path="View.ts"/>
/// <reference path="FrameAnimation.ts"/>


namespace Darblast {
export namespace Drawing {


export abstract class BaseElement implements ivec3 {
  private static _lastId: number = 0;

  public readonly id: number = BaseElement._lastId++;

  public i: number = 0;
  public j: number = 0;
  public k: number = 0;
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  public constructor(
      public readonly x0: number,
      public readonly y0: number,
      public readonly width: number,
      public readonly height: number) {}

  public _project(view: View): void {
    this.x = this.i;
    this.y = this.j;
    this.z = this.k;
    view.project(this);
    this.x += this.x0;
    this.y += this.y0;
  }

  public abstract draw(
      t0: number, t1: number, context: CanvasRenderingContext2D): void;
}


export class StaticImageElement extends BaseElement {
  private readonly _image: HTMLImageElement;

  public constructor(image: HTMLImageElement, x0: number = 0, y0: number = 0) {
    super(x0, y0, image.width, image.height);
  }

  public get image(): HTMLImageElement {
    return this._image;
  }

  public draw(t0: number, t1: number, context: CanvasRenderingContext2D): void {
    context.drawImage(this._image, this.x, this.y);
  }
}


}  // namespace Drawing
}  // namespace Darblast


type BaseElement = Darblast.Drawing.BaseElement;
type StaticImageElement = Darblast.Drawing.StaticImageElement;
const StaticImageElement = Darblast.Drawing.StaticImageElement;
