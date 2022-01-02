/// <reference path="GlobalMath.ts"/>
/// <reference path="Utilities.ts"/>


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

  public *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
  }

  public toString(): string {
    return `vec2<${this.x}, ${this.y}>`;
  }

  public equals(other: ivec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public almostEquals(other: ivec2, e: number): boolean {
    return Utilities.almostEquals(this.x, other.x, e) &&
        Utilities.almostEquals(this.y, other.y, e);
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

  public rotatec_(a: number, c: ivec2): vec2 {
    return this.rotate_(a, c.x, c.y);
  }

  public rotatec(a: number, c: ivec2): vec2 {
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

  public scalec_(x: number, y: number, c: ivec2): vec2 {
    return this.scale_(x, y, c.x, c.y);
  }

  public scalec(x: number, y: number, c: ivec2): vec2 {
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

  public static fromVec2(v: ivec2, z: number = 0): vec3 {
    return new vec3(v.x, v.y, z);
  }

  public static fromVec4(v: ivec4): vec3 {
    return new vec3(v.x, v.y, v.z);
  }

  public *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
  }

  public toString(): string {
    return `vec3<${this.x}, ${this.y}, ${this.z}>`;
  }

  public equals(other: ivec3): boolean {
    return this.x === other.x &&
        this.y === other.y &&
        this.z === other.z;
  }

  public almostEquals(other: ivec3, e: number): boolean {
    return Utilities.almostEquals(this.x, other.x, e) &&
        Utilities.almostEquals(this.y, other.y, e) &&
        Utilities.almostEquals(this.z, other.z, e);
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

  public toStandard_(): vec3 {
    return this.div_(this.z);
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

  public static fromVec2(v: ivec2, z: number = 0, w: number = 1): vec4 {
    return new vec4(v.x, v.y, z, w);
  }

  public static fromVec3(v: ivec3, w: number = 1): vec4 {
    return new vec4(v.x, v.y, v.z, w);
  }

  public *[Symbol.iterator](): Iterator<number> {
    yield this.x;
    yield this.y;
    yield this.z;
    yield this.w;
  }

  public toString(): string {
    return `vec4<${this.x}, ${this.y}, ${this.z}, ${this.w}>`;
  }

  public equals(other: ivec4): boolean {
    return this.x === other.x &&
        this.y === other.y &&
        this.z === other.z &&
        this.w === other.w;
  }

  public almostEquals(other: ivec4, e: number): boolean {
    return Utilities.almostEquals(this.x, other.x, e) &&
        Utilities.almostEquals(this.y, other.y, e) &&
        Utilities.almostEquals(this.z, other.z, e) &&
        Utilities.almostEquals(this.w, other.w, e);
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

  public toStandard_(): vec4 {
    return this.div_(this.w);
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

  public normalize3_(): vec4 {
    const w = this.w;
    const r = GlobalMath.hypot(this.x / w, this.y / w, this.z / w);
    this.x /= r;
    this.y /= r;
    this.z /= r;
    return this;
  }

  public normalize3(): vec4 {
    const w = this.w;
    const r = GlobalMath.hypot(this.x / w, this.y / w, this.z / w);
    return new vec4(this.x / r, this.y / r, this.z / r, this.w);
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
    this.x = v.x * this.w;
    this.y = v.y * this.w;
    this.z = v.z * this.w;
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

  public static fromColumns(
      m00: number, m10: number, m01: number, m11: number): mat2
  {
    return new mat2(m00, m01, m10, m11);
  }

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

  public static scalingv(v: ivec2): mat2 {
    return new mat2(v.x, 0, 0, v.y);
  }

  public toString(): string {
    return `mat2<${this.toArray().join(', ')}>`;
  }

  public equals(other: mat2): boolean {
    return this.m00 === other.m00 &&
        this.m01 === other.m01 &&
        this.m10 === other.m10 &&
        this.m11 === other.m11;
  }

  public almostEquals(other: mat2, e: number): boolean {
    return Utilities.almostEquals(this.m00, other.m00, e) &&
        Utilities.almostEquals(this.m01, other.m01, e) &&
        Utilities.almostEquals(this.m10, other.m10, e) &&
        Utilities.almostEquals(this.m11, other.m11, e);
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

  public toNewArray(): [number, number, number, number] {
    return [this.m00, this.m01, this.m10, this.m11];
  }

  get x(): vec2 {
    return new vec2(this.m00, this.m10);
  }

  get y(): vec2 {
    return new vec2(this.m01, this.m11);
  }

  public map_(
      fn: (x: number, i: number, j: number) => number,
      scope?: any): mat2
  {
    this.m00 = fn.call(scope, this.m00, 0, 0);
    this.m01 = fn.call(scope, this.m01, 0, 1);
    this.m10 = fn.call(scope, this.m10, 1, 0);
    this.m11 = fn.call(scope, this.m11, 1, 1);
    return this;
  }

  public map(
      fn: (x: number, i: number, j: number) => number,
      scope?: any): mat2
  {
    return new mat2(
        fn.call(scope, this.m00, 0, 0),
        fn.call(scope, this.m01, 0, 1),
        fn.call(scope, this.m10, 1, 0),
        fn.call(scope, this.m11, 1, 1));
  }

  public determinant(): number {
    return this.m00 * this.m11 - this.m01 * this.m10;
  }

  public adjugate_(): mat2 {
    const m00 = this.m11;
    const m01 = -this.m10;
    const m10 = -this.m01;
    const m11 = this.m00;
    this.m00 = m00;
    this.m01 = m10;
    this.m10 = m01;
    this.m11 = m11;
    return this;
  }

  public adjugate(): mat2 {
    const m00 = this.m11;
    const m01 = -this.m10;
    const m10 = -this.m01;
    const m11 = this.m00;
    return new mat2(m00, m10, m01, m11);
  }

  public invert_(): mat2 {
    const d = this.determinant();
    const m00 = this.m11 / d;
    const m01 = -this.m10 / d;
    const m10 = -this.m01 / d;
    const m11 = this.m00 / d;
    this.m00 = m00;
    this.m01 = m10;
    this.m10 = m01;
    this.m11 = m11;
    return this;
  }

  public invert(): mat2 {
    const d = this.determinant();
    const m00 = this.m11 / d;
    const m01 = -this.m10 / d;
    const m10 = -this.m01 / d;
    const m11 = this.m00 / d;
    return new mat2(m00, m10, m01, m11);
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

  public neg_(): mat2 {
    this.m00 = -this.m00;
    this.m01 = -this.m01;
    this.m10 = -this.m10;
    this.m11 = -this.m11;
    return this;
  }

  public neg(): mat2 {
    return new mat2(-this.m00, -this.m01, -this.m10, -this.m11);
  }

  public add_(other: mat2): mat2 {
    this.m00 += other.m00;
    this.m01 += other.m01;
    this.m10 += other.m10;
    this.m11 += other.m11;
    return this;
  }

  public add(other: mat2): mat2 {
    return new mat2(
        this.m00 + other.m00,
        this.m01 + other.m01,
        this.m10 + other.m10,
        this.m11 + other.m11);
  }

  public sub_(other: mat2): mat2 {
    this.m00 -= other.m00;
    this.m01 -= other.m01;
    this.m10 -= other.m10;
    this.m11 -= other.m11;
    return this;
  }

  public sub(other: mat2): mat2 {
    return new mat2(
        this.m00 - other.m00,
        this.m01 - other.m01,
        this.m10 - other.m10,
        this.m11 - other.m11);
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

  public static fromColumns(
      m00: number, m10: number, m20: number,
      m01: number, m11: number, m21: number,
      m02: number, m12: number, m22: number): mat3
  {
    return new mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
  }

  public static identity(): mat3 {
    return new mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  public static translation(x: number, y: number): mat3 {
    return new mat3(1, 0, x, 0, 1, y, 0, 0, 1);
  }

  public static translationv(v: ivec2): mat3 {
    return new mat3(1, 0, v.x, 0, 1, v.y, 0, 0, 1);
  }

  public static rotation2(a: number, cx: number = 0, cy: number = 0): mat3 {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    return new mat3(
        cos, -sin, cx - cx * cos + cy * sin,
        sin, cos, cy - cx * sin - cy * cos,
        0, 0, 1);
  }

  public static rotation2v(a: number, c: ivec2): mat3 {
    return mat3.rotation2(a, c.x, c.y);
  }

  public static rotation3x(a: number): mat3 {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    return new mat3(1, 0, 0, 0, cos, -sin, 0, sin, cos);
  }

  public static rotation3y(a: number): mat3 {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    return new mat3(cos, 0, sin, 0, 1, 0, -sin, 0, cos);
  }

  public static rotation3z(a: number): mat3 {
    const sin = GlobalMath.sin(a);
    const cos = GlobalMath.cos(a);
    return new mat3(cos, -sin, 0, sin, cos, 0, 0, 0, 1);
  }

  public static scaling(x: number, y: number, z: number = 1): mat3 {
    return new mat3(x, 0, 0, 0, y, 0, 0, 0, z);
  }

  public static scalingv(v: ivec3): mat3 {
    return new mat3(v.x, 0, 0, 0, v.y, 0, 0, 0, v.z);
  }

  public static scaling2(
      x: number, y: number,
      cx: number = 0, cy: number = 0): mat3
  {
    return new mat3(x, 0, cx - cx * x, 0, y, cy - cy * y, 0, 0, 1);
  }

  public static scaling2v(v: ivec2, c: ivec2): mat3 {
    return new mat3(v.x, 0, c.x - c.x * v.x, 0, v.y, c.y - c.y * v.y, 0, 0, 1);
  }

  public toString(): string {
    return `mat3<${this.toArray().join(', ')}>`;
  }

  public equals(other: mat3): boolean {
    return this.m00 === other.m00 &&
        this.m01 === other.m01 &&
        this.m02 === other.m02 &&
        this.m10 === other.m10 &&
        this.m11 === other.m11 &&
        this.m12 === other.m12 &&
        this.m20 === other.m20 &&
        this.m21 === other.m21 &&
        this.m22 === other.m22;
  }

  public almostEquals(other: mat3, e: number): boolean {
    return Utilities.almostEquals(this.m00, other.m00, e) &&
        Utilities.almostEquals(this.m01, other.m01, e) &&
        Utilities.almostEquals(this.m02, other.m02, e) &&
        Utilities.almostEquals(this.m10, other.m10, e) &&
        Utilities.almostEquals(this.m11, other.m11, e) &&
        Utilities.almostEquals(this.m12, other.m12, e) &&
        Utilities.almostEquals(this.m20, other.m20, e) &&
        Utilities.almostEquals(this.m21, other.m21, e) &&
        Utilities.almostEquals(this.m22, other.m22, e);
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

  public toNewArray(): [
      number, number, number,
      number, number, number,
      number, number, number,
  ] {
    return [
        this.m00, this.m01, this.m02,
        this.m10, this.m11, this.m12,
        this.m20, this.m21, this.m22,
    ];
  }

  get x(): vec3 {
    return new vec3(this.m00, this.m10, this.m20);
  }

  get y(): vec3 {
    return new vec3(this.m01, this.m11, this.m21);
  }

  get z(): vec3 {
    return new vec3(this.m02, this.m12, this.m22);
  }

  public map_(
      fn: (x: number, i: number, j: number) => number,
      scope?: any): mat3
  {
    this.m00 = fn.call(scope, this.m00, 0, 0);
    this.m01 = fn.call(scope, this.m01, 0, 1);
    this.m02 = fn.call(scope, this.m02, 0, 2);
    this.m10 = fn.call(scope, this.m10, 1, 0);
    this.m11 = fn.call(scope, this.m11, 1, 1);
    this.m12 = fn.call(scope, this.m12, 1, 2);
    this.m20 = fn.call(scope, this.m20, 2, 0);
    this.m21 = fn.call(scope, this.m21, 2, 1);
    this.m22 = fn.call(scope, this.m22, 2, 2);
    return this;
  }

  public map(
      fn: (x: number, i: number, j: number) => number,
      scope?: any): mat3
  {
    return new mat3(
        fn.call(scope, this.m00, 0, 0),
        fn.call(scope, this.m01, 0, 1),
        fn.call(scope, this.m02, 0, 2),
        fn.call(scope, this.m10, 1, 0),
        fn.call(scope, this.m11, 1, 1),
        fn.call(scope, this.m12, 1, 2),
        fn.call(scope, this.m20, 2, 0),
        fn.call(scope, this.m21, 2, 1),
        fn.call(scope, this.m22, 2, 2));
  }

  public determinant(): number {
    const m00 = this.m11 * this.m22 - this.m12 * this.m21;
    const m01 = this.m10 * this.m22 - this.m12 * this.m20;
    const m02 = this.m10 * this.m21 - this.m11 * this.m20;
    return this.m00 * m00 - this.m01 * m01 + this.m02 * m02;
  }

  public adjugate_(): mat3 {
    const m00 = this.m11 * this.m22 - this.m12 * this.m21;
    const m01 = this.m12 * this.m20 - this.m10 * this.m22;
    const m02 = this.m10 * this.m21 - this.m11 * this.m20;
    const m10 = this.m02 * this.m21 - this.m01 * this.m22;
    const m11 = this.m00 * this.m22 - this.m02 * this.m20;
    const m12 = this.m01 * this.m20 - this.m00 * this.m21;
    const m20 = this.m01 * this.m12 - this.m02 * this.m11;
    const m21 = this.m02 * this.m10 - this.m00 * this.m12;
    const m22 = this.m00 * this.m11 - this.m01 * this.m10;
    this.m00 = m00;
    this.m01 = m10;
    this.m02 = m20;
    this.m10 = m01;
    this.m11 = m11;
    this.m12 = m21;
    this.m20 = m02;
    this.m21 = m12;
    this.m22 = m22;
    return this;
  }

  public adjugate(): mat3 {
    const m00 = this.m11 * this.m22 - this.m12 * this.m21;
    const m01 = this.m12 * this.m20 - this.m10 * this.m22;
    const m02 = this.m10 * this.m21 - this.m11 * this.m20;
    const m10 = this.m02 * this.m21 - this.m01 * this.m22;
    const m11 = this.m00 * this.m22 - this.m02 * this.m20;
    const m12 = this.m01 * this.m20 - this.m00 * this.m21;
    const m20 = this.m01 * this.m12 - this.m02 * this.m11;
    const m21 = this.m02 * this.m10 - this.m00 * this.m12;
    const m22 = this.m00 * this.m11 - this.m01 * this.m10;
    return new mat3(m00, m10, m20, m01, m11, m21, m02, m12, m22);
  }

  public invert_(): mat3 {
    const d = this.determinant();
    const m00 = (this.m11 * this.m22 - this.m12 * this.m21) / d;
    const m01 = (this.m12 * this.m20 - this.m10 * this.m22) / d;
    const m02 = (this.m10 * this.m21 - this.m11 * this.m20) / d;
    const m10 = (this.m02 * this.m21 - this.m01 * this.m22) / d;
    const m11 = (this.m00 * this.m22 - this.m02 * this.m20) / d;
    const m12 = (this.m01 * this.m20 - this.m00 * this.m21) / d;
    const m20 = (this.m01 * this.m12 - this.m02 * this.m11) / d;
    const m21 = (this.m02 * this.m10 - this.m00 * this.m12) / d;
    const m22 = (this.m00 * this.m11 - this.m01 * this.m10) / d;
    this.m00 = m00;
    this.m01 = m10;
    this.m02 = m20;
    this.m10 = m01;
    this.m11 = m11;
    this.m12 = m21;
    this.m20 = m02;
    this.m21 = m12;
    this.m22 = m22;
    return this;
  }

  public invert(): mat3 {
    const d = this.determinant();
    const m00 = (this.m11 * this.m22 - this.m12 * this.m21) / d;
    const m01 = (this.m12 * this.m20 - this.m10 * this.m22) / d;
    const m02 = (this.m10 * this.m21 - this.m11 * this.m20) / d;
    const m10 = (this.m02 * this.m21 - this.m01 * this.m22) / d;
    const m11 = (this.m00 * this.m22 - this.m02 * this.m20) / d;
    const m12 = (this.m01 * this.m20 - this.m00 * this.m21) / d;
    const m20 = (this.m01 * this.m12 - this.m02 * this.m11) / d;
    const m21 = (this.m02 * this.m10 - this.m00 * this.m12) / d;
    const m22 = (this.m00 * this.m11 - this.m01 * this.m10) / d;
    return new mat3(m00, m10, m20, m01, m11, m21, m02, m12, m22);
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

  public neg_(): mat3 {
    this.m00 = -this.m00;
    this.m01 = -this.m01;
    this.m02 = -this.m02;
    this.m10 = -this.m10;
    this.m11 = -this.m11;
    this.m12 = -this.m12;
    this.m20 = -this.m20;
    this.m21 = -this.m21;
    this.m22 = -this.m22;
    return this;
  }

  public neg(): mat3 {
    return new mat3(
        -this.m00, -this.m01, -this.m02,
        -this.m10, -this.m11, -this.m12,
        -this.m20, -this.m21, -this.m22);
  }

  public add_(other: mat3): mat3 {
    this.m00 += other.m00;
    this.m01 += other.m01;
    this.m02 += other.m02;
    this.m10 += other.m10;
    this.m11 += other.m11;
    this.m12 += other.m12;
    this.m20 += other.m20;
    this.m21 += other.m21;
    this.m22 += other.m22;
    return this;
  }

  public add(other: mat3): mat3 {
    return new mat3(
        this.m00 + other.m00,
        this.m01 + other.m01,
        this.m02 + other.m02,
        this.m10 + other.m10,
        this.m11 + other.m11,
        this.m12 + other.m12,
        this.m20 + other.m20,
        this.m21 + other.m21,
        this.m22 + other.m22);
  }

  public sub_(other: mat3): mat3 {
    this.m00 -= other.m00;
    this.m01 -= other.m01;
    this.m02 -= other.m02;
    this.m10 -= other.m10;
    this.m11 -= other.m11;
    this.m12 -= other.m12;
    this.m20 -= other.m20;
    this.m21 -= other.m21;
    this.m22 -= other.m22;
    return this;
  }

  public sub(other: mat3): mat3 {
    return new mat3(
        this.m00 - other.m00,
        this.m01 - other.m01,
        this.m02 - other.m02,
        this.m10 - other.m10,
        this.m11 - other.m11,
        this.m12 - other.m12,
        this.m20 - other.m20,
        this.m21 - other.m21,
        this.m22 - other.m22);
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

  public static fromColumns(
      m00: number, m10: number, m20: number, m30: number,
      m01: number, m11: number, m21: number, m31: number,
      m02: number, m12: number, m22: number, m32: number,
      m03: number, m13: number, m23: number, m33: number): mat4
  {
    return new mat4(
        m00, m01, m02, m03,
        m10, m11, m12, m13,
        m20, m21, m22, m23,
        m30, m31, m32, m33);
  }

  public static identity(): mat4 {
    return new mat4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1);
  }

  public static translation(x: number, y: number, z: number): mat4 {
    return new mat4(
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1);
  }

  public static translationv(v: ivec3): mat4 {
    return new mat4(
        1, 0, 0, v.x,
        0, 1, 0, v.y,
        0, 0, 1, v.z,
        0, 0, 0, 1);
  }

  public static scaling(x: number, y: number, z: number): mat4 {
    return new mat4(
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1);
  }

  public static scalingv(v: ivec3): mat4 {
    return new mat4(
        v.x, 0, 0, 0,
        0, v.y, 0, 0,
        0, 0, v.z, 0,
        0, 0, 0, 1);
  }

  public toString(): string {
    return `mat4<${this.toArray().join(', ')}>`;
  }

  public equals(other: mat4): boolean {
    return this.m00 === other.m00 &&
        this.m01 === other.m01 &&
        this.m02 === other.m02 &&
        this.m03 === other.m03 &&
        this.m10 === other.m10 &&
        this.m11 === other.m11 &&
        this.m12 === other.m12 &&
        this.m13 === other.m13 &&
        this.m20 === other.m20 &&
        this.m21 === other.m21 &&
        this.m22 === other.m22 &&
        this.m23 === other.m23 &&
        this.m30 === other.m30 &&
        this.m31 === other.m31 &&
        this.m32 === other.m32 &&
        this.m33 === other.m33;
  }

  public almostEquals(other: mat4, e: number): boolean {
    return Utilities.almostEquals(this.m00, other.m00, e) &&
        Utilities.almostEquals(this.m01, other.m01, e) &&
        Utilities.almostEquals(this.m02, other.m02, e) &&
        Utilities.almostEquals(this.m03, other.m03, e) &&
        Utilities.almostEquals(this.m10, other.m10, e) &&
        Utilities.almostEquals(this.m11, other.m11, e) &&
        Utilities.almostEquals(this.m12, other.m12, e) &&
        Utilities.almostEquals(this.m13, other.m13, e) &&
        Utilities.almostEquals(this.m20, other.m20, e) &&
        Utilities.almostEquals(this.m21, other.m21, e) &&
        Utilities.almostEquals(this.m22, other.m22, e) &&
        Utilities.almostEquals(this.m23, other.m23, e) &&
        Utilities.almostEquals(this.m30, other.m30, e) &&
        Utilities.almostEquals(this.m31, other.m31, e) &&
        Utilities.almostEquals(this.m32, other.m32, e) &&
        Utilities.almostEquals(this.m33, other.m33, e);
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

  public toNewArray(): [
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
  ] {
    return [
        this.m00, this.m01, this.m02, this.m03,
        this.m10, this.m11, this.m12, this.m13,
        this.m20, this.m21, this.m22, this.m23,
        this.m30, this.m31, this.m32, this.m33,
    ];
  }

  get x(): vec4 {
    return new vec4(this.m00, this.m10, this.m20, this.m30);
  }

  get y(): vec4 {
    return new vec4(this.m01, this.m11, this.m21, this.m31);
  }

  get z(): vec4 {
    return new vec4(this.m02, this.m12, this.m22, this.m32);
  }

  get w(): vec4 {
    return new vec4(this.m03, this.m13, this.m23, this.m33);
  }

  public map_(
      fn: (x: number, i: number, j: number) => number,
      scope?: any): mat4
  {
    this.m00 = fn.call(scope, this.m00, 0, 0);
    this.m01 = fn.call(scope, this.m01, 0, 1);
    this.m02 = fn.call(scope, this.m02, 0, 2);
    this.m03 = fn.call(scope, this.m03, 0, 3);
    this.m10 = fn.call(scope, this.m10, 1, 0);
    this.m11 = fn.call(scope, this.m11, 1, 1);
    this.m12 = fn.call(scope, this.m12, 1, 2);
    this.m13 = fn.call(scope, this.m13, 1, 3);
    this.m20 = fn.call(scope, this.m20, 2, 0);
    this.m21 = fn.call(scope, this.m21, 2, 1);
    this.m22 = fn.call(scope, this.m22, 2, 2);
    this.m23 = fn.call(scope, this.m23, 2, 3);
    this.m30 = fn.call(scope, this.m30, 3, 0);
    this.m31 = fn.call(scope, this.m31, 3, 1);
    this.m32 = fn.call(scope, this.m32, 3, 2);
    this.m33 = fn.call(scope, this.m33, 3, 3);
    return this;
  }

  public map(
      fn: (x: number, i: number, j: number) => number,
      scope?: any): mat4
  {
    return new mat4(
        fn.call(scope, this.m00, 0, 0),
        fn.call(scope, this.m01, 0, 1),
        fn.call(scope, this.m02, 0, 2),
        fn.call(scope, this.m03, 0, 3),
        fn.call(scope, this.m10, 1, 0),
        fn.call(scope, this.m11, 1, 1),
        fn.call(scope, this.m12, 1, 2),
        fn.call(scope, this.m13, 1, 3),
        fn.call(scope, this.m20, 2, 0),
        fn.call(scope, this.m21, 2, 1),
        fn.call(scope, this.m22, 2, 2),
        fn.call(scope, this.m23, 2, 3),
        fn.call(scope, this.m30, 3, 0),
        fn.call(scope, this.m31, 3, 1),
        fn.call(scope, this.m32, 3, 2),
        fn.call(scope, this.m33, 3, 3));
  }

  public determinant(): number {
    const n01 = this.m20 * this.m31 - this.m21 * this.m30;
    const n02 = this.m20 * this.m32 - this.m22 * this.m30;
    const n03 = this.m20 * this.m33 - this.m23 * this.m30;
    const n10 = this.m21 * this.m30 - this.m20 * this.m31;
    const n12 = this.m21 * this.m32 - this.m22 * this.m31;
    const n13 = this.m21 * this.m33 - this.m23 * this.m31;
    const n20 = this.m22 * this.m30 - this.m20 * this.m32;
    const n21 = this.m22 * this.m31 - this.m21 * this.m32;
    const n23 = this.m22 * this.m33 - this.m23 * this.m32;
    const m00 = this.m11 * n23 - this.m12 * n13 + this.m13 * n12;
    const m01 = this.m10 * n23 - this.m12 * n03 + this.m13 * n02;
    const m02 = this.m10 * n13 - this.m11 * n03 + this.m13 * n01;
    const m03 = this.m10 * n12 - this.m11 * n02 + this.m12 * n01;
    return this.m00 * m00 - this.m01 * m01 + this.m02 * m02 - this.m03 * m03;
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

  public neg_(): mat4 {
    this.m00 = -this.m00;
    this.m01 = -this.m01;
    this.m02 = -this.m02;
    this.m03 = -this.m03;
    this.m10 = -this.m10;
    this.m11 = -this.m11;
    this.m12 = -this.m12;
    this.m13 = -this.m13;
    this.m20 = -this.m20;
    this.m21 = -this.m21;
    this.m22 = -this.m22;
    this.m23 = -this.m23;
    this.m30 = -this.m30;
    this.m31 = -this.m31;
    this.m32 = -this.m32;
    this.m33 = -this.m33;
    return this;
  }

  public neg(): mat4 {
    return new mat4(
        -this.m00, -this.m10, -this.m20, -this.m30,
        -this.m01, -this.m11, -this.m21, -this.m31,
        -this.m02, -this.m12, -this.m22, -this.m32,
        -this.m03, -this.m13, -this.m23, -this.m33);
  }

  public add_(other: mat4): mat4 {
    this.m00 += other.m00;
    this.m01 += other.m01;
    this.m02 += other.m02;
    this.m03 += other.m03;
    this.m10 += other.m10;
    this.m11 += other.m11;
    this.m12 += other.m12;
    this.m13 += other.m13;
    this.m20 += other.m20;
    this.m21 += other.m21;
    this.m22 += other.m22;
    this.m23 += other.m23;
    this.m30 += other.m30;
    this.m31 += other.m31;
    this.m32 += other.m32;
    this.m33 += other.m33;
    return this;
  }

  public add(other: mat4): mat4 {
    return new mat4(
        this.m00 + other.m00, this.m01 + other.m01, this.m02 + other.m02, this.m03 + other.m03,
        this.m10 + other.m10, this.m11 + other.m11, this.m12 + other.m12, this.m13 + other.m13,
        this.m20 + other.m20, this.m21 + other.m21, this.m22 + other.m22, this.m23 + other.m23,
        this.m30 + other.m30, this.m31 + other.m31, this.m32 + other.m32, this.m33 + other.m33);
  }

  public sub_(other: mat4): mat4 {
    this.m00 -= other.m00;
    this.m01 -= other.m01;
    this.m02 -= other.m02;
    this.m03 -= other.m03;
    this.m10 -= other.m10;
    this.m11 -= other.m11;
    this.m12 -= other.m12;
    this.m13 -= other.m13;
    this.m20 -= other.m20;
    this.m21 -= other.m21;
    this.m22 -= other.m22;
    this.m23 -= other.m23;
    this.m30 -= other.m30;
    this.m31 -= other.m31;
    this.m32 -= other.m32;
    this.m33 -= other.m33;
    return this;
  }

  public sub(other: mat4): mat4 {
    return new mat4(
        this.m00 - other.m00, this.m01 - other.m01, this.m02 - other.m02, this.m03 - other.m03,
        this.m10 - other.m10, this.m11 - other.m11, this.m12 - other.m12, this.m13 - other.m13,
        this.m20 - other.m20, this.m21 - other.m21, this.m22 - other.m22, this.m23 - other.m23,
        this.m30 - other.m30, this.m31 - other.m31, this.m32 - other.m32, this.m33 - other.m33);
  }

  public mul_(other: mat4): mat4 {
    const m00 = this.m00 * other.m00 + this.m01 * other.m10 + this.m02 * other.m20 + this.m03 * other.m30;
    const m01 = this.m00 * other.m01 + this.m01 * other.m11 + this.m02 * other.m21 + this.m03 * other.m31;
    const m02 = this.m00 * other.m02 + this.m01 * other.m12 + this.m02 * other.m22 + this.m03 * other.m32;
    const m03 = this.m00 * other.m03 + this.m01 * other.m13 + this.m02 * other.m23 + this.m03 * other.m33;
    const m10 = this.m10 * other.m00 + this.m11 * other.m10 + this.m12 * other.m20 + this.m13 * other.m30;
    const m11 = this.m10 * other.m01 + this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31;
    const m12 = this.m10 * other.m02 + this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32;
    const m13 = this.m10 * other.m03 + this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33;
    const m20 = this.m20 * other.m00 + this.m21 * other.m10 + this.m22 * other.m20 + this.m23 * other.m30;
    const m21 = this.m20 * other.m01 + this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31;
    const m22 = this.m20 * other.m02 + this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32;
    const m23 = this.m20 * other.m03 + this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33;
    const m30 = this.m30 * other.m00 + this.m31 * other.m10 + this.m32 * other.m20 + this.m33 * other.m30;
    const m31 = this.m30 * other.m01 + this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31;
    const m32 = this.m30 * other.m02 + this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32;
    const m33 = this.m30 * other.m03 + this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33;
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m03 = m03;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    this.m23 = m23;
    this.m30 = m30;
    this.m31 = m31;
    this.m32 = m32;
    this.m33 = m33;
    return this;
  }

  public mul(other: mat4): mat4 {
    return new mat4(
        this.m00 * other.m00 + this.m01 * other.m10 + this.m02 * other.m20 + this.m03 * other.m30,
        this.m00 * other.m01 + this.m01 * other.m11 + this.m02 * other.m21 + this.m03 * other.m31,
        this.m00 * other.m02 + this.m01 * other.m12 + this.m02 * other.m22 + this.m03 * other.m32,
        this.m00 * other.m03 + this.m01 * other.m13 + this.m02 * other.m23 + this.m03 * other.m33,
        this.m10 * other.m00 + this.m11 * other.m10 + this.m12 * other.m20 + this.m13 * other.m30,
        this.m10 * other.m01 + this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31,
        this.m10 * other.m02 + this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32,
        this.m10 * other.m03 + this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33,
        this.m20 * other.m00 + this.m21 * other.m10 + this.m22 * other.m20 + this.m23 * other.m30,
        this.m20 * other.m01 + this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31,
        this.m20 * other.m02 + this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32,
        this.m20 * other.m03 + this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33,
        this.m30 * other.m00 + this.m31 * other.m10 + this.m32 * other.m20 + this.m33 * other.m30,
        this.m30 * other.m01 + this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31,
        this.m30 * other.m02 + this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32,
        this.m30 * other.m03 + this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33);
  }

  public mulr_(r: number): mat4 {
    this.m00 *= r;
    this.m01 *= r;
    this.m02 *= r;
    this.m03 *= r;
    this.m10 *= r;
    this.m11 *= r;
    this.m12 *= r;
    this.m13 *= r;
    this.m20 *= r;
    this.m21 *= r;
    this.m22 *= r;
    this.m23 *= r;
    this.m30 *= r;
    this.m31 *= r;
    this.m32 *= r;
    this.m33 *= r;
    return this;
  }

  public mulr(r: number): mat4 {
    return new mat4(
        this.m00 * r, this.m01 * r, this.m02 * r, this.m03 * r,
        this.m10 * r, this.m11 * r, this.m12 * r, this.m13 * r,
        this.m20 * r, this.m21 * r, this.m22 * r, this.m23 * r,
        this.m30 * r, this.m31 * r, this.m32 * r, this.m33 * r);
  }

  public mulv_<tvec4 extends ivec4>(v: tvec4): tvec4 {
    const x = this.m00 * v.x + this.m01 * v.y + this.m02 * v.z + this.m03 * v.w;
    const y = this.m10 * v.x * this.m11 * v.y + this.m12 * v.z + this.m13 * v.w;
    const z = this.m20 * v.x * this.m21 * v.y + this.m22 * v.z + this.m23 * v.w;
    const w = this.m30 * v.x * this.m31 * v.y + this.m32 * v.z + this.m33 * v.w;
    v.x = x;
    v.y = y;
    v.z = z;
    v.w = w;
    return v;
  }

  public mulv(v: ivec4): vec4 {
    return new vec4(
        this.m00 * v.x + this.m01 * v.y + this.m02 * v.z + this.m03 * v.w,
        this.m10 * v.x * this.m11 * v.y + this.m12 * v.z + this.m13 * v.w,
        this.m20 * v.x * this.m21 * v.y + this.m22 * v.z + this.m23 * v.w,
        this.m30 * v.x * this.m31 * v.y + this.m32 * v.z + this.m33 * v.w);
  }

  public divr_(r: number): mat4 {
    this.m00 /= r;
    this.m01 /= r;
    this.m02 /= r;
    this.m03 /= r;
    this.m10 /= r;
    this.m11 /= r;
    this.m12 /= r;
    this.m13 /= r;
    this.m20 /= r;
    this.m21 /= r;
    this.m22 /= r;
    this.m23 /= r;
    this.m30 /= r;
    this.m31 /= r;
    this.m32 /= r;
    this.m33 /= r;
    return this;
  }

  public divr(r: number): mat4 {
    return new mat4(
        this.m00 / r, this.m01 / r, this.m02 / r, this.m03 / r,
        this.m10 / r, this.m11 / r, this.m12 / r, this.m13 / r,
        this.m20 / r, this.m21 / r, this.m22 / r, this.m23 / r,
        this.m30 / r, this.m31 / r, this.m32 / r, this.m33 / r);
  }
}


}  // namespace Math
}  // namespace Darblast


/**
 * @hidden
 */
type ivec2 = Darblast.Math.ivec2;

/**
 * @hidden
 */
type ivec3 = Darblast.Math.ivec3;

/**
 * @hidden
 */
type ivec4 = Darblast.Math.ivec4;

/**
 * @hidden
 */
type vec2 = Darblast.Math.vec2;

/**
 * @hidden
 */
type vec3 = Darblast.Math.vec3;

/**
 * @hidden
 */
type vec4 = Darblast.Math.vec4;

/**
 * @hidden
 */
type mat2 = Darblast.Math.mat2;

/**
 * @hidden
 */
type mat3 = Darblast.Math.mat3;

/**
 * @hidden
 */
type mat4 = Darblast.Math.mat4;

/**
 * @hidden
 */
const vec2 = Darblast.Math.vec2;

/**
 * @hidden
 */
const vec3 = Darblast.Math.vec3;

/**
 * @hidden
 */
const vec4 = Darblast.Math.vec4;

/**
 * @hidden
 */
const mat2 = Darblast.Math.mat2;

/**
 * @hidden
 */
const mat3 = Darblast.Math.mat3;

/**
 * @hidden
 */
const mat4 = Darblast.Math.mat4;
