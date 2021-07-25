/// <reference path="../Math.ts"/>
/// <reference path="View.ts"/>


namespace Darblast {
export namespace Drawing {


export class Element implements ivec3 {
  private static _lastId: number = 0;

  private readonly _view: View;

  public readonly id: number;

  private _i: number;
  private _j: number;
  private _k: number;

  public x: number;
  public y: number;
  public z: number;

  private readonly _x0: number;
  private readonly _y0: number;
  private readonly _width: number;
  private readonly _height: number;

  public constructor(
      view: View,
      i: number,
      j: number,
      k: number,
      x0: number,
      y0: number,
      width: number,
      height: number)
  {
    this._view = view;
    this._i = i;
    this._j = j;
    this._k = k;
    this._x0 = x0;
    this._y0 = y0;
    this._width = width;
    this._height = height;
    this._project();
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

  private _project(): void {
    this.x = this._i;
    this.y = this._j;
    this.z = this._k;
    this._view.project(this);
  }
}


}  // namespace Drawing
}  // namespace Darblast
