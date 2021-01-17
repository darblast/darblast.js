/// <reference path="../../Math.ts"/>


namespace Darblast {
export namespace GL {
export namespace Shaders {


/**
 * Loads and manages a GLSL shader program.
 *
 * This class can be used in conjunction with {@link ProgramManager}.
 */
export class Program {
  private readonly _gl: WebGLRenderingContext;
  private readonly _attributeNames: string[];
  private readonly _uniformNames: string[];
  private readonly _vertexShader: WebGLShader;
  private readonly _fragmentShader: WebGLShader;
  private readonly _program: WebGLProgram;
  private readonly _locations: {[name: string]: WebGLUniformLocation} =
      Object.create(null);

  /**
   * Creates a GLSL shader program.
   *
   * The constructor compiles and links the provided shader sources, fetches
   * uniform variable locations, binds attribute locations, and throws an
   * exception for any error encountered during the process.
   *
   * @param gl  the WebGL context.
   * @param vertexShaderSource  the GLSL source code of the vertex shader.
   * @param fragmentShaderSource  the GLSL source code of the fragment shader.
   * @param attributeNames  list of names of all attribute variables.
   * @param uniformNames  list of names of all uniform variables.
   */
  public constructor(
      gl: WebGLRenderingContext,
      vertexShaderSource: string,
      fragmentShaderSource: string,
      attributeNames: string[],
      uniformNames?: string[])
  {
    this._gl = gl;
    this._attributeNames = attributeNames ? attributeNames.slice() : [];
    this._uniformNames = uniformNames ? uniformNames.slice() : [];

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      throw new Error('cannot create vertex shader');
    }
    this._vertexShader = vertexShader;
    gl.shaderSource(this._vertexShader, vertexShaderSource);
    gl.compileShader(this._vertexShader);
    if (!gl.getShaderParameter(this._vertexShader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(this._vertexShader) || '');
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      gl.deleteShader(this._vertexShader);
      throw new Error('cannot create fragment shader');
    }
    this._fragmentShader = fragmentShader;
    gl.shaderSource(this._fragmentShader, fragmentShaderSource);
    gl.compileShader(this._fragmentShader);
    if (!gl.getShaderParameter(this._fragmentShader, gl.COMPILE_STATUS)) {
      gl.deleteShader(this._vertexShader);
      throw new Error(gl.getShaderInfoLog(this._fragmentShader) || '');
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(this._vertexShader);
      gl.deleteShader(this._fragmentShader);
      throw new Error('cannot create shader program');
    }
    this._program = program;
    gl.attachShader(this._program, vertexShader);
    gl.attachShader(this._program, fragmentShader);
    for (let i = 0; i < this._attributeNames.length; i++) {
      gl.bindAttribLocation(this._program, i, this._attributeNames[i]);
    }
    gl.linkProgram(this._program);
    if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
      gl.deleteProgram(this._program);
      gl.deleteShader(this._vertexShader);
      gl.deleteShader(this._fragmentShader);
      throw new Error(gl.getProgramInfoLog(this._program) || '');
    }
    gl.validateProgram(this._program);
    if (!gl.getProgramParameter(this._program, gl.VALIDATE_STATUS)) {
      gl.deleteProgram(this._program);
      gl.deleteShader(this._vertexShader);
      gl.deleteShader(this._fragmentShader);
      throw new Error(gl.getProgramInfoLog(this._program) || '');
    }

    for (const name of this._uniformNames) {
      const location = this._gl.getUniformLocation(this._program, name);
      if (location) {
        this._locations[name] = location;
      } else {
        throw new Error(`unknown uniform name ${JSON.stringify(name)}`);
      }
    }
  }

  /**
   * @returns  the native WebGL program object.
   */
  public get nativeProgram(): WebGLProgram {
    return this._program;
  }

  /**
   * @returns  the list of names of attribute variables. Do not modify it.
   */
  public get attributeNames(): string[] {
    return this._attributeNames;
  }

  /**
   * @returns  the list of names of uniform variables. Do not modify it.
   */
  public get uniformNames(): string[] {
    return this._uniformNames;
  }

  /**
   * For internal usage -- do not use.
   *
   * @hidden
   */
  public get _uniformLocations(): {[name: string]: WebGLUniformLocation} {
    return this._locations;
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

  /**
   * [Uses](https://www.khronos.org/registry/OpenGL-Refpages/es3.0/html/glUseProgram.xhtml)
   * the program.
   */
  public use(): void {
    this._gl.useProgram(this._program);
  }

  /**
   * Deletes the program and the associated shaders.
   *
   * If the program is in use it won't be deleted right away, but rather when
   * another one is {@link use | used}.
   *
   * The program becomes unusable after being deleted.
   */
  public destroy(): void {
    this._gl.deleteProgram(this._program);
    this._gl.deleteShader(this._vertexShader);
    this._gl.deleteShader(this._fragmentShader);
  }
}


}  // namespace Shaders
}  // namespace GL
}  // namespace Darblast
