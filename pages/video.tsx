import { COLS, ROWS } from '@utils/constant';
import type { NextPage } from 'next';
import Head from 'next/head';

import { HomeBtn } from '@components/common/HomeBtn';
import { PageContainer } from '@components/common/PageContainer';

import { VideoFramesExtractor } from '../components/extractors/VideoFramesExtractor';
import { QuiltImageCreator } from '../components/quilt/QuiltImageCreator';

const VideoPage: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>👓 Nerfglass - Video to Quilt</title>
      </Head>

      <HomeBtn />

      <h1>🎥 Video to Quilt</h1>

      <QuiltImageCreator
        cols={COLS}
        rows={ROWS}
        frameWidth={800}
        sequenceExtractor={({ onProgress, onFramesExtracted }) => (
          <VideoFramesExtractor
            numberOfFrames={COLS * ROWS}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </PageContainer>
  );
};

export default VideoPage;
