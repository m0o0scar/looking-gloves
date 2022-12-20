import { COLS, ROWS } from '@utils/constant';
import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';
import { LightFieldCreator } from '@components/lightfield/LightFieldCreator';

const LumaPage: NextPage = () => {
  return (
    <PageContainer title="Luma NeRF to Light Field" subtitle="🔫 Luma NeRF">
      <LightFieldCreator
        sequenceExtractor={({
          onSourceProvided,
          onProgress,
          onFramesExtracted,
        }) => (
          <LumaLightfieldExtractor
            onSourceProvided={onSourceProvided}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </PageContainer>
  );
};

export default LumaPage;
