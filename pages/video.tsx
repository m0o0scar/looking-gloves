import { COLS, ROWS } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { HomeBtn } from '@components/common/HomeBtn';
import { PageContainer } from '@components/common/PageContainer';

import { VideoFramesExtractor } from '../components/extractors/VideoFramesExtractor';
import { LightFieldCreator } from '../components/lightfield/LightFieldCreator';

const VideoPage: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>👓 Nerfglass - Video to Light Field</title>
      </Head>

      <HomeBtn />

      <h1>🎥 Video to Light Field</h1>

      <LightFieldCreator
        cols={COLS}
        rows={ROWS}
        frameWidth={800}
        sequenceExtractor={({
          onSourceProvided,
          onProgress,
          onFramesExtracted,
        }) => (
          <VideoFramesExtractor
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

export default VideoPage;
