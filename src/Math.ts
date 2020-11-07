/// <reference path="GlobalMath.ts"/>


namespace Darblast {
export namespace Math {


export interface ivec2 {
  x: number;
  y: number;
}

export interface ivec3 extends ivec2 {
  z: number;
}

export interface ivec4 extends ivec3 {
  w: number;
}


export class vec2 implements ivec2 {
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

  public translate_(x: number, y: number): vec2 {
    this.x += x;
    this.y += y;
    return this;
  }

  public translate(x: number, y: number): vec2 {
    return new vec2(this.x + x, this.y + y);
  }

  public translatev_(v: vec2): vec2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public translatev(v: vec2): vec2 {
    return new vec2(this.x + v.x, this.y + v.y);
  }

  public rotate_(a: number, cx: number = 0, cy: number = 0): vec2 {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    const dx = this.x - cx;
    const dy = this.y - cy;
    this.x = cx + dx * cos - dy * sin;
    this.y = cy + dx * sin + dy * cos;
    return this;
  }

  public rotate(a: number, cx: number = 0, cy: number = 0): vec2 {
    return this.clone().rotate_(cx, cy, a);
  }

  public rotatec_(a: number, c: vec2): vec2 {
    return this.rotate_(a, c.x, c.y);
  }

  public rotatec(a: number, c: vec2): vec2 {
    return this.clone().rotate_(a, c.x, c.y);
  }

  public scale_(x: number, y: number, cx: number = 0, cy: number = 0): vec2 {
    this.x = cx + (this.x - cx) * x;
    this.y = cy + (this.y - cy) * y;
    return this;
  }

  public scale(x: number, y: number, cx: number = 0, cy: number = 0): vec2 {
    return this.clone().scale_(x, y, cx, cy);
  }

  public scalec_(x: number, y: number, c: vec2): vec2 {
    return this.scale_(x, y, c.x, c.y);
  }

  public scalec(x: number, y: number, c: vec2): vec2 {
    return this.clone().scale_(x, y, c.x, c.y);
  }
}


export class vec3 implements ivec3 {
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

  public translate2_(x: number, y: number): vec3 {
    this.x += x * this.z;
    this.y += y * this.z;
    return this;
  }

  public translate2(x: number, y: number): vec3 {
    return new vec3(this.x + x * this.z, this.y + y * this.z, this.z);
  }

  public translate2v_(v: vec3): vec3 {
    this.x += v.x * this.z / v.z;
    this.y += v.y * this.z / v.z;
    return this;
  }

  public translate2v(v: vec3): vec3 {
    return new vec3(
        this.x + v.x * this.z / v.z,
        this.y + v.y * this.z / v.z,
        this.z);
  }

  public translate3_(x: number, y: number, z: number): vec3 {
    this.x += x;
    this.y += y;
    this.z += z;
    return this;
  }

  public translate3(x: number, y: number, z: number): vec3 {
    return new vec3(this.x + x, this.y + y, this.z + z);
  }

