import type { NextPage } from 'next';

import { PageContainer } from '@/components/common/PageContainer';
import { QuiltImageCreator } from '@/components/editor/QuiltImageCreator';
import { ImageSequenceProcessor } from '@/components/processors/ImageSequenceProcessor';
import { LightFieldFocusEditor } from '@/components/processors/LightFieldFocusEditor';

const ImageSequencePage: NextPage = () => {
  return (
    <PageContainer favicon="🎞️" title="Image Sequence to Hologram" subtitle="🎞️ Images">
      <QuiltImageCreator processors={[ImageSequenceProcessor, LightFieldFocusEditor]} />
    </PageContainer>
  );
};

export default ImageSequencePage;
