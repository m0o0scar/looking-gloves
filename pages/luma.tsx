import type { NextPage } from 'next';
import Head from 'next/head';

import { HomeBtn } from '@components/common/HomeBtn';
import { PageContainer } from '@components/common/PageContainer';
import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';
import { QuiltImageCreator } from '@components/quilt/QuiltImageCreator';

const cols = 8;
const rows = 12;

const LumaPage: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>Lamu - Luma NeRF to Quilt</title>
      </Head>

      <HomeBtn />

      <h1>🔫 Luma NeRF to Quilt</h1>

      <QuiltImageCreator
        cols={cols}
        rows={rows}
        frameWidth={600}
        sequenceExtractor={({ onProgress, onFramesExtracted }) => (
          <LumaLightfieldExtractor
            numberOfFrames={96}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </PageContainer>
  );
};

export default LumaPage;
