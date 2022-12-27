import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';
import { LumaLightfieldRangeSelector } from '@components/extractors/LumaLightfieldRangeSelector';
import { LightFieldFocusEditor } from '@components/lightfield/LightFieldFocusEditor';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🔫" title="Luma NeRF to Light Field" subtitle="🔫 Luma NeRF">
      <QuiltImageCreator
        processors={[LumaLightfieldExtractor, LumaLightfieldRangeSelector, LightFieldFocusEditor]}
        progressBarWidth={470}
      />
    </PageContainer>
  );
};

export default VideoPage;
