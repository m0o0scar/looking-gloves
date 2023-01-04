import { drawSourceOntoDest } from '@utils/canvas';
import cls from 'classnames';
import { FC, useEffect, useRef, HTMLAttributes } from 'react';

import { useSequence } from '@components/hooks/useSequence';

import { COLS, FRAME_WIDTH, FRAME_HEIGHT } from '../../utils/constant';

export interface QuiltImageProps extends HTMLAttributes<HTMLCanvasElement> {
  onRendered?: (canvas: HTMLCanvasElement) => void;
}

export const QuiltImage: FC<QuiltImageProps> = ({ className, onRendered, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { focus, frames } = useSequence();

  useEffect(() => {
    if (frames?.length && onRendered) {
      // update canvas size
      const rows = Math.ceil(frames.length / COLS);
      canvasRef.current!.width = COLS * FRAME_WIDTH;
      canvasRef.current!.height = rows * FRAME_HEIGHT;

      const ctx = canvasRef.current!.getContext('2d')!;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      // draw frames to canvas
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const col = i % COLS;
        const row = rows - 1 - Math.floor(i / COLS);
        const x = col * FRAME_WIDTH;
        const y = row * FRAME_HEIGHT;

        // calculate offset according to the focus value
        // to draw the focus target in the center of the frame
        const focusValue = focus / 10;
        const offset = (i - frames.length / 2) * -focusValue * frame.width;

        // draw the actual frame
        drawSourceOntoDest(frame, canvasRef.current!, {
          dx: x,
          dy: y,
          dw: FRAME_WIDTH,
          dh: FRAME_HEIGHT,
          sourceOffsetX: offset,
          fillEdge: true,
        });
      }

      onRendered?.(canvasRef.current!);
    }
  }, [frames, focus, onRendered]);

  if (!frames?.length) return null;

  return (
    <div className="max-w-2xl">
      <canvas
        ref={canvasRef}
        className={cls('rounded-lg drop-shadow-lg w-full', className)}
        {...props}
      />
    </div>
  );
};
