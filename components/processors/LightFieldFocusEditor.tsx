import { Canvas } from '@react-three/fiber';
import { scrollToBottom } from '@utils/dom';
import { useState, useEffect } from 'react';
import { DataArrayTexture } from 'three';

import { IconButton } from '@components/common/IconButton';
import { useSequence } from '@components/hooks/useSequence';

import {
  material,
  setTexture,
  setTextureFocus,
  disposeTexture,
} from '../common/LightFieldMaterial';
import { SequenceProcessorInfo } from '../lightfield/types';

const SCALE = 10;

export const LightFieldFocusEditor: SequenceProcessorInfo = ({ activated, onDone }) => {
  const { focus, setFocus, frames } = useSequence();

  // for holding the adjusted focus value from the slider
  const [adjustedFocus, setAdjustedFocus] = useState(0);

  const fov = 75;
  const planeSize = 1;
  const cameraZ = planeSize / (2 * Math.tan((fov * Math.PI) / 360));
  const canvasSize = 600;

  // when confirm, save the focus value and exit the editor
  const onConfirm = () => {
    setFocus(adjustedFocus * SCALE);
    onDone();
  };

  // when the slider value changes, update the focus state and the texture
  const onFocusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAdjustedFocus(value);
  };

  // when deactivated, dispose the texture to prevent memory leak
  useEffect(() => {
    if (!activated) {
      disposeTexture();
    }
  }, [activated]);

  // sync focus from props to state
  useEffect(() => {
    const value = focus / SCALE;
    setAdjustedFocus(value);
  }, [focus]);

  // when the focus changes, update the texture
  useEffect(() => {
    setTextureFocus(adjustedFocus);
  }, [adjustedFocus]);

  // when the frames change, update the texture
  useEffect(() => {
    if (frames?.length && activated) {
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
      setTexture(texture, numberOfFrames);

      scrollToBottom();
    }
  }, [frames, activated]);

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
          onChange={onFocusChange}
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
        frameloop="demand"
        camera={{ position: [0, 0, cameraZ] }}
        className="rounded-lg max-w-full aspect-square"
        style={{ width: canvasSize }}
      >
        <mesh material={material!}>
          <planeGeometry args={[planeSize, planeSize, 1, 1]} />
        </mesh>
      </Canvas>
    </div>
  );
};

LightFieldFocusEditor.title = 'Edit focus';
