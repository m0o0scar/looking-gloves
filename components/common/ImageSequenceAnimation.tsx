import cls from 'classnames';
import { debounce } from 'lodash';
import { FC, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { forwardRef, ForwardedRef, HTMLAttributes } from 'react';

export interface ImageSequenceAnimationProps extends HTMLAttributes<HTMLCanvasElement> {
  frames?: HTMLCanvasElement[];
  start?: number;
  end?: number;
}

export const ImageSequenceAnimation = forwardRef(function ImageSequenceAnimation(
  props: ImageSequenceAnimationProps,
  ref: ForwardedRef<HTMLCanvasElement>
) {
  const { className, style, frames, start = -1, end = -1, ...rest } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = canvasRef.current?.getContext('2d')!;
  useImperativeHandle(ref, () => canvasRef.current!);

  const currentIndexRef = useRef(0);
  const animationIntervalRef = useRef(0);
  const animationIndexStepRef = useRef(1);

  const drawCurrentFrame = () => {
    const frame = frames?.[currentIndexRef.current];
    if (!frame || !canvasRef.current) return;
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

    if (!frames?.length || start < 0 || end < 0) return;

    // play through all the frames in 2 seconds
    const fps = Math.min(2000 / (end - start), 50);

    currentIndexRef.current = start + 1;
    animationIntervalRef.current = window.setInterval(() => {
      drawCurrentFrame();

      currentIndexRef.current += animationIndexStepRef.current;
      if (currentIndexRef.current <= start || currentIndexRef.current >= end) {
        animationIndexStepRef.current = -1 * animationIndexStepRef.current;
      }
    }, fps);
  };

  const startAnimation = debounce(_startAnimation, 500);

  const stopAnimation = () => {
    clearInterval(animationIntervalRef.current);
    animationIntervalRef.current = 0;
  };

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  // update canvas size when frames/width/height change
  useEffect(() => {
    if (canvasRef.current && frames?.length) {
      canvasRef.current.width = frames[0].width;
      canvasRef.current.height = frames[0].height;
    }
  }, [frames]);

  // restart animation when frames/start/end change
  useEffect(() => {
    startAnimation();
  }, [frames, start, end]);

  return (
    <canvas
      ref={canvasRef}
      className={cls('rounded-lg max-w-full', className)}
      style={style}
      {...rest}
    ></canvas>
  );
});
