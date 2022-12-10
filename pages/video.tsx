/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import type { NextPage } from 'next';
import { useRef, useState } from 'react';

import { VideoDecoder } from '../components/VideoDecoder';

const cols = 8;
const rows = 12;

const VideoPage: NextPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quiltCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const quiltFrameRatio = useRef(0);
  const [progress, setProgress] = useState(0);

  const showProgress = progress > 0 && progress < 1;
  const showQuiltImage = progress === 1;

  const reset = () => {
    containerRef.current!.innerHTML = '';
    quiltCanvasRef.current = null;
  };

  const updateRatio = (video: HTMLVideoElement) => {
    quiltFrameRatio.current = video.videoWidth / video.videoHeight;
  };

  const downloadQuiltImage = () => {
    if (!quiltCanvasRef.current) return;

    const a = document.createElement('a');
    a.download = `${Date.now()}-qs${cols}x${rows}a${quiltFrameRatio.current.toFixed(2)}.jpg`;
    a.href = quiltCanvasRef.current!.toDataURL('image/jpeg', 0.95);
    a.click();
  };

  return (
    <article className="prose max-w-full flex flex-col items-center p-5 gap-4">
      <VideoDecoder
        numberOfCols={cols}
        numberOfRows={rows}
        onFileSelected={reset}
        onMetadataLoaded={updateRatio}
        onProgress={setProgress}
        onFramesExtracted={(quilt) => {
          if (quilt) {
            quiltCanvasRef.current = quilt.canvas;
            quilt.canvas.style.maxWidth = '100%';
            containerRef.current!.appendChild(quilt.canvas);
          }
        }}
      />

      {showProgress && <progress className="progress w-72" value={progress} max="1"></progress>}

      <div className={cls(showQuiltImage ? '' : 'hidden', 'flex flex-col gap-4')}>
        <div className="text-right">Target should be on the left</div>
        <div ref={containerRef}></div>
        <div className="flex justify-between">
          <div>Target should be on the right side</div>
          <button className="btn text-center" onClick={downloadQuiltImage}>
            Download
          </button>
        </div>
      </div>
    </article>
  );
};

export default VideoPage;
