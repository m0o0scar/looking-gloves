import { COLS, ROWS, FRAME_WIDTH } from '@utils/constant';
import { triggerDownload } from '@utils/download';
import { framesAreLeftToRight, imagesToVideo } from '@utils/video';
import JSZip from 'jszip';
import { debounce, last } from 'lodash';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { SequenceExtractorProps } from '../extractors/types';
import { ExtractingFramesProgress } from './ExtractingFramesProgress';
import { LightFieldCrossEyesViewer } from './LightFieldCrossEyesViewer';
import { LightFieldFocusEditor } from './LightFieldFocusEditor';
import { QuiltImage } from './QuiltImage';

export interface LightFieldCreatorProps {
  sequenceExtractor?: (params: Partial<SequenceExtractorProps>) => ReactNode;
}

export const LightFieldCreator: FC<LightFieldCreatorProps> = ({ sequenceExtractor }) => {
  // overall status
  const [status, setStatus] = useState<'idle' | 'extracting' | 'adjustFocus' | 'preview'>('idle');

  // extraction progress
  const [progress, setProgress] = useState(0);

  // frames
  const [frames, setFrames] = useState<HTMLCanvasElement[] | undefined>();

  // light field focus
  const [focus, setFocus] = useState(0);

  const renderedCanvasRef = useRef<HTMLCanvasElement>();

  const [savingQuiltImage, setSavingQuiltImage] = useState(false);

  const _saveQuiltImage = debounce(() => {
    if (!renderedCanvasRef.current) return;

    // Quilt image file name conventions:
    // https://docs.lookingglassfactory.com/keyconcepts/quilts#file-naming-conventions
    const frameWidth = renderedCanvasRef.current.width / COLS;
    const frameHeight = renderedCanvasRef.current.height / ROWS;
    const aspectRatio = frameWidth / frameHeight;
    const name = Date.now();
    const filename = `${name}_qs${COLS}x${ROWS}a${aspectRatio.toFixed(2)}.jpg`;

    const url = renderedCanvasRef.current.toDataURL('image/jpeg', 0.9);
    triggerDownload(url, filename);
    setSavingQuiltImage(false);
  }, 500);

  const saveQuiltImage = () => {
    setSavingQuiltImage(true);
    _saveQuiltImage();
  };

  const onSourceProvided = () => setStatus('extracting');

  const onSequenceExtracted = (sequence?: HTMLCanvasElement[]) => {
    if (sequence?.length) {
      setFrames(sequence);
      setStatus('adjustFocus');
    }
  };

  const onFocusConfirm = (value: number) => {
    setFocus(value);
    setStatus('preview');
  };

  return (
    <>
      {/* sequence decoder which extract frames from a source (video file, image sequence zip, etc.) */}
      {sequenceExtractor?.({
        onSourceProvided,
        onProgress: setProgress,
        onFramesExtracted: onSequenceExtracted,
      })}

      {/* frames extraction progress */}
      {status === 'extracting' && <ExtractingFramesProgress progress={progress} />}

      {status === 'adjustFocus' && (
        <>
          <div className="divider"></div>
          <LightFieldFocusEditor frames={frames} onFocusConfirm={onFocusConfirm} />
        </>
      )}

      {status === 'preview' && (
        <>
          <div className="divider"></div>
          <h2 className="flex items-center gap-2">Done ✌️😎</h2>
          <div className="flex gap-4">
            {/* download quilt image */}
            <button
              className="btn btn-success"
              disabled={savingQuiltImage}
              onClick={saveQuiltImage}
            >
              {savingQuiltImage ? 'Saving ...' : 'Save Quilt'}
            </button>
          </div>

          <LightFieldCrossEyesViewer frames={frames} />

          <h3>Quilt image ({COLS * ROWS} frames)</h3>
          <QuiltImage
            focus={focus}
            frames={frames}
            onRendered={(canvas) => (renderedCanvasRef.current = canvas)}
          />
        </>
      )}
    </>
  );
};
