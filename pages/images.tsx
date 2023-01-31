import type { NextPage } from 'next';

import { PageContainer } from '@/components/common/PageContainer';
import { ImageSequenceProcessor } from '@/components/processors/ImageSequenceProcessor';
import { LightFieldFocusEditor } from '@/components/processors/LightFieldFocusEditor';

const ImageSequencePage: NextPage = () => {
  const processors = [ImageSequenceProcessor, LightFieldFocusEditor];
  return (
    <PageContainer
      favicon="🎞️"
      title="Image Sequence to Hologram"
      subtitle="🎞️ Images"
      processors={processors}
    />
  );
};

export default ImageSequencePage;
