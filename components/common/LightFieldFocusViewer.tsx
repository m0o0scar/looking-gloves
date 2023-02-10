import { Canvas } from '@react-three/fiber';
import cls from 'classnames';
import React, { FC, useEffect } from 'react';
import { DataArrayTexture } from 'three';

import {
  material,
  setTexture,
  setTextureFocus,
  disposeTexture,
} from '@/components/common/LightFieldMaterial';

export interface LightFieldFocusViewerProps {
  focus?: number;
  frames?: HTMLCanvasElement[];
}

export const LightFieldFocusViewer: FC<LightFieldFocusViewerProps> = ({ focus = 0, frames }) => {
  const fov = 75;
  const planeSize = 1;
  const cameraZ = planeSize / (2 * Math.tan((fov * Math.PI) / 360));
  const canvasSize = 600;

  // when unmount, dispose the texture to prevent memory leak
  useEffect(() => {
    return () => disposeTexture();
  }, []);

  // when the focus changes, update the texture
  useEffect(() => {
    setTextureFocus(focus);
  }, [focus]);

  // when the frames change, update the texture
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
      setTexture(texture, numberOfFrames);
    }
  }, [frames]);

  if (!frames?.length) return null;

  return (
    <Canvas
      flat
      linear
      frameloop="demand"
      camera={{ position: [0, 0, cameraZ] }}
      className={cls('rounded-lg max-w-full aspect-square m-auto')}
      style={{ width: canvasSize }}
    >
      <mesh material={material!}>
        <planeGeometry args={[planeSize, planeSize, 1, 1]} />
      </mesh>
    </Canvas>
  );
};
