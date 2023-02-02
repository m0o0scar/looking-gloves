import type { NextPage } from 'next';

import { PageContainer } from '@/components/common/PageContainer';
import { LightFieldCropEditor } from '@/components/processors/LightFieldCropEditor';
import { LightFieldFocusEditor } from '@/components/processors/LightFieldFocusEditor';
import { VideoFramesExtractor } from '@/components/processors/VideoFramesExtractor';

const VideoPage: NextPage = () => {
  return (
    <PageContainer
      favicon="🎥"
      title="Video to Hologram"
      subtitle="🎥 Video"
      processors={[VideoFramesExtractor, LightFieldFocusEditor, LightFieldCropEditor]}
    />
  );
};

export default VideoPage;
