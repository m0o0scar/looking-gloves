import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';
import { LightFieldFocusEditor } from '@components/processors/LightFieldFocusEditor';

import { ImageSequenceExtractor } from '../components/processors/ImageSequenceExtractor';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🎥" title="Image Sequence to Light Field" subtitle="🎥 Images/Video">
      <QuiltImageCreator
        processors={[ImageSequenceExtractor, LightFieldFocusEditor]}
        progressBarWidth={352}
      />
    </PageContainer>
  );
};

export default VideoPage;
