/// <reference path="../Math.ts"/>


namespace Darblast {
export namespace Drawing {


export class View {
  private readonly _matrix: mat3;

  public constructor(matrix: mat3) {
    this._matrix = matrix;
  }
}


}  // namespace Drawing
}  // namespace Darblast