  public translate3v_(v: vec3): vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  public translate3v(v: vec3): vec3 {
    return new vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  public rotate2_(a: number, cx: number = 0, cy: number = 0): vec3 {
    cx *= this.z;
    cy *= this.z;
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    const dx = this.x - cx;
    const dy = this.y - cy;
    this.x = (cx + dx * cos - dy * sin);
    this.y = (cy + dx * sin + dy * cos);
    return this;
  }

  public rotate2(a: number, cx: number = 0, cy: number = 0): vec3 {
    return this.clone().rotate2_(a, cx, cy);
  }

  public rotate2c_(a: number, c: vec3): vec3 {
    return this.rotate2_(a, c.x / c.z, c.y / c.z);
  }

  public rotate2c(a: number, c: vec3): vec3 {
    return this.rotate2(a, c.x / c.z, c.y / c.z);
  }

  public rotate3_(
      a: number,
      nx: number, ny: number, nz: number,
      cx: number = 0, cy: number = 0, cz: number = 0): vec3
  {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    const omc = 1 - cos;
    const x = this.x - cx;
    const y = this.y - cy;
    const z = this.z - cz;
    const dot = nx * x + ny * y + nz * z;
    this.x = cx + nx * dot * omc + x * cos + (-nz * y + ny * z) * sin;
    this.y = cy + ny * dot * omc + y * cos + (nz * x - nx * z) * sin;
    this.z = cz + nz * dot * omc + z * cos + (-ny * x + nx * y) * sin;
    return this;
  }

  public rotate3(
    a: number,
    nx: number, ny: number, nz: number,
    cx: number = 0, cy: number = 0, cz: number = 0): vec3
  {
    return this.clone().rotate3_(a, nx, ny, nz, cx, cy, cz);
  }

  public rotate3v_(a: number, n: vec3, c: vec3): vec3 {
    return this.rotate3_(a, n.x, n.y, n.z, c.x, c.y, c.z);
  }

  public rotate3v(a: number, n: vec3, c: vec3): vec3 {
    return this.clone().rotate3_(a, n.x, n.y, n.z, c.x, c.y, c.z);
  }

  public scale2_(x: number, y: number, cx: number = 0, cy: number = 0): vec3 {
    cx *= this.z;
    cy *= this.z;
    this.x = cx + (this.x - cx) * x;
    this.y = cy + (this.y - cy) * y;
    return this;
  }

  public scale2(x: number, y: number, cx: number = 0, cy: number = 0): vec3 {
    return this.clone().scale2_(x, y, cx, cy);
  }

  public scale2c_(x: number, y: number, c: vec3): vec3 {
    return this.scale2_(x, y, c.x / c.z, c.y / c.z);
  }

  public scale2c(x: number, y: number, c: vec3): vec3 {
    return this.scale2(x, y, c.x / c.z, c.y / c.z);
  }

  public scale3_(
      x: number, y: number, z: number,
      cx: number, cy: number, cz: number): vec3
  {
    this.x = cx + (this.x - cx) * x;
    this.y = cy + (this.y - cy) * y;
    this.z = cz + (this.z - cz) * z;
    return this;
  }

  public scale3(
    x: number, y: number, z: number,
    cx: number, cy: number, cz: number): vec3
  {
    return this.clone().scale3_(x, y, z, cx, cy, cz);
  }

  public scale3c_(x: number, y: number, z: number, c: vec3): vec3 {
    return this.scale3_(x, y, z, c.x, c.y, c.z);
  }

  public scale3c(x: number, y: number, z: number, c: vec3): vec3 {
    return this.clone().scale3_(x, y, z, c.x, c.y, c.z);
  }
}


export class vec4 implements ivec4 {
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


export class mat3 {
  public constructor(
      public m00: number,
      public m01: number,
      public m02: number,
      public m10: number,
      public m11: number,
      public m12: number,
      public m20: number,
      public m21: number,
      public m22: number) {}

  public static identity(): mat3 {
    return new mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  public static translation(x: number, y: number): mat3 {
    return new mat3(1, 0, x, 0, 1, y, 0, 0, 1);
  }

  public static scaling(x: number, y: number, z: number = 1): mat3 {
    return new mat3(x, 0, 0, 0, y, 0, 0, 0, z);
  }

  public clone(): mat3 {
    return new mat3(
        this.m00, this.m01, this.m02,
        this.m10, this.m11, this.m12,
        this.m20, this.m21, this.m22);
  }
}


}  // namespace Math
}  // namespace Darblast


type ivec2 = Darblast.Math.ivec2;
type vec2 = Darblast.Math.vec2;
const vec2 = Darblast.Math.vec2;

type ivec3 = Darblast.Math.ivec3;
type vec3 = Darblast.Math.vec3;
const vec3 = Darblast.Math.vec3;

type ivec4 = Darblast.Math.ivec4;
type vec4 = Darblast.Math.vec4;
const vec4 = Darblast.Math.vec4;

type mat2 = Darblast.Math.mat2;
const mat2 = Darblast.Math.mat2;

type mat3 = Darblast.Math.mat3;
const mat3 = Darblast.Math.mat3;
