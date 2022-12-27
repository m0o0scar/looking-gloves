import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';
import { LightFieldFocusEditor } from '@components/processors/LightFieldFocusEditor';
import { LumaLightfieldDownloader } from '@components/processors/LumaLightfieldDownloader';
import { LumaLightfieldRangeSelector } from '@components/processors/LumaLightfieldRangeSelector';

const VideoPage: NextPage = () => {
  return (
    <PageContainer favicon="🔫" title="Luma NeRF to Light Field" subtitle="🔫 Luma NeRF">
      <QuiltImageCreator
        processors={[LumaLightfieldDownloader, LumaLightfieldRangeSelector, LightFieldFocusEditor]}
        progressBarWidth={470}
      />
    </PageContainer>
  );
};

export default VideoPage;
