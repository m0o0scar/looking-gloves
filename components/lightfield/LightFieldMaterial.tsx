import { DataArrayTexture, ShaderMaterial, Uniform, Vector2 } from 'three';

const fragmentShader = `
precision highp float;
precision highp int;
precision highp sampler2DArray;

uniform sampler2DArray field;
uniform vec2 camArraySize;
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

  for (float i = 0.0; i < camArraySize.x; i++) {
    for (float j = 0.0; j < camArraySize.y; j++) {
      float dx = i - (vSt.x * camArraySize.x - 0.5);
      float dy = j - (vSt.y * camArraySize.y - 0.5);
      float sqDist = dx * dx + dy * dy;
      if (sqDist < aperture) {
        float camOff = i + camArraySize.x * j;
        vec2 focOff = vec2(dx, dy) * focus;
        color += texture(field, vec3(vUv + focOff, camOff));
        colorCount++;
      }
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

export const createLightFieldMaterial = (
  texture: DataArrayTexture,
  camsX: number,
  camsY: number
) =>
  new ShaderMaterial({
    uniforms: {
      field: { value: texture },
      camArraySize: new Uniform(new Vector2(camsX, camsY)),
      aperture: { value: 5.0 },
      focus: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
  });
