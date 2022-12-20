import { FC, useRef, useState, useEffect } from 'react';

export interface LightFieldCrossEyesViewerProps {
  frames?: HTMLCanvasElement[];
}

export const LightFieldCrossEyesViewer: FC<LightFieldCrossEyesViewerProps> = ({
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
    <>
      {/* title */}
      <h3>
        Cross-eyes Preview
        <label
          htmlFor="cross-eyes-how-to-modal"
          className="btn btn-link p-0 ml-1"
        >
          (How?)
        </label>
      </h3>

      {/* viewer */}
      <p>Try move your mouse on the image below 😉</p>
      <div
        ref={containerRef}
        className="flex rounded-lg max-w-2xl overflow-hidden drop-shadow-lg"
      >
        <canvas ref={leftCanvasRef} className="w-1/2 pointer-events-none" />
        <canvas ref={rightCanvasRef} className="w-1/2 pointer-events-none" />
      </div>

      {/* cross-eye 3d how-to modal */}
      <input
        type="checkbox"
        id="cross-eyes-how-to-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">How to cross-eyes 3d?</h3>
          <p>
            Try to focus your eyes at a point between the screen and your eyes,
            thus bringing the two images together
          </p>
          <video
            src="/assets/how-to-cross-eyes.mp4"
            className="max-w-full rounded-lg m-0"
            muted
            loop
            autoPlay
          />
          <div className="modal-action">
            <label htmlFor="cross-eyes-how-to-modal" className="btn">
              Ok
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
