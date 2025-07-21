// Pixelated flowing waves background for .home-hero

const canvas = document.getElementById('hero-bg-canvas');
if (!canvas) return;

// Resize canvas to fill parent
function resizeCanvas() {
  const parent = canvas.parentElement;
  if (!parent) return;
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const gl = canvas.getContext('webgl');
if (!gl) {
  console.error('WebGL not supported');
}

// Vertex shader (simple passthrough)
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0, 1);
  }
`;

// Fragment shader (pixelated flowing waves)
// Colors sampled from a soft blue/gray background
const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Palette: background color and two accent waves
  vec3 bg = vec3(0.95, 0.97, 1.0); // very light blue
  vec3 wave1 = vec3(0.85, 0.90, 0.98); // soft blue
  vec3 wave2 = vec3(0.80, 0.88, 0.96); // slightly deeper blue

  void main() {
    // Pixelation
    float pixelSize = 6.0 / u_resolution.y; // 6px at 1080p
    vec2 uv = floor(v_uv / pixelSize) * pixelSize;

    // Flowing wave patterns
    float wave = sin(uv.x * 8.0 + u_time * 0.7) * 0.04
               + sin(uv.x * 3.0 - u_time * 0.4) * 0.03;
    float y = uv.y + wave;

    // Blend between background and waves
    float mask1 = smoothstep(0.40, 0.43, y);
    float mask2 = smoothstep(0.55, 0.58, y);
    vec3 color = bg;
    color = mix(color, wave1, mask1 * 0.5);
    color = mix(color, wave2, mask2 * 0.4);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Set up geometry (full screen quad)
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]),
  gl.STATIC_DRAW
);
const positionLoc = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

// Uniform locations
const timeLoc = gl.getUniformLocation(program, 'u_time');
const resLoc = gl.getUniformLocation(program, 'u_resolution');

function render(time) {
  resizeCanvas();
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(timeLoc, time * 0.001);
  gl.uniform2f(resLoc, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}

requestAnimationFrame(render); 