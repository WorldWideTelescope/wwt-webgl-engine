export function shaderKeywords(webGL2) {
    if (webGL2) {
        return {
            versionDeclaration: "#version 300 es",
            fragmentInKeyword: "in",
            fragmentOutKeyword: "out",
            vertexInKeyword: "in",
            vertexOutKeyword: "out",
        };
    } else {
        return {
            versionDeclaration: "",
            fragmentInKeyword: "varying",
            fragmentOutKeyword: "",
            vertexInKeyword: "attribute",
            vertexOutKeyword: "varying",
        };
    }
}

import { WEBGL } from "./webgl_constants.js";

export function createShader(gl, src, type) {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export function createVertexShader(gl, src) {
  return createShader(gl, src, WEBGL.VERTEX_SHADER);
}

export function createFragmentShader(gl, src) {
  return createShader(gl, src, WEBGL.FRAGMENT_SHADER);
}

export function displayShaderCompileError(gl, shader) {
  const status = gl.getShaderParameter(shader, WEBGL.COMPILE_STATUS);
  if (!status) {
    console.error(gl.getShaderInfoLog(shader));
  }
}

export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}

export function displayProgramLinkError(gl, program) {
  const status = gl.getProgramParameter(program, WEBGL.LINK_STATUS);
  if (!status) {
    console.error(gl.getProgramInfoLog(program));
  }
}
