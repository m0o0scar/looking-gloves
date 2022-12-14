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
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const distance = Math.round((frames?.length || 0) / 10);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const render = (leftIndex: number) => {
      if (frames?.length) {
        const left = leftIndex;
        const right = leftIndex + distance;

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

    const onMouseMove = (e: MouseEvent) => {
      if (frames?.length) {
        const i = Math.round(
          (e.offsetX / container.offsetWidth) * (frames.length - 1 - distance)
        );
        render(i);
      }
    };

    render(0);

    container.addEventListener('mousemove', onMouseMove);
    return () => container.removeEventListener('mousemove', onMouseMove);
  }, [frames]);

  if (!frames?.length) return null;

  return (
    <div
      ref={containerRef}
      className="flex rounded-lg max-w-2xl overflow-hidden"
    >
      <canvas ref={leftCanvasRef} className="w-1/2 pointer-events-none" />
      <canvas ref={rightCanvasRef} className="w-1/2 pointer-events-none" />
    </div>
  );
};
