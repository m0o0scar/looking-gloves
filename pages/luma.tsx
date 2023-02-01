import type { NextPage } from 'next';

import { PageContainer } from '@/components/common/PageContainer';
import { LightFieldCropEditor } from '@/components/processors/LightFieldCropEditor';
import { LightFieldFocusEditor } from '@/components/processors/LightFieldFocusEditor';
import { LumaLightfieldDownloader } from '@/components/processors/LumaLightfieldDownloader';
import { LumaLightfieldRangeSelector } from '@/components/processors/LumaLightfieldRangeSelector';

const LumaPage: NextPage = () => {
  return (
    <PageContainer
      favicon="🔫"
      title="Luma NeRF to Hologram"
      subtitle="🔫 Luma NeRF"
      processors={[
        LumaLightfieldDownloader,
        LumaLightfieldRangeSelector,
        LightFieldFocusEditor,
        LightFieldCropEditor,
      ]}
    />
  );
};

export default LumaPage;
