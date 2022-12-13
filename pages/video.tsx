/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

import { QuiltImage } from '@components/QuiltImage';
import { QuiltImageCrossEyesViewer } from '@components/QuiltImageCrossEyesViewer';
import { SequenceOrderSelector } from '@components/SequenceOrderSelector';

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
  const reverseFrames = () =>
    setFrames((value) => (value ? [...value].reverse() : undefined));

  const [firstAndLastFrame, setFirstAndLastFrame] = useState<
    [HTMLCanvasElement, HTMLCanvasElement] | undefined
  >();

  const [sequenceOrderConfirmed, setSequenceOrderConfirmed] = useState(false);

  const hasFrames = (frames?.length || 0) > 0;
  const showProgress = progress > 0 && progress < 1;

  // when sequence order is selected, reverse frames if needed
  const onSequenceOrderSelected = (shouldReverse: boolean) => {
    if (shouldReverse) reverseFrames();
    setSequenceOrderConfirmed(true);
  };

  useEffect(() => {
    if (!hasFrames) {
      // reset sequence order when user selects a new video
      setSequenceOrderConfirmed(false);
      setFirstAndLastFrame(undefined);
    }

    if (hasFrames && !firstAndLastFrame) {
      // remember the 1st and last frame ONCE when frames are extracted
      setFirstAndLastFrame([frames![0], frames![frames!.length - 1]]);
    }
  }, [frames]);

  return (
    <article className="prose max-w-full flex flex-col items-center p-5 gap-4">
      <VideoDecoder
        {...configs}
        numberOfFrames={cols * rows}
        frameWidth={frameWidth}
        onProgress={setProgress}
        onFramesExtracted={setFrames}
      />

      {showProgress && (
        <>
          <div>Extracting frames {Math.round(progress * 100)}% ...</div>
          <progress
            className="progress w-72"
            value={progress}
            max="1"
          ></progress>
        </>
      )}

      {hasFrames && !sequenceOrderConfirmed && (
        <>
          <div className="divider"></div>
          <SequenceOrderSelector
            firstFrame={firstAndLastFrame?.[0]}
            lastFrame={firstAndLastFrame?.[1]}
            onOrderSelected={onSequenceOrderSelected}
          />
        </>
      )}

      {sequenceOrderConfirmed && (
        <>
          <div className="divider"></div>
          <h1 className="flex items-center gap-2">Here is your quilt image</h1>
          <div className="flex gap-4">
            <button className="btn btn-success">Download</button>
            <button className="btn btn-warning" onClick={reverseFrames}>
              Flip
            </button>
          </div>
          <QuiltImageCrossEyesViewer frames={frames} />
          <QuiltImage
            numberOfCols={cols}
            numberOfRows={rows}
            frameWidth={frameWidth}
            frames={frames}
          />
        </>
      )}
    </article>
  );
};

export default VideoPage;
