/// <reference path="shaders/Program.ts"/>

namespace Darblast {
export namespace GL {


/**
 * Manages multiple {@link Shaders.Program | shader programs} and switching
 * between them.
 *
 * The main purpose of this class is to manage [`enableVertexAttribArray` and
 * `disableVertexAttribArray`](https://www.khronos.org/registry/OpenGL-Refpages/es3.0/html/glEnableVertexAttribArray.xhtml)
 * calls automatically.
 */
export class ProgramManager {
  private readonly _gl: WebGLRenderingContext;

  private readonly _programs: {[name: string]: Shaders.Program} =
      Object.create(null);
  private readonly _sequence: string[] = [];

  private _activeCount: number = 1;
  private _uniformLocations: {[name: string]: WebGLUniformLocation} | null =
      null;

  public constructor(gl: WebGLRenderingContext) {
    this._gl = gl;
    this._gl.enableVertexAttribArray(0);
  }

  /**
   * Adds the given {@link Shaders.Program | Program}.
   *
   * Programs are indexed by name in the manager.
   *
   * @param name  name associated to the program. must be unique within the
   *   manager.
   * @chainable
   */
  public addProgram(name: string, program: Shaders.Program): ProgramManager {
    if (name in this._programs) {
      throw new Error(`program ${JSON.stringify(name)} already exists`);
    }
    this._programs[name] = program;
    this._sequence.push(name);
    return this;
  }

  /**
   * Constructs a new {@link Shaders.Program | Program} and
   * {@link addProgram | adds} it to the manager.
   *
   * See the {@link Shaders.Program} constructor for more information about the
   * parameters.
   *
   * @param name  name associated to the program. must be unique within the
   *   manager.
   * @param vertexShaderSource  GLSL code for the vertex shader.
   * @param fragmentShaderSource  GLSL code for the fragment shader.
   * @param attributeNames  array of names of the attribute variables.
   * @param uniformNames  array of names of the uniform variables.
   * @chainable
   */
  public loadProgram(
      name: string,
      vertexShaderSource: string,
      fragmentShaderSource: string,
      attributeNames: string[],
      uniformNames?: string[]): ProgramManager
  {
    if (name in this._programs) {
      throw new Error(`program ${JSON.stringify(name)} already exists`);
    }
    const program = new Shaders.Program(
        this._gl, vertexShaderSource, fragmentShaderSource, attributeNames,
        uniformNames);
    try {
      return this.addProgram(name, program);
    } catch (e) {
      // defensive coding: we've already checked for preconditions at the
      // beginning of this method, but we want to catch exceptions in case more
      // are added in the future.
      program.destroy();
      throw e;
    }
  }

  /**
   * Uses the program identified by the given name (as per
   * {@link Shaders.Program.use | Program.use}) and enables all of its vertex
   * attrib arrays so that a user doesn't have to issue manual
   * [`enableVertexAttribArray` or
   * `disableVertexAttribArray`](https://www.khronos.org/registry/OpenGL-Refpages/es3.0/html/glEnableVertexAttribArray.xhtml)
   * calls.
   *
   * @param name  name of the program to switch to.
   */
  public use(name: string): void {
    const program = this._programs[name];
    program.use();
    const attributeCount = program.attributeNames.length;
    for (let i = this._activeCount - 1; i >= attributeCount; i--) {
      this._gl.disableVertexAttribArray(i);
    }
    for (let i = this._activeCount; i < attributeCount; i++) {
      this._gl.enableVertexAttribArray(i);
    }
    this._activeCount = attributeCount;
    this._uniformLocations = program._uniformLocations;
  }

  public uniform1f(name: string, x: number): void {
    this._gl.uniform1f(this._uniformLocations![name], x);
  }

  public uniform2f(name: string, x: number, y: number): void {
    this._gl.uniform2f(this._uniformLocations![name], x, y);
  }

  public uniform3f(name: string, x: number, y: number, z: number): void {
    this._gl.uniform3f(this._uniformLocations![name], x, y, z);
  }

  public uniform4f(
      name: string, x: number, y: number, z: number, w: number): void
  {
    this._gl.uniform4f(this._uniformLocations![name], x, y, z, w);
  }

  public uniform1i(name: string, x: number): void {
    this._gl.uniform1i(this._uniformLocations![name], x);
  }

  public uniform2i(name: string, x: number, y: number): void {
    this._gl.uniform2i(this._uniformLocations![name], x, y);
  }

  public uniform3i(name: string, x: number, y: number, z: number): void {
    this._gl.uniform3i(this._uniformLocations![name], x, y, z);
  }

  public uniform4i(
      name: string, x: number, y: number, z: number, w: number): void
  {
    this._gl.uniform4i(this._uniformLocations![name], x, y, z, w);
  }

  public uniform2fv(name: string, v: vec2): void {
    this._gl.uniform2f(this._uniformLocations![name], v.x, v.y);
  }

  public uniform3fv(name: string, v: vec3): void {
    this._gl.uniform3f(this._uniformLocations![name], v.x, v.y, v.z);
  }

  public uniform4fv(name: string, v: vec4): void {
    this._gl.uniform4f(this._uniformLocations![name], v.x, v.y, v.z, v.w);
  }

  public uniform2iv(name: string, v: vec2): void {
    this._gl.uniform2i(this._uniformLocations![name], v.x, v.y);
  }

  public uniform3iv(name: string, v: vec3): void {
    this._gl.uniform3i(this._uniformLocations![name], v.x, v.y, v.z);
  }

  public uniform4iv(name: string, v: vec4): void {
    this._gl.uniform4i(this._uniformLocations![name], v.x, v.y, v.z, v.w);
  }

  public uniformMatrix2fv(name: string, transpose: boolean, m: mat2): void {
    this._gl.uniformMatrix2fv(
        this._uniformLocations![name], transpose, m.toArray());
  }

  public uniformMatrix3fv(name: string, transpose: boolean, m: mat3): void {
    this._gl.uniformMatrix3fv(
        this._uniformLocations![name], transpose, m.toArray());
  }

  public uniformMatrix4fv(name: string, transpose: boolean, m: mat4): void {
    this._gl.uniformMatrix4fv(
        this._uniformLocations![name], transpose, m.toArray());
  }

  /**
   * Destroys all managed programs using
   * {@link Shaders.Program.destroy | Program.destroy}.
   *
   * The programs and the manager become effectively unusable after this call.
   */
  public destroy(): void {
    for (let name in this._programs) {
      this._programs[name].destroy();
    }
  }
}


}  // namespace GL
}  // namespace Darblast
