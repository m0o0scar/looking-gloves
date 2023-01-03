import { Canvas } from '@react-three/fiber';
import { scrollToBottom } from '@utils/dom';
import { FC, useState, useEffect } from 'react';
import { DataArrayTexture, ShaderMaterial } from 'three';

import { IconButton } from '@components/common/IconButton';
import { useSequence } from '@components/hooks/useSequence';

import { createLightFieldMaterial } from '../common/LightFieldMaterial';
import { SequenceProcessorInfo } from '../lightfield/types';

const SCALE = 10;

export const LightFieldFocusEditor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { focus, setFocus, frames } = useSequence();

  const [adjustedFocus, setAdjustedFocus] = useState(0);

  const [lightFieldMaterial, setLightFieldMaterial] = useState<ShaderMaterial | undefined>();

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

  const cleanup = () => {
    if (lightFieldMaterial) {
      lightFieldMaterial.dispose();
      setLightFieldMaterial(undefined);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    setAdjustedFocus(focus / SCALE);
  }, [focus]);

  useEffect(() => {
    cleanup();

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

      scrollToBottom();
    }
  }, [frames]);

  useEffect(() => {
    if (lightFieldMaterial) {
      lightFieldMaterial.uniforms.focus.value = adjustedFocus;
    }
  }, [adjustedFocus, lightFieldMaterial]);

  if (!activated || !frames?.length) return null;

  return (
    <div className="flex flex-col items-center gap-2 max-w-full">
      <h2>Adjust light field focus</h2>
      <p>Drag the slider below to focus on your target</p>

      <div className="w-full flex items-center gap-4">
        <input
          type="range"
          className="range"
          min="-0.025"
          max="0.025"
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
