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
   * @param uniformNames  array of names of the uniform variables.
   * @param attributeNames  array of names of the attribute variables.
   * @chainable
   */
  public loadProgram(
      name: string,
      vertexShaderSource: string,
      fragmentShaderSource: string,
      uniformNames: string[],
      attributeNames: string[]): ProgramManager
  {
    if (name in this._programs) {
      throw new Error(`program ${JSON.stringify(name)} already exists`);
    }
    const program = new Shaders.Program(
        this._gl, vertexShaderSource, fragmentShaderSource, uniformNames,
        attributeNames);
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
  public switchTo(name: string): void {
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
  }
}


}  // namespace GL
}  // namespace Darblast
