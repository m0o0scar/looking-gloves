import { Canvas } from '@react-three/fiber';
import { FC, useState, useEffect } from 'react';
import { DataArrayTexture, ShaderMaterial } from 'three';

import { SequenceProcessorProps } from '../lightfield/QuiltImageCreator';
import { createLightFieldMaterial } from './LightFieldMaterial';

const SCALE = 10;

export const LightFieldFocusEditor: FC<SequenceProcessorProps> = ({
  focus = 0,
  setFocus,
  sequence,
  onDone,
}) => {
  const [adjustedFocus, setAdjustedFocus] = useState(focus / SCALE);

  const [lightFieldMaterial, setLightFieldMaterial] = useState<ShaderMaterial>();

  const fov = 75;
  const planeSize = 1;
  const cameraZ = planeSize / (2 * Math.tan((fov * Math.PI) / 360));
  const canvasSize = 600;

  const onCancel = () => {
    onDone();
  };

  const onConfirm = () => {
    setFocus(adjustedFocus * SCALE);
    onDone();
  };

  useEffect(() => {
    if (sequence?.length) {
      const numberOfFrames = sequence.length;
      const frameWidth = sequence[0].width;
      const frameHeight = sequence[0].height;

      let offset = 0;
      const data = new Uint8Array(frameWidth * frameHeight * 4 * numberOfFrames);
      for (const frame of [...sequence].reverse()) {
        const imgData = frame.getContext('2d')!.getImageData(0, 0, frameWidth, frameHeight);
        data.set(imgData.data, offset);
        offset += imgData.data.byteLength;
      }

      const texture = new DataArrayTexture(data, frameWidth, frameHeight, numberOfFrames);
      texture.needsUpdate = true;

      const material = createLightFieldMaterial(texture, numberOfFrames);
      setLightFieldMaterial(material);
    }
  }, [sequence]);

  useEffect(() => {
    if (lightFieldMaterial) {
      lightFieldMaterial.uniforms.focus.value = adjustedFocus;
    }
  }, [adjustedFocus, lightFieldMaterial]);

  if (!sequence?.length) return null;

  return (
    <div className="flex flex-col items-center gap-4 max-w-full">
      <h2>Adjust light field focus</h2>
      <p>Drag the slider below to focus on your target</p>

      <div className="w-full flex items-center gap-4">
        <input
          type="range"
          className="range"
          min="-0.02"
          max="0.02"
          step="0.0001"
          value={adjustedFocus}
          onChange={(e) => setAdjustedFocus(parseFloat(e.target.value))}
        />
        <div className="tooltip" data-tip="Cancel">
          <button className="btn btn-square btn-error" onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="tooltip" data-tip="Confirm">
          <button className="btn btn-square btn-success" onClick={onConfirm}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </div>

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
    </div>
  );
};
