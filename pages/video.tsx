import type { NextPage } from 'next';

import { VideoFramesExtractor } from '../components/extractors/VideoFramesExtractor';
import { QuiltImageCreator } from '../components/quilt/QuiltImageCreator';

const cols = 8;
const rows = 12;

const VideoPage: NextPage = () => {
  return (
    <article className="prose max-w-full flex flex-col items-center p-5 gap-4 bg-slate-200 min-h-screen box-border">
      <h1>Video to Quilt</h1>

      <QuiltImageCreator
        cols={cols}
        rows={rows}
        frameWidth={600}
        sequenceExtractor={({ onProgress, onFramesExtracted }) => (
          <VideoFramesExtractor
            numberOfFrames={cols * rows}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </article>
  );
};

export default VideoPage;
