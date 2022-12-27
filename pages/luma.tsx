import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';

import { LightFieldCreator } from '../components/lightfield/LightFieldCreator';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🔫" title="Luma NeRF to Light Field" subtitle="🔫 Luma NeRF">
      <LightFieldCreator
        progressBarWidth={470}
        sequenceExtractor={({ onSourceProvided, onProgress, onFramesExtracted }) => (
          <LumaLightfieldExtractor
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
