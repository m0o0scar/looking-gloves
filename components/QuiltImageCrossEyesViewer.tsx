import styled from '@emotion/styled';
import { FC, useRef, useState, useEffect } from 'react';

const StyledContainer = styled.div`
  display: flex;
  max-width: 100%;

  > canvas {
    width: 50%;
  }
`;

export interface QuiltImageCrossEyesViewerProps {
  frames?: HTMLCanvasElement[];
}

export const QuiltImageCrossEyesViewer: FC<QuiltImageCrossEyesViewerProps> = ({
  frames,
}) => {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const distance = Math.round((frames?.length || 0) / 10);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (frames?.length) {
        const i = Math.round(
          (e.clientX / window.innerWidth) * (frames.length - 1 - distance)
        );
        const left = i;
        const right = i + distance;

        leftCanvasRef.current!.width = frames[left].width;
        leftCanvasRef.current!.height = frames[left].height;
        rightCanvasRef.current!.width = frames[right].width;
        rightCanvasRef.current!.height = frames[right].height;

        const leftCtx = leftCanvasRef.current!.getContext('2d')!;
        const rightCtx = rightCanvasRef.current!.getContext('2d')!;
        leftCtx.drawImage(frames[left], 0, 0);
        rightCtx.drawImage(frames[right], 0, 0);
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [frames]);

  if (!frames?.length) return null;

  return (
    <div className="flex rounded-lg max-w-2xl overflow-hidden">
      <canvas ref={leftCanvasRef} className="w-1/2" />
      <canvas ref={rightCanvasRef} className="w-1/2" />
    </div>
  );
};
