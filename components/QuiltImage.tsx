import cls from 'classnames';
import { FC, useEffect, useRef, HTMLAttributes } from 'react';

export interface QuiltImageProps extends HTMLAttributes<HTMLCanvasElement> {
  frames?: HTMLCanvasElement[];
  numberOfCols: number;
  numberOfRows: number;
  frameWidth: number;
}

export const QuiltImage: FC<QuiltImageProps> = ({
  frames,
  numberOfCols,
  numberOfRows,
  frameWidth,
  className,
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
      const frameHeight = (height / width) * frameWidth;
      canvasRef.current!.width = numberOfCols * frameWidth;
      canvasRef.current!.height = numberOfRows * frameHeight;

      // draw frames to canvas
      const ctx = canvasRef.current!.getContext('2d')!;
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const col = i % numberOfCols;
        const row = numberOfRows - 1 - Math.floor(i / numberOfCols);
        const x = col * frameWidth;
        const y = row * frameHeight;
        ctx.drawImage(
          frame,
          0,
          0,
          frame.width,
          frame.height,
          x,
          y,
          frameWidth,
          frameHeight
        );
      }
    }
  }, [frames, numberOfCols, numberOfRows, frameWidth]);

  return (
    <canvas
      ref={canvasRef}
      className={cls('rounded-lg', className)}
      {...props}
    />
  );
};
