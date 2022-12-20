import { triggerDownload } from '@utils/download';
import { imagesToVideo } from '@utils/video';
import JSZip from 'jszip';
import { debounce, last } from 'lodash';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { SequenceExtractorProps } from '../extractors/types';
import { ExtractingFramesProgress } from './ExtractingFramesProgress';
import { LightFieldCrossEyesViewer } from './LightFieldCrossEyesViewer';
import { LightFieldFocusEditor } from './LightFieldFocusEditor';
import { QuiltImage } from './QuiltImage';
import { SequenceOrderSelector } from './SequenceOrderSelector';

export interface LightFieldCreatorProps {
  cols: number;
  rows: number;
  frameWidth: number;
  sequenceExtractor: (params: Partial<SequenceExtractorProps>) => ReactNode;
}

export const LightFieldCreator: FC<LightFieldCreatorProps> = ({
  cols,
  rows,
  frameWidth,
  sequenceExtractor,
}) => {
  // overall status
  const [status, setStatus] = useState<
    'idle' | 'extracting' | 'choosingOrder' | 'adjustFocus' | 'preview'
  >('idle');

  // extraction progress
  const [progress, setProgress] = useState(0);

  // frames
  const [flip, setFlip] = useState(false);
  const [leftToRightSequence, setLeftToRightSequence] = useState<
    HTMLCanvasElement[] | undefined
  >();
  const [frames, setFrames] = useState<HTMLCanvasElement[] | undefined>();

  // sequence order
  const [firstAndLastFrame, setFirstAndLastFrame] = useState<
    [HTMLCanvasElement, HTMLCanvasElement] | undefined
  >();

  // light field focus
  const focus = useRef(0);

  const renderedCanvasRef = useRef<HTMLCanvasElement>();

  const [savingQuiltImage, setSavingQuiltImage] = useState(false);
  const [savingLightfield, setSavingLightfield] = useState(false);

  const _saveQuiltImage = debounce(() => {
    if (!renderedCanvasRef.current) return;

    // Quilt image file name conventions:
    // https://docs.lookingglassfactory.com/keyconcepts/quilts#file-naming-conventions
    const frameWidth = renderedCanvasRef.current.width / cols;
    const frameHeight = renderedCanvasRef.current.height / rows;
    const aspectRatio = frameWidth / frameHeight;
    const name = Date.now();
    const filename = `${name}_qs${cols}x${rows}a${aspectRatio.toFixed(2)}.jpg`;

    const url = renderedCanvasRef.current.toDataURL('image/jpeg', 0.9);
    triggerDownload(url, filename);
    setSavingQuiltImage(false);
  }, 500);

  const saveQuiltImage = () => {
    setSavingQuiltImage(true);
    _saveQuiltImage();
  };

  const _saveLightfield = debounce(async () => {
    if (!frames?.length) return;

    const hopConfig = {
      movie: false,
      mediaType: 'photoset',
      quilt_settings: {
        viewX: 1,
        viewY: 1,
        viewTotal: frames.length,
        invertViews: true,
        aspect: -1.0,
      },
      depthiness: 1.0,
      depthInversion: false,
      chromaDepth: false,
      depthPosition: 'right',
      focus: focus.current * (flip ? 1 : -1),
      viewOrderReversed: !flip,
      zoom: 1.0,
      position_x: 0.0,
      position_y: 0.0,
      duration: 10.0,
    };

    var zip = new JSZip();
    const video = await imagesToVideo(frames);
    zip.file('lightfield.mp4', video, { binary: true });
    zip.file('lightfield.mp4.json', JSON.stringify(hopConfig, null, 2));
    // for (let i = 0; i < frames.length; i++) {
    //   const imgData = frames[i]
    //     .toDataURL('image/jpeg', 0.9)
    //     .replace('data:image/jpeg;base64,', '');
    //   zip.file(`${i.toString().padStart(3, '0')}.jpg`, imgData, {
    //     base64: true,
    //   });
    // }
    const content = await zip.generateAsync({ type: 'blob' });

    const name = Date.now();
    const filename = `${name}_lightfield.hop`;
    // const filename = `${name}_lightfield.zip`;
    const url = URL.createObjectURL(content);
    triggerDownload(url, filename);

    URL.revokeObjectURL(url);
    setSavingLightfield(false);
  }, 500);

  const saveLightfield = () => {
    setSavingLightfield(true);
    _saveLightfield();
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const onSourceProvided = () => setStatus('extracting');

  const onSequenceOrderSelected = (shouldReverse: boolean) => {
    if (shouldReverse) setFlip(true);
    setStatus('adjustFocus');
  };

  const onFocusConfirm = (focusValue: number) => {
    focus.current = focusValue;
    setStatus('preview');
  };

  useEffect(() => {
    if (!leftToRightSequence?.length) {
      setFrames(undefined);
    } else {
      setFrames(
        flip ? [...leftToRightSequence].reverse() : leftToRightSequence
      );
    }
  }, [leftToRightSequence, flip]);

  // remember the 1st and last frame ONCE when frames are extracted
  useEffect(() => {
    if (!leftToRightSequence?.length) {
      setFirstAndLastFrame(undefined);
    }
    if (leftToRightSequence?.length && !firstAndLastFrame) {
      setFirstAndLastFrame([
        leftToRightSequence![0],
        last(leftToRightSequence)!,
      ]);
      setStatus('choosingOrder');
    }
  }, [leftToRightSequence, firstAndLastFrame]);

  useEffect(() => {
    if (status === 'choosingOrder' || status === 'adjustFocus') {
      scrollToBottom();
    }
  }, [status]);

  return (
    <>
      {/* sequence decoder which extract frames from a source (video file, image sequence zip, etc.) */}
      {sequenceExtractor({
        onSourceProvided,
        onProgress: setProgress,
        onFramesExtracted: setLeftToRightSequence,
      })}

      {/* frames extraction progress */}
      {status === 'extracting' && (
        <ExtractingFramesProgress progress={progress} />
      )}

      {/* sequence order */}
      {status === 'choosingOrder' && (
        <>
          <div className="divider"></div>
          <SequenceOrderSelector
            firstFrame={firstAndLastFrame?.[0]}
            lastFrame={firstAndLastFrame?.[1]}
            onOrderSelected={onSequenceOrderSelected}
          />
        </>
      )}

      {status === 'adjustFocus' && (
        <>
          <div className="divider"></div>
          <LightFieldFocusEditor
            frames={leftToRightSequence}
            onFocusConfirm={onFocusConfirm}
          />
        </>
      )}

      {status === 'preview' && (
        <>
          <div className="divider"></div>
          <h2 className="flex items-center gap-2">Done ✌️😎</h2>
          <div className="flex gap-4">
            {/* reverse frames sequence order */}
            <div className="tooltip" data-tip="Reverse frames sequence order">
              <button
                className="btn btn-warning"
                onClick={() => setFlip((value) => !value)}
              >
                Flip
              </button>
            </div>

            {/* download quilt image */}
            <button
              className="btn btn-success"
              disabled={savingQuiltImage}
              onClick={saveQuiltImage}
            >
              {savingQuiltImage ? 'Saving ...' : 'Save Quilt'}
            </button>
            <button
              className="btn btn-success"
              disabled={savingLightfield}
              onClick={saveLightfield}
            >
              {savingLightfield ? 'Saving ...' : 'Save Light Field'}
            </button>
          </div>

          <LightFieldCrossEyesViewer frames={frames} />

          {/* <h3>Quilt image ({cols * rows} frames)</h3> */}
          <QuiltImage
            className="hidden"
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
