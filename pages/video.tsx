import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';
import { LightFieldFocusEditor } from '@components/processors/LightFieldFocusEditor';
import { VideoFramesExtractor } from '@components/processors/VideoFramesExtractor';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🎥" title="Video to Hologram" subtitle="🎥 Video">
      <QuiltImageCreator processors={[VideoFramesExtractor, LightFieldFocusEditor]} />
    </PageContainer>
  );
};

export default VideoPage;
