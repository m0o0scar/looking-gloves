/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

import { FirstAndLastFrame } from '@components/FirstAndLastFrame';
import { QuiltImage } from '@components/QuiltImage';

import { VideoDecoder } from '../components/VideoDecoder';

const cols = 8;
const rows = 12;
const frameWidth = 600;
const frameHeight = 800;
const configs = {
  numberOfFrames: cols * rows,
  numberOfCols: cols,
  numberOfRows: rows,
  frameWidth,
  frameHeight,
};

const VideoPage: NextPage = () => {
  const [progress, setProgress] = useState(0);
  const [frames, setFrames] = useState<HTMLCanvasElement[] | undefined>();
  const [firstFrameConfirmed, setFirstFrameConfirmed] = useState(false);

  const onFirstFrameSelected = (shouldReverse: boolean) => {
    if (shouldReverse) {
      setFrames([...frames!].reverse());
    }
    setFirstFrameConfirmed(true);
  };

  const hasFrames = (frames?.length || 0) > 0;
  const showProgress = progress > 0 && progress < 1;

  useEffect(() => {
    if (!hasFrames) setFirstFrameConfirmed(false);
  }, [frames]);

  return (
    <article className="prose max-w-full flex flex-col p-5 gap-4">
      <VideoDecoder
        {...configs}
        numberOfFrames={cols * rows}
        frameWidth={frameWidth}
        onProgress={setProgress}
        onFramesExtracted={setFrames}
      />

      {showProgress && (
        <progress className="progress w-72" value={progress} max="1"></progress>
      )}

      {hasFrames && !firstFrameConfirmed && (
        <>
          <div className="divider"></div>
          <FirstAndLastFrame
            frames={frames}
            onFirstFrameSelected={onFirstFrameSelected}
          />
        </>
      )}

      {firstFrameConfirmed && (
        <>
          <div className="divider"></div>
          <h1 className="flex items-center gap-2">
            <span>Here is your quilt image,</span>
            <button className="btn btn-success">Download</button>
          </h1>
          <QuiltImage
            numberOfCols={cols}
            numberOfRows={rows}
            frameWidth={frameWidth}
            frames={frames}
            className="max-w-full"
          />
        </>
      )}
    </article>
  );
};

export default VideoPage;
