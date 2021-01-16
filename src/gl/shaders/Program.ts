/// <reference path="../../Math.ts"/>


namespace Darblast {
export namespace GL {
export namespace Shaders {


export class Program {
  private readonly _gl: WebGLRenderingContext;
  private readonly _program: WebGLProgram;
  private readonly _locations: {[name: string]: WebGLUniformLocation};

  public constructor(
      gl:WebGLRenderingContext,
      vertexShaderSource: string,
      fragmentShaderSource: string,
      uniformNames: string[],
      attributeNames: string[])
  {
    this._gl = gl;
    this._program = Darblast.GL.Shaders.load(
        this._gl, vertexShaderSource, fragmentShaderSource, attributeNames);
    this._locations = Object.create(null);
    for (const name of uniformNames) {
      const location = this._gl.getUniformLocation(this._program, name);
      if (location) {
        this._locations[name] = location;
      } else {
        throw new Error(`unknown uniform name ${JSON.stringify(name)}`);
      }
    }
  }

  public get nativeProgram(): WebGLProgram {
    return this._program;
  }

  public uniform1f(name: string, x: number): void {
    this._gl.uniform1f(this._locations[name], x);
  }

  public uniform2f(name: string, x: number, y: number): void {
    this._gl.uniform2f(this._locations[name], x, y);
  }

  public uniform3f(name: string, x: number, y: number, z: number): void {
    this._gl.uniform3f(this._locations[name], x, y, z);
  }

  public uniform4f(
      name: string, x: number, y: number, z: number, w: number): void
  {
    this._gl.uniform4f(this._locations[name], x, y, z, w);
  }

  public uniform1i(name: string, x: number): void {
    this._gl.uniform1i(this._locations[name], x);
  }

  public uniform2i(name: string, x: number, y: number): void {
    this._gl.uniform2i(this._locations[name], x, y);
  }

  public uniform3i(name: string, x: number, y: number, z: number): void {
    this._gl.uniform3i(this._locations[name], x, y, z);
  }

  public uniform4i(
      name: string, x: number, y: number, z: number, w: number): void
  {
    this._gl.uniform4i(this._locations[name], x, y, z, w);
  }

  public uniform2fv(name: string, v: vec2): void {
    this._gl.uniform2f(this._locations[name], v.x, v.y);
  }

  public uniform3fv(name: string, v: vec3): void {
    this._gl.uniform3f(this._locations[name], v.x, v.y, v.z);
  }

  public uniform4fv(name: string, v: vec4): void {
    this._gl.uniform4f(this._locations[name], v.x, v.y, v.z, v.w);
  }

  public uniform2iv(name: string, v: vec2): void {
    this._gl.uniform2i(this._locations[name], v.x, v.y);
  }

  public uniform3iv(name: string, v: vec3): void {
    this._gl.uniform3i(this._locations[name], v.x, v.y, v.z);
  }

  public uniform4iv(name: string, v: vec4): void {
    this._gl.uniform4i(this._locations[name], v.x, v.y, v.z, v.w);
  }

  public uniformMatrix2fv(name: string, transpose: boolean, m: mat2): void {
    this._gl.uniformMatrix2fv(this._locations[name], transpose, m.toArray());
  }

  public uniformMatrix3fv(name: string, transpose: boolean, m: mat3): void {
    this._gl.uniformMatrix3fv(this._locations[name], transpose, m.toArray());
  }

  public uniformMatrix4fv(name: string, transpose: boolean, m: mat4): void {
    this._gl.uniformMatrix4fv(this._locations[name], transpose, m.toArray());
  }

  public use(): void {
    this._gl.useProgram(this._program);
  }

  public destroy(): void {
    this._gl.deleteProgram(this._program);
  }
}


}  // namespace Shaders
}  // namespace GL
}  // namespace Darblast
