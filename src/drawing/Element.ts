/// <reference path="../Math.ts"/>
/// <reference path="View.ts"/>
/// <reference path="FrameAnimation.ts"/>


namespace Darblast {
export namespace Drawing {


export abstract class BaseElement implements ivec3 {
  private static _lastId: number = 0;

  private readonly _view: View;

  public readonly id: number = BaseElement._lastId++;

  private _i: number = 0;
  private _j: number = 0;
  private _k: number = 0;

  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  private readonly _x0: number;
  private readonly _y0: number;
  private readonly _width: number;
  private readonly _height: number;

  public constructor(
      view: View,
      x0: number,
      y0: number,
      width: number,
      height: number)
  {
    this._view = view;
    this._x0 = x0;
    this._y0 = y0;
    this._width = width;
    this._height = height;
  }

  public get i(): number {
    return this._i;
  }

  public get j(): number {
    return this._j;
  }

  public get k(): number {
    return this._k;
  }

  public set i(value: number) {
    this._i = value;
    this._project();
  }

  public set j(value: number) {
    this._j = value;
    this._project();
  }

  public set k(value: number) {
    this._k = value;
    this._project();
  }

  public get x0(): number {
    return this._x0;
  }

  public get y0(): number {
    return this._y0;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  protected _project(): void {
    this.x = this._i;
    this.y = this._j;
    this.z = this._k;
    this._view.project(this);
    this.x += this._x0;
    this.y += this._y0;
  }

  public abstract draw(
      t0: number, t1: number, context: CanvasRenderingContext2D): void;

  private moveTo(i: number, j: number, k: number): void {
    this._i = i;
    this._j = j;
    this._k = k;
    this._project();
  }

  private moveBy(di: number, dj: number, dk: number): void {
    this._i += di;
    this._j += dj;
    this._k += dk;
    this._project();
  }
}


export class StaticImageElement extends BaseElement {
  private readonly _image: HTMLImageElement;

  public constructor(
      view: View, image: HTMLImageElement, x0: number = 0, y0: number = 0)
  {
    super(view, x0, y0, image.width, image.height);
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
