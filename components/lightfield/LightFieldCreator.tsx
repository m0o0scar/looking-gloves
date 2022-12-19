import { triggerDownload } from '@utils/download';
import JSZip from 'jszip';
import { debounce } from 'lodash';
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
  const [frames, setFrames] = useState<HTMLCanvasElement[] | undefined>();
  const reverseFrames = () =>
    setFrames((value) => (value ? [...value].reverse() : undefined));

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

    var zip = new JSZip();
    for (let i = 0; i < frames.length; i++) {
      const imgData = frames[i]
        .toDataURL('image/jpeg', 0.9)
        .replace('data:image/jpeg;base64,', '');
      zip.file(`${i.toString().padStart(3, '0')}.jpg`, imgData, {
        base64: true,
      });
    }
    const content = await zip.generateAsync({ type: 'blob' });

    const name = Date.now();
    const filename = `${name}_lightfield.zip`;
    const url = URL.createObjectURL(content);
    triggerDownload(url, filename);

    URL.revokeObjectURL(url);
    setSavingLightfield(false);
  }, 500);

  const saveLightfield = () => {
    setSavingLightfield(true);
    _saveLightfield();
  };

  const onSourceProvided = () => setStatus('extracting');

  const onSequenceOrderSelected = (shouldReverse: boolean) => {
    if (shouldReverse) reverseFrames();
    setStatus('adjustFocus');
  };

  const onFocusConfirm = (focusValue: number) => {
    focus.current = focusValue;
    setStatus('preview');
  };

  useEffect(() => {
    console.log('status', status);
  }, [status]);

  // remember the 1st and last frame ONCE when frames are extracted
  useEffect(() => {
    if (!frames?.length) {
      setFirstAndLastFrame(undefined);
    }
    if (frames?.length && !firstAndLastFrame) {
      setFirstAndLastFrame([frames![0], frames![frames!.length - 1]]);
      setStatus('choosingOrder');
    }
  }, [frames, firstAndLastFrame]);

  return (
    <>
      {/* sequence decoder which extract frames from a source (video file, image sequence zip, etc.) */}
      {sequenceExtractor({
        onSourceProvided,
        onProgress: setProgress,
        onFramesExtracted: setFrames,
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
            frames={frames}
            onFocusConfirm={onFocusConfirm}
          />
        </>
      )}

      {status === 'preview' && (
        <>
          <div className="divider"></div>
          <h2 className="flex items-center gap-2">Here is your quilt image</h2>
          <div className="flex gap-4">
            {/* reverse frames sequence order */}
            <div className="tooltip" data-tip="Reverse frames sequence order">
              <button className="btn btn-warning" onClick={reverseFrames}>
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
