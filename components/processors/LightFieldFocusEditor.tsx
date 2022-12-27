import { Canvas } from '@react-three/fiber';
import { scrollToBottom } from '@utils/dom';
import { FC, useState, useEffect } from 'react';
import { DataArrayTexture, ShaderMaterial } from 'three';

import { IconButton } from '@components/common/IconButton';

import { SequenceProcessorInfo } from '../lightfield/types';
import { createLightFieldMaterial } from './LightFieldMaterial';

const SCALE = 10;

export const LightFieldFocusEditor: SequenceProcessorInfo = ({
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

      scrollToBottom();
    }
  }, [sequence]);

  useEffect(() => {
    if (lightFieldMaterial) {
      lightFieldMaterial.uniforms.focus.value = adjustedFocus;
    }
  }, [adjustedFocus, lightFieldMaterial]);

  if (!sequence?.length) return null;

  return (
    <div className="flex flex-col items-center gap-2 max-w-full">
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
        <IconButton
          tooltip="Cancel"
          iconType="cross"
          buttonClassName="btn-error"
          onClick={onCancel}
        />
        <IconButton
          tooltip="Confirm"
          iconType="tick"
          buttonClassName="btn-success"
          onClick={onConfirm}
        />
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

LightFieldFocusEditor.title = 'Edit focus';
