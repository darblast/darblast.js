/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Math {


export class vec2 {
  public constructor(
      public x: number,
      public y: number) {}

  public clone(): vec2 {
    return new vec2(this.x, this.y);
  }

  public add_(other: vec2): vec2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public add(other: vec2): vec2 {
    return new vec2(this.x + other.x, this.y + other.y);
  }

  public sub_(other: vec2): vec2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public sub(other: vec2): vec2 {
    return new vec2(this.x - other.x, this.y - other.y);
  }

  public mul_(r: number): vec2 {
    this.x *= r;
    this.y *= r;
    return this;
  }

  public mul(r: number): vec2 {
    return new vec2(this.x * r, this.y * r);
  }

  public div_(r: number): vec2 {
    this.x /= r;
    this.y /= r;
    return this;
  }

  public div(r: number): vec2 {
    return new vec2(this.x / r, this.y / r);
  }

  public dot(other: vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  public modulus(): number {
    return GlobalMath.hypot(this.x, this.y);
  }

  public normalize_(): vec2 {
    return this.div_(this.modulus());
  }

  public normalize(): vec2 {
    return this.div(this.modulus());
  }
}


}  // namespace Math
}  // namespace Darblast


type vec2 = Darblast.Math.vec2;
const vec2 = Darblast.Math.vec2;
