import { COLS, ROWS } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { HomeBtn } from '@components/common/HomeBtn';
import { PageContainer } from '@components/common/PageContainer';
import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';
import { LightFieldCreator } from '@components/lightfield/LightFieldCreator';

const LumaPage: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>👓 Nerfglass - Luma NeRF to Light Field</title>
      </Head>

      <HomeBtn />

      <h1>🔫 Luma NeRF to Light Field</h1>

      <LightFieldCreator
        cols={COLS}
        rows={ROWS}
        frameWidth={600}
        sequenceExtractor={({
          onSourceProvided,
          onProgress,
          onFramesExtracted,
        }) => (
          <LumaLightfieldExtractor
            numberOfFrames={COLS * ROWS}
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
