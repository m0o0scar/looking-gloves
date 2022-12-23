import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';

import { ImageSequenceExtractor } from '../components/extractors/ImageSequenceExtractor';
import { LightFieldCreator } from '../components/lightfield/LightFieldCreator';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🎥" title="Image Sequence to Light Field" subtitle="🎥 Images/Video">
      <LightFieldCreator
        sequenceExtractor={({ onSourceProvided, onProgress, onFramesExtracted }) => (
          <ImageSequenceExtractor
            onSourceProvided={onSourceProvided}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </PageContainer>
  );
};

export default VideoPage;
