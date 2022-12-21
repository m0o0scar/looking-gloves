import { Canvas } from '@react-three/fiber';
import { FC, useState, useEffect, useRef } from 'react';
import { DataArrayTexture, ShaderMaterial } from 'three';

import { createLightFieldMaterial } from './LightFieldMaterial';

export interface LightFieldFocusEditorProps {
  frames?: HTMLCanvasElement[];
  onFocusConfirm?: (focus: number) => void;
}

export const LightFieldFocusEditor: FC<LightFieldFocusEditorProps> = ({
  frames,
  onFocusConfirm,
}) => {
  const [focus, setFocus] = useState(0);

  const [lightFieldMaterial, setLightFieldMaterial] = useState<ShaderMaterial>();

  useEffect(() => {
    if (frames?.length) {
      const numberOfFrames = frames.length;
      const frameWidth = frames[0].width;
      const frameHeight = frames[0].height;

      let offset = 0;
      const data = new Uint8Array(frameWidth * frameHeight * 4 * numberOfFrames);
      for (const frame of [...frames].reverse()) {
        const imgData = frame.getContext('2d')!.getImageData(0, 0, frameWidth, frameHeight);
        data.set(imgData.data, offset);
        offset += imgData.data.byteLength;
      }

      const texture = new DataArrayTexture(data, frameWidth, frameHeight, numberOfFrames);
      texture.needsUpdate = true;

      const material = createLightFieldMaterial(texture, numberOfFrames);
      setLightFieldMaterial(material);
    }
  }, [frames]);

  useEffect(() => {
    if (lightFieldMaterial) {
      lightFieldMaterial.uniforms.focus.value = focus;
    }
  }, [focus, lightFieldMaterial]);

  if (!frames?.length) return null;

  const fov = 75;
  const planeSize = 1;
  const cameraZ = planeSize / (2 * Math.tan((fov * Math.PI) / 360));
  const canvasSize = 600;

  return (
    <div className="flex flex-col items-center gap-4 max-w-full">
      <h2>Adjust light field focus</h2>
      <p>Drag the slider below to focus on your target</p>

      <Canvas
        flat
        linear
        camera={{ position: [0, 0, cameraZ] }}
        className="rounded-lg max-w-full aspect-square"
        style={{ width: canvasSize }}
      >
        <mesh material={lightFieldMaterial}>
          <planeGeometry args={[planeSize, planeSize, 1, 1]} />
        </mesh>
      </Canvas>

      <input
        type="range"
        className="range"
        min="-0.02"
        max="0.02"
        step="0.0001"
        value={focus}
        onChange={(e) => setFocus(parseFloat(e.target.value))}
      />

      <div className="w-full text-right">
        <button className="btn" onClick={() => onFocusConfirm?.(focus * 10)}>
          Done
        </button>
      </div>
    </div>
  );
};
