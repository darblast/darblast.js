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

  public static zero(): vec2 {
    return new vec2(0, 0);
  }

  public static fromVec3(v: ivec3): vec2 {
    return new vec2(v.x, v.y);
  }

  public static fromVec4(v: ivec4): vec2 {
    return new vec2(v.x, v.y);
  }

  public toString(): string {
    return `vec2<${this.x}, ${this.y}>`;
  }

  public assign(v: ivec2): vec2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public assignVec3(v: ivec3): vec2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public assignVec4(v: ivec4): vec2 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public clone(): vec2 {
    return new vec2(this.x, this.y);
  }

  public toVec3(z: number = 0): vec3 {
    return new vec3(this.x, this.y, z);
  }

  public toVec4(z: number = 0, w: number = 1): vec4 {
    return new vec4(this.x, this.y, z, w);
  }

  public toHomogeneous(): vec3 {
    return this.toVec3(1);
  }

  public neg_(): vec2 {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  public neg(): vec2 {
    return new vec2(-this.x, -this.y);
  }

  public add_(other: ivec2): vec2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public add(other: ivec2): vec2 {
    return new vec2(this.x + other.x, this.y + other.y);
  }

  public sub_(other: ivec2): vec2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public sub(other: ivec2): vec2 {
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

  public dot(other: ivec2): number {
    return this.x * other.x + this.y * other.y;
  }

  public modulus(): number {
    return GlobalMath.hypot(this.x, this.y);
  }

  public length(): number {
    return GlobalMath.hypot(this.x, this.y);
  }

  public squareLength(): number {
    return this.x * this.x + this.y * this.y;
  }

  public normalize_(): vec2 {
    return this.div_(this.modulus());
  }

  public normalize(): vec2 {
    return this.div(this.modulus());
  }

  public angle(other: ivec2): number {
    const r = this.squareLength() * vec2.prototype.squareLength.call(other);
    return GlobalMath.acos(this.dot(other) / GlobalMath.sqrt(r));
  }

  public anglen(normal: ivec2): number {
    return GlobalMath.acos(this.dot(normal) / this.modulus());
  }

  public translate_(x: number, y: number): vec2 {
    this.x += x;
    this.y += y;
    return this;
  }

  public translate(x: number, y: number): vec2 {
    return new vec2(this.x + x, this.y + y);
  }

  public translatev_(v: ivec2): vec2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public translatev(v: ivec2): vec2 {
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
    return this.clone().rotate_(a, cx, cy);
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

  public static zero(): vec3 {
    return new vec3(0, 0, 0);
  }

  public static fromVec2(v: ivec2, z: number): vec3 {
    return new vec3(v.x, v.y, z);
  }

  public static fromVec4(v: ivec4): vec3 {
    return new vec3(v.x, v.y, v.z);
  }

  public toString(): string {
    return `vec3<${this.x}, ${this.y}, ${this.z}>`;
  }

  public assignVec2(v: ivec2): vec3 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public assign(v: ivec3): vec3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  public assignVec4(v: ivec4): vec3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  public clone(): vec3 {
    return new vec3(this.x, this.y, this.z);
  }

  public toVec2(): vec2 {
    return new vec2(this.x, this.y);
  }

  public toVec4(w: number = 1): vec4 {
    return new vec4(this.x, this.y, this.z, w);
  }

  public get xy(): vec2 {
    return new vec2(this.x, this.y);
  }

  public get xz(): vec2 {
    return new vec2(this.x, this.z);
  }

  public get yz(): vec2 {
    return new vec2(this.y, this.z);
  }

  public toHomogeneous(): vec4 {
    return this.toVec4(1);
  }

  public toStandard(): vec2 {
    return this.toVec2().div_(this.z);
  }

  public neg_(): vec3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  public neg(): vec3 {
    return new vec3(-this.x, -this.y, -this.z);
  }

  public add_(other: ivec3): vec3 {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public add(other: ivec3): vec3 {
    return new vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public sub_(other: ivec3): vec3 {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  public sub(other: ivec3): vec3 {
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

  public dot(other: ivec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  public cross_(other: ivec3): vec3 {
    const x = this.y * other.z - this.z * other.y;
    const y = this.z * other.x - this.x * other.z;
    const z = this.x * other.y - this.y * other.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public cross(other: ivec3): vec3 {
    return new vec3(
        this.y * other.z - this.z * other.y,
        this.z * other.x - this.x * other.z,
        this.x * other.y - this.y * other.x);
  }

  public modulus(): number {
    return GlobalMath.hypot(this.x, this.y, this.z);
  }

  public length(): number {
    return GlobalMath.hypot(this.x, this.y, this.z);
  }

  public squareLength(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public normalize_(): vec3 {
    return this.div_(this.modulus());
  }

  public normalize(): vec3 {
    return this.div(this.modulus());
  }

  public angle(other: ivec3): number {
    const r = this.modulus() * vec3.prototype.modulus.call(other);
    return GlobalMath.acos(this.dot(other) / r);
  }

  public anglen(normal: ivec3): number {
    return GlobalMath.acos(this.dot(normal) / this.modulus());
  }

  public translate2_(x: number, y: number, z: number = 1): vec3 {
    this.x += x * this.z / z;
    this.y += y * this.z / z;
    return this;
  }

  public translate2(x: number, y: number, z: number = 1): vec3 {
    return new vec3(
        this.x + x * this.z / z,
        this.y + y * this.z / z,
        this.z);
  }

  public translate2v_(v: ivec3): vec3 {
    this.x += v.x * this.z / v.z;
    this.y += v.y * this.z / v.z;
    return this;
  }

  public translate2v(v: ivec3): vec3 {
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

  public translate3v_(v: ivec3): vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  public translate3v(v: ivec3): vec3 {
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

  public rotate2c_(a: number, c: ivec3): vec3 {
    return this.rotate2_(a, c.x / c.z, c.y / c.z);
  }

  public rotate2c(a: number, c: ivec3): vec3 {
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

  public rotate3v_(a: number, n: ivec3, c: ivec3): vec3 {
    return this.rotate3_(a, n.x, n.y, n.z, c.x, c.y, c.z);
  }

  public rotate3v(a: number, n: ivec3, c: ivec3): vec3 {
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

  public scale2c_(x: number, y: number, c: ivec3): vec3 {
    return this.scale2_(x, y, c.x / c.z, c.y / c.z);
  }

  public scale2c(x: number, y: number, c: ivec3): vec3 {
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

  public scale3c_(x: number, y: number, z: number, c: ivec3): vec3 {
    return this.scale3_(x, y, z, c.x, c.y, c.z);
  }

  public scale3c(x: number, y: number, z: number, c: ivec3): vec3 {
    return this.clone().scale3_(x, y, z, c.x, c.y, c.z);
  }
}


export class vec4 implements ivec4 {
  public constructor(
      public x: number,
      public y: number,
      public z: number,
      public w: number) {}

  public static zero(): vec4 {
    return new vec4(0, 0, 0, 0);
  }

  public static fromVec2(v: ivec2, z: number, w: number): vec4 {
    return new vec4(v.x, v.y, z, w);
  }

  public static fromVec3(v: ivec3, w: number): vec4 {
    return new vec4(v.x, v.y, v.z, w);
  }

  public toString(): string {
    return `vec4<${this.x}, ${this.y}, ${this.z}, ${this.w}>`;
  }

  public assignVec2(v: ivec2): vec4 {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  public assignVec3(v: ivec3): vec4 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  public assign(v: ivec4): vec4 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
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

  public get xy(): vec2 {
    return new vec2(this.x, this.y);
  }

  public get xz(): vec2 {
    return new vec2(this.x, this.z);
  }

  public get xw(): vec2 {
    return new vec2(this.x, this.w);
  }

  public get yz(): vec2 {
    return new vec2(this.y, this.z);
  }

  public get yw(): vec2 {
    return new vec2(this.y, this.w);
  }

  public get xyz(): vec3 {
    return new vec3(this.x, this.y, this.z);
  }

  public get xyw(): vec3 {
    return new vec3(this.x, this.y, this.w);
  }

  public get xzw(): vec3 {
    return new vec3(this.x, this.z, this.w);
  }

  public get yzw(): vec3 {
    return new vec3(this.y, this.z, this.w);
  }

  public toStandard(): vec3 {
    return this.toVec3().div_(this.w);
  }

  public neg_(): vec4 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  public neg(): vec4 {
    return new vec4(-this.x, -this.y, -this.z, -this.w);
  }

  public add_(other: ivec4): vec4 {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    this.w += other.w;
    return this;
  }

  public add(other: ivec4): vec4 {
    return new vec4(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z,
        this.w + other.w);
  }

  public sub_(other: ivec4): vec4 {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    this.w -= other.w;
    return this;
  }

  public sub(other: ivec4): vec4 {
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

  public dot(other: ivec4): number {
    return this.x * other.x + this.y * other.y + this.z * other.z +
        this.w * other.w;
  }

  public modulus(): number {
    return GlobalMath.hypot(this.x, this.y, this.z, this.w);
  }

  public length(): number {
    return GlobalMath.hypot(this.x, this.y, this.z, this.w);
  }

  public squareLength(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z +
        this.w * this.w;
  }

  public normalize_(): vec4 {
    return this.div_(this.modulus());
  }

  public normalize(): vec4 {
    return this.div(this.modulus());
  }

  public translate_(x: number, y: number, z: number, w: number = 1): vec4 {
    this.x += x * this.w / w;
    this.y += y * this.w / w;
    this.z += z * this.w / w;
    return this;
  }

  public translate(x: number, y: number, z: number, w: number = 1): vec4 {
    return new vec4(
        this.x + x * this.w / w,
        this.y + y * this.w / w,
        this.z + z * this.w / w,
        this.w);
  }

  public translatev_(v: ivec4): vec4 {
    this.x += v.x * this.w / v.w;
    this.y += v.y * this.w / v.w;
    this.z += v.z * this.w / v.w;
    return this;
  }

  public translatev(v: ivec4): vec4 {
    return new vec4(
        this.x + v.x * this.w / v.w,
        this.y + v.y * this.w / v.w,
        this.z + v.z * this.w / v.w,
        this.w);
  }

  public rotate_(
      a: number,
      nx: number, ny: number, nz: number,
      cx: number = 0, cy: number = 0, cz: number = 0): vec4
  {
    const v = this.toStandard().rotate3_(a, nx, ny, nz, cx, cy, cz);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = 1;
    return this;
  }

  public rotate(
      a: number,
      nx: number, ny: number, nz: number,
      cx: number = 0, cy: number = 0, cz: number = 0): vec4
  {
    return this.clone().rotate_(a, nx, ny, nz, cx, cy, cz);
  }

  public rotatev_(a: number, n: ivec4, c: ivec4): vec4 {
    return this.rotate_(
        a,
        n.x / n.w, n.y / n.w, n.z / n.w,
        c.x / c.w, c.y / c.w, c.z / c.w);
  }

  public rotatev(a: number, n: ivec4, c: ivec4): vec4 {
    return this.clone().rotate_(
        a,
        n.x / n.w, n.y / n.w, n.z / n.w,
        c.x / c.w, c.y / c.w, c.z / c.w);
  }

  public scale_(
      x: number, y: number, z: number,
      cx: number = 0, cy: number = 0, cz: number = 0): vec4
  {
    cx *= this.w;
    cy *= this.w;
    cz *= this.w;
    this.x = cx + (this.x - cx) * x;
    this.y = cy + (this.y - cy) * y;
    this.z = cz + (this.z - cz) * z;
    return this;
  }

  public scale(
      x: number, y: number, z: number,
      cx: number = 0, cy: number = 0, cz: number = 0): vec4
  {
    return this.clone().scale_(x, y, z, cx, cy, cz);
  }

  public scalev_(v: ivec4, c: ivec4): vec4 {
    return this.scale_(
        v.x / v.w, v.y / v.w, v.z / v.w,
        c.x / c.w, c.y / c.w, c.z / c.w);
  }

  public scalev(v: ivec4, c: ivec4): vec4 {
    return this.scale(
        v.x / v.w, v.y / v.w, v.z / v.w,
        c.x / c.w, c.y / c.w, c.z / c.w);
  }
}


export class mat2 {
  private _array: [number, number, number, number] | null = null;

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

  public toString(): string {
    return `mat2<${this.toArray().join(', ')}>`;
  }

  public assign(other: mat2): mat2 {
    this.m00 = other.m00;
    this.m01 = other.m01;
    this.m10 = other.m10;
    this.m11 = other.m11;
    return this;
  }

  public clone(): mat2 {
    return new mat2(this.m00, this.m01, this.m10, this.m11);
  }

  public toArray(): [number, number, number, number] {
    if (this._array) {
      this._array[0] = this.m00;
      this._array[1] = this.m01;
      this._array[2] = this.m10;
      this._array[3] = this.m11;
    } else {
      this._array = [this.m00, this.m01, this.m10, this.m11];
    }
    return this._array;
  }

  public determinant(): number {
    return this.m00 * this.m11 - this.m01 * this.m10;
  }

  public invert_(): mat2 {
    const m00 = this.m11;
    const m01 = this.m10;
    const m10 = this.m01;
    const m11 = this.m00;
    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
    return this.divr_(this.determinant());
  }

  public invert(): mat2 {
    return new mat2(
        this.m11, this.m10, this.m01, this.m00).divr_(this.determinant());
  }

  public transpose_(): mat2 {
    const t = this.m01;
    this.m01 = this.m10;
    this.m10 = t;
    return this;
  }

  public transpose(): mat2 {
    return new mat2(this.m00, this.m10, this.m01, this.m11);
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

  public mulv_<tvec2 extends ivec2>(v: tvec2): tvec2 {
    const x = this.m00 * v.x + this.m01 * v.y;
    const y = this.m10 * v.x * this.m11 * v.y;
    v.x = x;
    v.y = y;
    return v;
  }

  public mulv(v: ivec2): vec2 {
    return new vec2(
        this.m00 * v.x + this.m01 * v.y,
        this.m10 * v.x * this.m11 * v.y);
  }

  public divr_(r: number): mat2 {
    this.m00 /= r;
    this.m01 /= r;
    this.m10 /= r;
    this.m11 /= r;
    return this;
  }

  public divr(r: number): mat2 {
    return new mat2(this.m00 / r, this.m01 / r, this.m10 / r, this.m11 / r);
  }
}


export class mat3 {
  private _array: [
      number, number, number,
      number, number, number,
      number, number, number,
  ] | null = null;

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

  public toString(): string {
    return `mat3<${this.toArray().join(', ')}>`;
  }

  public assign(other: mat3): mat3 {
    this.m00 = other.m00;
    this.m01 = other.m01;
    this.m02 = other.m02;
    this.m10 = other.m10;
    this.m11 = other.m11;
    this.m12 = other.m12;
    this.m20 = other.m20;
    this.m21 = other.m21;
    this.m22 = other.m22;
    return this;
  }

  public clone(): mat3 {
    return new mat3(
        this.m00, this.m01, this.m02,
        this.m10, this.m11, this.m12,
        this.m20, this.m21, this.m22);
  }

  public toArray(): [
      number, number, number,
      number, number, number,
      number, number, number,
  ] {
    if (this._array) {
      this._array[0] = this.m00;
      this._array[1] = this.m01;
      this._array[2] = this.m02;
      this._array[3] = this.m10;
      this._array[4] = this.m11;
      this._array[5] = this.m12;
      this._array[6] = this.m20;
      this._array[7] = this.m21;
      this._array[8] = this.m22;
    } else {
      this._array = [
          this.m00, this.m01, this.m02,
          this.m10, this.m11, this.m12,
          this.m20, this.m21, this.m22,
      ];
    }
    return this._array;
  }

  public determinant(): number {
    const m00 = this.m11 * this.m22 - this.m12 * this.m21;
    const m01 = this.m10 * this.m22 - this.m12 * this.m20;
    const m02 = this.m10 * this.m21 - this.m11 * this.m20;
    return m00 - m01 + m02;
  }

  public invert_(): mat3 {
    const m00 = this.m11 * this.m22 - this.m12 * this.m21;
    const m01 = this.m10 * this.m22 - this.m12 * this.m20;
    const m02 = this.m10 * this.m21 - this.m11 * this.m20;
    const m10 = this.m01 * this.m22 - this.m02 * this.m21;
    const m11 = this.m00 * this.m22 - this.m02 * this.m20;
    const m12 = this.m00 * this.m21 - this.m01 * this.m20;
    const m20 = this.m01 * this.m12 - this.m02 * this.m11;
    const m21 = this.m00 * this.m12 - this.m02 * this.m10;
    const m22 = this.m00 * this.m11 - this.m01 * this.m10;
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    return this.divr_(this.determinant());
  }

  public invert(): mat3 {
    return new mat3(
        this.m11 * this.m22 - this.m12 * this.m21,
        this.m10 * this.m22 - this.m12 * this.m20,
        this.m10 * this.m21 - this.m11 * this.m20,
        this.m01 * this.m22 - this.m02 * this.m21,
        this.m00 * this.m22 - this.m02 * this.m20,
        this.m00 * this.m21 - this.m01 * this.m20,
        this.m01 * this.m12 - this.m02 * this.m11,
        this.m00 * this.m12 - this.m02 * this.m10,
        this.m00 * this.m11 - this.m01 * this.m10).divr_(this.determinant());
  }

  public transpose_(): mat3 {
    const m01 = this.m10;
    const m02 = this.m20;
    const m10 = this.m01;
    const m12 = this.m21;
    const m20 = this.m02;
    const m21 = this.m12;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    return this;
  }

  public transpose(): mat3 {
    return new mat3(
        this.m00, this.m10, this.m20,
        this.m01, this.m11, this.m21,
        this.m02, this.m12, this.m22);
  }

  public mul_(other: mat3): mat3 {
    const m00 = this.m00 * other.m00 + this.m01 * other.m10 + this.m02 * other.m20;
    const m01 = this.m00 * other.m01 + this.m01 * other.m11 + this.m02 * other.m21;
    const m02 = this.m00 * other.m02 + this.m01 * other.m12 + this.m02 * other.m22;
    const m10 = this.m10 * other.m00 + this.m11 * other.m10 + this.m12 * other.m20;
    const m11 = this.m10 * other.m01 + this.m11 * other.m11 + this.m12 * other.m21;
    const m12 = this.m10 * other.m02 + this.m11 * other.m12 + this.m12 * other.m22;
    const m20 = this.m20 * other.m00 + this.m21 * other.m10 + this.m22 * other.m20;
    const m21 = this.m20 * other.m01 + this.m21 * other.m11 + this.m22 * other.m21;
    const m22 = this.m20 * other.m02 + this.m21 * other.m12 + this.m22 * other.m22;
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    return this;
  }

  public mul(other: mat3): mat3 {
    return new mat3(
        this.m00 * other.m00 + this.m01 * other.m10 + this.m02 * other.m20,
        this.m00 * other.m01 + this.m01 * other.m11 + this.m02 * other.m21,
        this.m00 * other.m02 + this.m01 * other.m12 + this.m02 * other.m22,
        this.m10 * other.m00 + this.m11 * other.m10 + this.m12 * other.m20,
        this.m10 * other.m01 + this.m11 * other.m11 + this.m12 * other.m21,
        this.m10 * other.m02 + this.m11 * other.m12 + this.m12 * other.m22,
        this.m20 * other.m00 + this.m21 * other.m10 + this.m22 * other.m20,
        this.m20 * other.m01 + this.m21 * other.m11 + this.m22 * other.m21,
        this.m20 * other.m02 + this.m21 * other.m12 + this.m22 * other.m22);
  }

  public mulr_(r: number): mat3 {
    this.m00 *= r;
    this.m01 *= r;
    this.m02 *= r;
    this.m10 *= r;
    this.m11 *= r;
    this.m12 *= r;
    this.m20 *= r;
    this.m21 *= r;
    this.m22 *= r;
    return this;
  }

  public mulr(r: number): mat3 {
    return new mat3(
        this.m00 * r, this.m01 * r, this.m02 * r,
        this.m10 * r, this.m11 * r, this.m12 * r,
        this.m20 * r, this.m21 * r, this.m22 * r);
  }

  public mulv_<tvec3 extends ivec3>(v: tvec3): tvec3 {
    const x = this.m00 * v.x + this.m01 * v.y + this.m02 * v.z;
    const y = this.m10 * v.x * this.m11 * v.y + this.m12 * v.z;
    const z = this.m20 * v.x * this.m21 * v.y + this.m22 * v.z;
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
  }

  public mulv(v: ivec3): vec3 {
    return new vec3(
        this.m00 * v.x + this.m01 * v.y + this.m02 * v.z,
        this.m10 * v.x * this.m11 * v.y + this.m12 * v.z,
        this.m20 * v.x * this.m21 * v.y + this.m22 * v.z);
  }

  public divr_(r: number): mat3 {
    this.m00 /= r;
    this.m01 /= r;
    this.m02 /= r;
    this.m10 /= r;
    this.m11 /= r;
    this.m12 /= r;
    this.m20 /= r;
    this.m21 /= r;
    this.m22 /= r;
    return this;
  }

  public divr(r: number): mat3 {
    return new mat3(
        this.m00 / r, this.m01 / r, this.m02 / r,
        this.m10 / r, this.m11 / r, this.m12 / r,
        this.m20 / r, this.m21 / r, this.m22 / r);
  }
}


export class mat4 {
  private _array: [
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
  ] | null = null;

  public constructor(
      public m00: number,
      public m01: number,
      public m02: number,
      public m03: number,
      public m10: number,
      public m11: number,
      public m12: number,
      public m13: number,
      public m20: number,
      public m21: number,
      public m22: number,
      public m23: number,
      public m30: number,
      public m31: number,
      public m32: number,
      public m33: number) {}

  public toString(): string {
    return `mat4<${this.toArray().join(', ')}>`;
  }

  public assign(other: mat4): mat4 {
    this.m00 = other.m00;
    this.m01 = other.m01;
    this.m02 = other.m02;
    this.m03 = other.m03;
    this.m10 = other.m10;
    this.m11 = other.m11;
    this.m12 = other.m12;
    this.m13 = other.m13;
    this.m20 = other.m20;
    this.m21 = other.m21;
    this.m22 = other.m22;
    this.m23 = other.m23;
    this.m30 = other.m30;
    this.m31 = other.m31;
    this.m32 = other.m32;
    this.m33 = other.m33;
    return this;
  }

  public clone(): mat4 {
    return new mat4(
        this.m00, this.m01, this.m02, this.m03,
        this.m10, this.m11, this.m12, this.m13,
        this.m20, this.m21, this.m22, this.m23,
        this.m30, this.m31, this.m32, this.m33);
  }

  public toArray(): [
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
  ] {
    if (this._array) {
      this._array[0] = this.m00;
      this._array[1] = this.m01;
      this._array[2] = this.m02;
      this._array[3] = this.m03;
      this._array[4] = this.m10;
      this._array[5] = this.m11;
      this._array[6] = this.m12;
      this._array[7] = this.m13;
      this._array[8] = this.m20;
      this._array[9] = this.m21;
      this._array[10] = this.m22;
      this._array[11] = this.m23;
      this._array[12] = this.m30;
      this._array[13] = this.m31;
      this._array[14] = this.m32;
      this._array[15] = this.m33;
    } else {
      this._array = [
          this.m00, this.m01, this.m02, this.m03,
          this.m10, this.m11, this.m12, this.m13,
          this.m20, this.m21, this.m22, this.m23,
          this.m30, this.m31, this.m32, this.m33,
      ];
    }
    return this._array;
  }

  public transpose_(): mat4 {
    const m01 = this.m10;
    const m02 = this.m20;
    const m03 = this.m30;
    const m10 = this.m01;
    const m12 = this.m21;
    const m13 = this.m31;
    const m20 = this.m02;
    const m21 = this.m12;
    const m23 = this.m32;
    const m30 = this.m03;
    const m31 = this.m13;
    const m32 = this.m23;
    this.m01 = m01;
    this.m02 = m02;
    this.m03 = m03;
    this.m10 = m10;
    this.m12 = m12;
    this.m13 = m13;
    this.m20 = m20;
    this.m21 = m21;
    this.m23 = m23;
    this.m30 = m30;
    this.m31 = m31;
    this.m32 = m32;
    return this;
  }

  public transpose(): mat4 {
    return new mat4(
        this.m00, this.m10, this.m20, this.m30,
        this.m01, this.m11, this.m21, this.m31,
        this.m02, this.m12, this.m22, this.m32,
        this.m03, this.m13, this.m23, this.m33);
  }
}


}  // namespace Math
}  // namespace Darblast


type ivec2 = Darblast.Math.ivec2;
type ivec3 = Darblast.Math.ivec3;
type ivec4 = Darblast.Math.ivec4;
type vec2 = Darblast.Math.vec2;
type vec3 = Darblast.Math.vec3;
type vec4 = Darblast.Math.vec4;
type mat2 = Darblast.Math.mat2;
type mat3 = Darblast.Math.mat3;
type mat4 = Darblast.Math.mat4;

const vec2 = Darblast.Math.vec2;
const vec3 = Darblast.Math.vec3;
const vec4 = Darblast.Math.vec4;
const mat2 = Darblast.Math.mat2;
const mat3 = Darblast.Math.mat3;
const mat4 = Darblast.Math.mat4;
