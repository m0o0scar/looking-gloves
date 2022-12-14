import type { NextPage } from 'next';

import { QuiltImageCreator } from '@components/QuiltImageCreator';

import { VideoDecoder } from '../components/VideoDecoder';

const cols = 8;
const rows = 12;
const frameWidth = 600;

const VideoPage: NextPage = () => {
  return (
    <article className="prose max-w-full flex flex-col items-center p-5 gap-4 bg-slate-200 min-h-screen box-border">
      <h1>Video to Quilt</h1>

      <QuiltImageCreator
        cols={cols}
        rows={rows}
        frameWidth={frameWidth}
        sequenceDecoder={({ onProgress, onFramesExtracted }) => (
          <VideoDecoder
            numberOfFrames={cols * rows}
            frameWidth={frameWidth}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </article>
  );
};

export default VideoPage;
