import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { ExtractingFramesProgress } from './ExtractingFramesProgress';
import { QuiltImage } from './QuiltImage';
import { QuiltImageCrossEyesViewer } from './QuiltImageCrossEyesViewer';
import { SequenceOrderSelector } from './SequenceOrderSelector';

interface SequenceDecoderParams {
  onProgress: (progress: number) => void;
  onFramesExtracted: (frames?: HTMLCanvasElement[]) => void;
}

export interface QuiltImageCreatorProps {
  cols: number;
  rows: number;
  frameWidth: number;
  sequenceExtractor: (params: SequenceDecoderParams) => ReactNode;
}

export const QuiltImageCreator: FC<QuiltImageCreatorProps> = ({
  cols,
  rows,
  frameWidth,
  sequenceExtractor,
}) => {
  // extraction progress
  const [progress, setProgress] = useState(0);

  // frames
  const [frames, setFrames] = useState<HTMLCanvasElement[] | undefined>();
  const reverseFrames = () =>
    setFrames((value) => (value ? [...value].reverse() : undefined));

  // sequence order
  const [firstAndLastFrame, setFirstAndLastFrame] = useState<
    [HTMLCanvasElement, HTMLCanvasElement] | undefined
  >();
  const [sequenceOrderConfirmed, setSequenceOrderConfirmed] = useState(false);

  const renderedCanvasRef = useRef<HTMLCanvasElement>();

  const hasFrames = (frames?.length || 0) > 0;

  // when sequence order is selected, reverse frames if needed
  const onSequenceOrderSelected = (shouldReverse: boolean) => {
    if (shouldReverse) reverseFrames();
    setSequenceOrderConfirmed(true);
  };

  const saveQuiltImage = () => {
    if (!renderedCanvasRef.current) return;

    // Quilt image file name conventions:
    // https://docs.lookingglassfactory.com/keyconcepts/quilts#file-naming-conventions
    const frameWidth = renderedCanvasRef.current.width / cols;
    const frameHeight = renderedCanvasRef.current.height / rows;
    const aspectRatio = frameWidth / frameHeight;
    const name = Date.now();
    const filename = `${name}_qs${cols}x${rows}a${aspectRatio.toFixed(2)}.jpg`;

    const a = document.createElement('a');
    a.href = renderedCanvasRef.current.toDataURL('image/jpeg', 0.9);
    a.download = filename;
    a.click();
  };

  useEffect(() => {
    if (!hasFrames) {
      // reset sequence order when user selects a new video
      setSequenceOrderConfirmed(false);
      setFirstAndLastFrame(undefined);
      renderedCanvasRef.current = undefined;
    }

    if (hasFrames && !firstAndLastFrame) {
      // remember the 1st and last frame ONCE when frames are extracted
      setFirstAndLastFrame([frames![0], frames![frames!.length - 1]]);
    }
  }, [frames]);

  return (
    <>
      {/* sequence decoder which extract frames from a source (video file, image sequence zip, etc.) */}
      {sequenceExtractor({
        onProgress: setProgress,
        onFramesExtracted: setFrames,
      })}

      {/* frames extraction progress */}
      <ExtractingFramesProgress progress={progress} />

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
          <h2 className="flex items-center gap-2">
            Here is your quilt image 😆
          </h2>
          <div className="flex gap-4">
            {/* reverse frames sequence order */}
            <div className="tooltip" data-tip="Reverse frames sequence order">
              <button className="btn btn-warning" onClick={reverseFrames}>
                Flip
              </button>
            </div>

            {/* download quilt image */}
            <div className="tooltip" data-tip="Download quilt image">
              <button className="btn btn-success" onClick={saveQuiltImage}>
                Download
              </button>
            </div>
          </div>

          <QuiltImageCrossEyesViewer frames={frames} />

          <h3>Quilt image ({cols * rows} frames)</h3>
          <QuiltImage
            numberOfCols={cols}
            numberOfRows={rows}
            frameWidth={frameWidth}
            frames={frames}
            onRendered={(canvas) => (renderedCanvasRef.current = canvas)}
          />
        </>
      )}
    </>
  );
};
