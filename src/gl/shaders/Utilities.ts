namespace Darblast {
export namespace GL {
export namespace Shaders {


export function load(
    gl: WebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    attributes?: string[]): WebGLProgram
{
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) {
    throw new Error('cannot create vertex shader');
  }
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader) || '');
  }
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) {
    throw new Error('cannot create fragment shader');
  }
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader) || '');
  }
  const program = gl.createProgram();
  if (!program) {
    throw new Error('cannot create shader program');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  if (attributes) {
    for (let i = 0; i < attributes.length; i++) {
      gl.bindAttribLocation(program, i, attributes[i]);
    }
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || '');
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || '');
  }
  return program;
}


}  // namespace Shaders
}  // namespace GL
}  // namespace Darblast
