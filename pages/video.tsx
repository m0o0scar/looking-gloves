/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useRef, useState } from 'react';

import { VideoDecoder } from '../components/VideoDecoder';

const VideoPage: NextPage = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  return (
    <article className="prose max-w-full flex flex-col items-center p-5 gap-4">
      <VideoDecoder
        onFileSelected={() => (containerRef.current!.innerHTML = '')}
        onProgress={setProgress}
        onFramesExtracted={(quilt) => {
          if (quilt) {
            quilt.canvas.style.maxWidth = '100%';
            containerRef.current!.appendChild(quilt.canvas);
          }
        }}
      />

      <progress className="progress w-72" value={progress} max="1"></progress>

      <div ref={containerRef}></div>
    </article>
  );
};

export default VideoPage;
