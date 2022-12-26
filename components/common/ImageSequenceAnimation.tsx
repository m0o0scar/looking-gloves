import { debounce } from 'lodash';
import { FC, useState, useEffect, useRef } from 'react';

export interface ImageSequenceAnimationProps {
  frames?: HTMLCanvasElement[];
  start?: number;
  end?: number;
  width?: number;
  height?: number;
}

export const ImageSequenceAnimation: FC<ImageSequenceAnimationProps> = ({
  frames,
  start = -1,
  end = -1,
  width = 0,
  height = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentIndexRef = useRef(0);
  const animationIntervalRef = useRef(0);
  const animationIndexStepRef = useRef(1);

  const drawCurrentFrame = () => {
    const frame = frames?.[currentIndexRef.current];
    if (!frame || !canvasRef.current) return;
    const ctx = canvasRef.current?.getContext('2d')!;
    ctx.drawImage(
      frame,
      0,
      0,
      frame.width,
      frame.height,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const _startAnimation = () => {
    stopAnimation();

    if (!frames?.length) return;

    const startIndex = Math.max(start < 0 ? 0 : start, 0);
    const endIndex = Math.min(end < 0 ? frames.length : end, frames.length);
    currentIndexRef.current = startIndex + 1;

    animationIntervalRef.current = window.setInterval(() => {
      drawCurrentFrame();

      currentIndexRef.current += animationIndexStepRef.current;
      if (currentIndexRef.current <= startIndex || currentIndexRef.current >= endIndex) {
        animationIndexStepRef.current = -1 * animationIndexStepRef.current;
      }
    }, 1000 / 30);
  };

  const startAnimation = debounce(_startAnimation, 500);

  const stopAnimation = () => {
    clearInterval(animationIntervalRef.current);
    animationIntervalRef.current = 0;
  };

  // update canvas size when frames/width/height change
  useEffect(() => {
    if (canvasRef.current) {
      const canvasWidth = width || frames?.[0]?.width || 0;
      const canvasHeight = height || frames?.[0]?.height || 0;
      if (canvasWidth && canvasHeight) {
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
      }
    }
  }, [frames, width, height]);

  // restart animation when frames/start/end change
  useEffect(() => {
    if (!frames?.length) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }, [frames, start, end]);

  return <canvas ref={canvasRef} />;
};
