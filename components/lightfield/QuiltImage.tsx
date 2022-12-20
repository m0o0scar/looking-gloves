import cls from 'classnames';
import { FC, useEffect, useRef, HTMLAttributes } from 'react';

import { COLS, ROWS, FRAME_WIDTH } from '../../utils/constant';
export interface QuiltImageProps extends HTMLAttributes<HTMLCanvasElement> {
  frames?: HTMLCanvasElement[];
  onRendered?: (canvas: HTMLCanvasElement) => void;
}

export const QuiltImage: FC<QuiltImageProps> = ({
  frames,
  className,
  onRendered,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!frames?.length) {
      canvasRef.current!.width = 0;
      canvasRef.current!.height = 0;
    } else {
      // update canvas size
      const { width, height } = frames[0];
      const frameHeight = (height / width) * FRAME_WIDTH;
      canvasRef.current!.width = COLS * FRAME_WIDTH;
      canvasRef.current!.height = ROWS * frameHeight;

      // draw frames to canvas
      const ctx = canvasRef.current!.getContext('2d')!;
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const col = i % COLS;
        const row = ROWS - 1 - Math.floor(i / COLS);
        const x = col * FRAME_WIDTH;
        const y = row * frameHeight;
        ctx.drawImage(
          frame,
          0,
          0,
          frame.width,
          frame.height,
          x,
          y,
          FRAME_WIDTH,
          frameHeight
        );
      }

      onRendered?.(canvasRef.current!);
    }
  }, [frames]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: `min(100%, 42rem)` }}
      className={cls('rounded-lg drop-shadow-lg', className)}
      {...props}
    />
  );
};
