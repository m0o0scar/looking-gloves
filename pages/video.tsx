import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';

import { VideoFramesExtractor } from '../components/extractors/VideoFramesExtractor';
import { LightFieldCreator } from '../components/lightfield/LightFieldCreator';

const VideoPage: NextPage = () => {
  return (
    <PageContainer title=" Video to Light Field" subtitle="🎥 Video">
      <LightFieldCreator
        sequenceExtractor={({
          onSourceProvided,
          onProgress,
          onFramesExtracted,
        }) => (
          <VideoFramesExtractor
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
