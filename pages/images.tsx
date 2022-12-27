import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { LightFieldFocusEditor } from '@components/lightfield/LightFieldFocusEditor';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';

import { ImageSequenceExtractor } from '../components/extractors/ImageSequenceExtractor';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🎥" title="Image Sequence to Light Field" subtitle="🎥 Images/Video">
      <QuiltImageCreator processors={[ImageSequenceExtractor, LightFieldFocusEditor]} />
    </PageContainer>
  );
};

export default VideoPage;
