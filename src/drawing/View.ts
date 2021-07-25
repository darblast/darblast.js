/// <reference path="../Math.ts"/>


namespace Darblast {
export namespace Drawing {


export class View {
  private readonly _matrix: mat3;
  private readonly _inverseMatrix: mat3;

  public constructor(matrix: mat3) {
    this._matrix = matrix;
    this._inverseMatrix = matrix.invert();
  }

  public project<Point extends ivec3>(point: Point): Point {
    return this._matrix.mulv_(point);
  }
}


}  // namespace Drawing
}  // namespace Darblast
