/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Math {


export class vec2 {
  public constructor(
      public x: number,
      public y: number) {}

  public static fromVec3(v: vec3): vec2 {
    return new vec2(v.x, v.y);
  }

  public static fromVec4(v: vec4): vec2 {
    return new vec2(v.x, v.y);
  }

  public clone(): vec2 {
    return new vec2(this.x, this.y);
  }

  public toVec3(z: number): vec3 {
    return new vec3(this.x, this.y, z);
  }

  public toVec4(z: number, w: number): vec4 {
    return new vec4(this.x, this.y, z, w);
  }

  public toHomogeneous(): vec3 {
    return this.toVec3(1);
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

  public angle(other: vec2): number {
    const r = this.modulus() * other.modulus();
    return GlobalMath.acos(this.dot(other) / r);
  }

  public rotate_(a: number): vec2 {
    return mat2.rotation(a).mulv_(this);
  }

  public rotate(a: number): vec2 {
    return mat2.rotation(a).mulv(this);
  }

  public scale_(x: number, y: number): vec2 {
    return mat2.scaling(x, y).mulv_(this);
  }

  public scale(x: number, y: number): vec2 {
    return mat2.scaling(x, y).mulv(this);
  }
}


export class vec3 {
  public constructor(
      public x: number,
      public y: number,
      public z: number) {}

  public static fromVec2(v: vec2, z: number): vec3 {
    return new vec3(v.x, v.y, z);
  }

  public static fromVec4(v: vec4): vec3 {
    return new vec3(v.x, v.y, v.z);
  }

  public clone(): vec3 {
    return new vec3(this.x, this.y, this.z);
  }

  public toVec2(): vec2 {
    return new vec2(this.x, this.y);
  }

  public toVec4(w: number): vec4 {
    return new vec4(this.x, this.y, this.z, w);
  }

  public toHomogeneous(): vec4 {
    return this.toVec4(1);
  }

  public toStandard(): vec2 {
    return this.toVec2().div_(this.z);
  }

  public add_(other: vec3): vec3 {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public add(other: vec3): vec3 {
    return new vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public sub_(other: vec3): vec3 {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  public sub(other: vec3): vec3 {
    return new vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public mul_(r: number): vec3 {
    this.x *= r;
    this.y *= r;
    this.z *= r;
    return this;
  }

  public mul(r: number): vec3 {
    return new vec3(this.x * r, this.y * r, this.z * r);
  }

  public div_(r: number): vec3 {
    this.x /= r;
    this.y /= r;
    this.z /= r;
    return this;
  }

  public div(r: number): vec3 {
    return new vec3(this.x / r, this.y / r, this.z / r);
  }

  public dot(other: vec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  public cross_(other: vec3): vec3 {
    const x = this.y * other.z - this.z * other.y;
    const y = this.z * other.x - this.x * other.z;
    const z = this.x * other.y - this.y * other.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public cross(other: vec3): vec3 {
    return new vec3(
        this.y * other.z - this.z * other.y,
        this.z * other.x - this.x * other.z,
        this.x * other.y - this.y * other.x);
  }

  public modulus(): number {
    return GlobalMath.hypot(this.x, this.y, this.z);
  }

  public normalize_(): vec3 {
    return this.div_(this.modulus());
  }

  public normalize(): vec3 {
    return this.div(this.modulus());
  }

  public angle(other: vec3): number {
    const r = this.modulus() * other.modulus();
    return GlobalMath.acos(this.dot(other) / r);
  }
}


export class vec4 {
  public constructor(
      public x: number,
      public y: number,
      public z: number,
      public w: number) {}

  public static fromVec2(v: vec2, z: number, w: number): vec4 {
    return new vec4(v.x, v.y, z, w);
  }

  public static fromVec3(v: vec3, w: number): vec4 {
    return new vec4(v.x, v.y, v.z, w);
  }

  public clone(): vec4 {
    return new vec4(this.x, this.y, this.z, this.w);
  }

  public toVec2(): vec2 {
    return new vec2(this.x, this.y);
  }

  public toVec3(): vec3 {
    return new vec3(this.x, this.y, this.z);
  }

  public toStandard(): vec3 {
    return this.toVec3().div_(this.w);
  }

  public add_(other: vec4): vec4 {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    this.w += other.w;
    return this;
  }

  public add(other: vec4): vec4 {
    return new vec4(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z,
        this.w + other.w);
  }

  public sub_(other: vec4): vec4 {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    this.w -= other.w;
    return this;
  }

  public sub(other: vec4): vec4 {
    return new vec4(
        this.x - other.x,
        this.y - other.y,
        this.z - other.z,
        this.w - other.w);
  }

  public mul_(r: number): vec4 {
    this.x *= r;
    this.y *= r;
    this.z *= r;
    this.w *= r;
    return this;
  }

  public mul(r: number): vec4 {
    return new vec4(this.x * r, this.y * r, this.z * r, this.w * r);
  }

  public div_(r: number): vec4 {
    this.x /= r;
    this.y /= r;
    this.z /= r;
    this.w /= r;
    return this;
  }

  public div(r: number): vec4 {
    return new vec4(this.x / r, this.y / r, this.z / r, this.w / r);
  }

  public dot(other: vec4): number {
    return this.x * other.x + this.y * other.y + this.z * other.z +
        this.w * other.w;
  }

  public modulus(): number {
    return GlobalMath.hypot(this.x, this.y, this.z, this.w);
  }

  public normalize_(): vec4 {
    return this.div_(this.modulus());
  }

  public normalize(): vec4 {
    return this.div(this.modulus());
  }
}


export class mat2 {
  public constructor(
      public m00: number,
      public m01: number,
      public m10: number,
      public m11: number) {}

  public static identity(): mat2 {
    return new mat2(1, 0, 0, 1);
  }

  public static rotation(a: number): mat2 {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    return new mat2(cos, -sin, sin, cos);
  }

  public static scaling(x: number, y: number): mat2 {
    return new mat2(x, 0, 0, y);
  }

  public clone(): mat2 {
    return new mat2(this.m00, this.m01, this.m10, this.m11);
  }

  public determinant(): number {
    return this.m00 * this.m11 - this.m01 * this.m10;
  }

  public mul_(other: mat2): mat2 {
    const m00 = this.m00 * other.m00 + this.m01 * other.m10;
    const m01 = this.m00 * other.m01 + this.m01 * other.m11;
    const m10 = this.m10 * other.m00 + this.m11 * other.m10;
    const m11 = this.m10 * other.m01 + this.m11 * other.m11;
    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
    return this;
  }

  public mul(other: mat2): mat2 {
    return new mat2(
        this.m00 * other.m00 + this.m01 * other.m10,
        this.m00 * other.m01 + this.m01 * other.m11,
        this.m10 * other.m00 + this.m11 * other.m10,
        this.m10 * other.m01 + this.m11 * other.m11);
  }

  public mulr_(r: number): mat2 {
    this.m00 *= r;
    this.m01 *= r;
    this.m10 *= r;
    this.m11 *= r;
    return this;
  }

  public mulr(r: number): mat2 {
    return new mat2(this.m00 * r, this.m01 * r, this.m10 * r, this.m11 * r);
  }

  public mulv_(v: vec2): vec2 {
    const x = this.m00 * v.x + this.m01 * v.y;
    const y = this.m10 * v.x * this.m11 * v.y;
    v.x = x;
    v.y = y;
    return v;
  }

  public mulv(v: vec2): vec2 {
    return new vec2(
        this.m00 * v.x + this.m01 * v.y,
        this.m10 * v.x * this.m11 * v.y);
  }
}


}  // namespace Math
}  // namespace Darblast


type vec2 = Darblast.Math.vec2;
const vec2 = Darblast.Math.vec2;

type vec3 = Darblast.Math.vec3;
const vec3 = Darblast.Math.vec3;

type vec4 = Darblast.Math.vec4;
const vec4 = Darblast.Math.vec4;

type mat2 = Darblast.Math.mat2;
const mat2 = Darblast.Math.mat2;
