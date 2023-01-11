import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';
import { FrameInterpolationService } from '@components/processors/FrameInterpolationService';
import { LightFieldFocusEditor } from '@components/processors/LightFieldFocusEditor';
import { LumaLightfieldDownloader } from '@components/processors/LumaLightfieldDownloader';
import { LumaLightfieldRangeSelector } from '@components/processors/LumaLightfieldRangeSelector';

const LumaPage: NextPage = () => {
  return (
    <PageContainer favicon="🔫" title="Luma NeRF to Hologram" subtitle="🔫 Luma NeRF">
      <QuiltImageCreator
        processors={[
          LumaLightfieldDownloader,
          LumaLightfieldRangeSelector,
          FrameInterpolationService,
          LightFieldFocusEditor,
        ]}
      />
    </PageContainer>
  );
};

export default LumaPage;
