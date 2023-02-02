import type { NextPage } from 'next';

import { PageContainer } from '@/components/common/PageContainer';
import { ImageSequenceProcessor } from '@/components/processors/ImageSequenceProcessor';
import { LightFieldCropEditor } from '@/components/processors/LightFieldCropEditor';
import { LightFieldFocusEditor } from '@/components/processors/LightFieldFocusEditor';

const ImageSequencePage: NextPage = () => {
  return (
    <PageContainer
      favicon="🎞️"
      title="Image Sequence to Hologram"
      subtitle="🎞️ Images"
      processors={[ImageSequenceProcessor, LightFieldFocusEditor, LightFieldCropEditor]}
    />
  );
};

export default ImageSequencePage;
