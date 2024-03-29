import { DataArrayTexture, ShaderMaterial } from 'three';

// WebGL2 Light field renderer
// forked and modified from https://github.com/hypothete/lightfield-webgl2

const fragmentShader = `
precision highp float;
precision highp int;
precision highp sampler2DArray;

uniform sampler2DArray field;
uniform float numberOfFrames;
uniform float aperture;
uniform float focus;

in vec2 vSt;
in vec2 vUv;

void main() {
  vec4 color = vec4(0.0);
  float colorCount = 0.0; // proportional exposure

  if (vUv.x < 0.0 || vUv.x > 1.0 || vUv.y < 0.0 || vUv.y > 1.0) {
    discard;
  }

  for (float i = 0.0; i < numberOfFrames; i++) {
    float dx = 0.5 - vSt.x * numberOfFrames + i;
    float dy = 0.5 - vSt.y;
    float sqDist = dx * dx + dy * dy;
    if (sqDist < aperture) {
      vec2 focOff = vec2(dx, dy) * focus;
      color += texture(field, vec3(vUv + focOff, i));
      colorCount++;
    }
  }

  gl_FragColor = vec4(color.rgb / colorCount, 1.0);
}
`;

const vertexShader = `
out vec2 vSt;
out vec2 vUv;

void main() {
  vec3 posToCam = cameraPosition - position;
  vec3 nDir = normalize(posToCam);
  // given similar triangles we can project the focusing plane point
  float zRatio = posToCam.z / nDir.z;
  vec3 uvPoint = zRatio * nDir;
  // offset the uv into 0-1.0 coords
  vUv = uvPoint.xy + 0.5;
  vUv.x = 1.0 - vUv.x;
  vSt = uv;
  vSt.x = 1.0 - vSt.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

export const material = new ShaderMaterial({
  uniforms: {
    field: { value: undefined },
    numberOfFrames: { value: 0 },
    aperture: { value: 5.0 },
    focus: { value: 0.0 },
  },
  vertexShader,
  fragmentShader,
});

export const setTexture = (texture: DataArrayTexture, numberOfFrames: number) => {
  material.uniforms.field.value = texture;
  material.uniforms.numberOfFrames.value = numberOfFrames;
  texture.needsUpdate = true;
};

export const setTextureFocus = (focus: number) => {
  material.uniforms.focus.value = focus;
};

export const disposeTexture = () => {
  material.uniforms.field.value?.dispose();
  material.uniforms.field.value = undefined;
};
