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


}  // namespace Math
}  // namespace Darblast


type vec2 = Darblast.Math.vec2;
const vec2 = Darblast.Math.vec2;

type vec3 = Darblast.Math.vec3;
const vec3 = Darblast.Math.vec3;

type vec4 = Darblast.Math.vec4;
const vec4 = Darblast.Math.vec4;
