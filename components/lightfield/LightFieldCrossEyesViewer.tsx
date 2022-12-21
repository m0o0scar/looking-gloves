import { drawSourceOntoDest } from '@utils/canvas';
import { FRAME_HEIGHT, FRAME_WIDTH } from '@utils/constant';
import { FC, useRef, useEffect } from 'react';

export interface LightFieldCrossEyesViewerProps {
  frames?: HTMLCanvasElement[];
}

export const LightFieldCrossEyesViewer: FC<LightFieldCrossEyesViewerProps> = ({ frames }) => {
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
        drawSourceOntoDest(frames[left], leftCanvasRef.current!);
        drawSourceOntoDest(frames[right], rightCanvasRef.current!);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (frames?.length) {
        const i = Math.round((e.offsetX / container.offsetWidth) * (frames.length - 1 - distance));
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
        <label htmlFor="cross-eyes-how-to-modal" className="btn btn-link p-0 ml-1">
          (How?)
        </label>
      </h3>

      {/* viewer */}
      <p>Try move your mouse on the image below 😉</p>
      <div ref={containerRef} className="flex rounded-lg max-w-2xl overflow-hidden drop-shadow-lg">
        <canvas
          ref={leftCanvasRef}
          className="w-1/2 pointer-events-none"
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
        />
        <canvas
          ref={rightCanvasRef}
          className="w-1/2 pointer-events-none"
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
        />
      </div>

      {/* cross-eye 3d how-to modal */}
      <input type="checkbox" id="cross-eyes-how-to-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">How to cross-eyes 3d?</h3>
          <p>
            Try to focus your eyes at a point between the screen and your eyes, thus bringing the
            two images together
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
