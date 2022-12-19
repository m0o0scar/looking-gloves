import { COLS, ROWS } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { HomeBtn } from '@components/common/HomeBtn';
import { PageContainer } from '@components/common/PageContainer';
import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';
import { QuiltImageCreator } from '@components/quilt/QuiltImageCreator';

const LumaPage: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>👓 Nerfglass - Luma NeRF to Quilt</title>
      </Head>

      <HomeBtn />

      <h1>🔫 Luma NeRF to Quilt</h1>

      <QuiltImageCreator
        cols={COLS}
        rows={ROWS}
        frameWidth={600}
        sequenceExtractor={({ onProgress, onFramesExtracted }) => (
          <LumaLightfieldExtractor
            numberOfFrames={COLS * ROWS}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </PageContainer>
  );
};

export default LumaPage;
