import { FC, useState, useEffect, useRef } from 'react';

export interface QuiltPreviewProps {
  quiltCanvas: HTMLCanvasElement;
  canvasWidth: number;
  cols: number;
  rows: number;
  ratio: number;
}

export const QuiltPreview: FC<QuiltPreviewProps> = ({ quiltCanvas, canvasWidth, cols, rows, ratio }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentFrame = useRef(0);
  const nextFrameDelta = useRef(1);
  const drawFrameInterval = useRef(0);

  function drawFrame() {
    const totalFrames = cols * rows;

    const frameWidth = quiltCanvas.width / cols;
    const frameHeight = quiltCanvas.height / rows;
    const col = currentFrame.current % cols;
    const row = rows - 1 - Math.floor(currentFrame.current / cols);
    const x = col * frameWidth;
    const y = row * frameHeight;
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.drawImage(quiltCanvas, x, y, frameWidth, frameHeight, 0, 0, canvasWidth, canvasWidth / ratio);

    currentFrame.current = currentFrame.current + nextFrameDelta.current;
    if (currentFrame.current >= totalFrames) {
      currentFrame.current = totalFrames - 1;
      nextFrameDelta.current = -1;
    } else if (currentFrame.current < 0) {
      currentFrame.current = 0;
      nextFrameDelta.current = 1;
    }
  }

  useEffect(() => {
    canvasRef.current!.width = canvasWidth;
    canvasRef.current!.height = canvasWidth / ratio;
  }, [canvasWidth, ratio]);

  useEffect(() => {
    currentFrame.current = 0;
    if (cols && rows) {
      drawFrameInterval.current = window.setInterval(drawFrame, 30);
    }
    return () => clearInterval(drawFrameInterval.current);
  }, [cols, rows]);

  if (!rows) return null;

  return <canvas className="w-1/4 rounded-lg drop-shadow-lg" ref={canvasRef} />;
};
