import type { NextPage } from 'next';
import Head from 'next/head';

import { HomeBtn } from '@components/common/HomeBtn';
import { PageContainer } from '@components/common/PageContainer';

import { VideoFramesExtractor } from '../components/extractors/VideoFramesExtractor';
import { QuiltImageCreator } from '../components/quilt/QuiltImageCreator';

const cols = 8;
const rows = 12;

const VideoPage: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>Lamu - Video to Quilt</title>
      </Head>

      <HomeBtn />

      <h1>🎥 Video to Quilt</h1>

      <QuiltImageCreator
        cols={cols}
        rows={rows}
        frameWidth={600}
        sequenceExtractor={({ onProgress, onFramesExtracted }) => (
          <VideoFramesExtractor
            numberOfFrames={cols * rows}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </PageContainer>
  );
};

export default VideoPage;
