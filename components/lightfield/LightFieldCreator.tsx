import { COLS, ROWS } from '@utils/constant';
import { FC, ReactNode, useRef, useState } from 'react';

import { SequenceExtractorProps } from '../extractors/types';
import { ExtractingFramesProgress } from './ExtractingFramesProgress';
import { LightFieldCrossEyesViewer } from './LightFieldCrossEyesViewer';
import { LightFieldFocusEditor } from './LightFieldFocusEditor';
import { QuiltImage } from './QuiltImage';
import { QuiltImageSaveButton } from './QuiltImageSaveButton';
import { QuiltImageViewOnDeviceButton } from './QuiltImageViewOnDeviceButton';

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

  const [quiltImage, setQuiltImage] = useState<HTMLCanvasElement | undefined>();

  const onSourceProvided = () => setStatus('extracting');

  const onSequenceExtracted = (sequence?: HTMLCanvasElement[]) => {
    if (sequence?.length) {
      setFocus(0);
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
          <LightFieldFocusEditor
            initialFocus={focus}
            frames={frames}
            onFocusConfirm={onFocusConfirm}
          />
        </>
      )}

      {status === 'preview' && (
        <>
          <div className="divider"></div>
          <h2 className="flex items-center gap-2">Done ✌️😎</h2>
          <div className="flex gap-4">
            {/* go back to adjust focus */}
            <button className="btn btn-warning" onClick={() => setStatus('adjustFocus')}>
              Adjust focus
            </button>

            {/* view on looking glass device */}
            <QuiltImageViewOnDeviceButton quiltImage={quiltImage} />

            {/* download quilt image */}
            <QuiltImageSaveButton quiltImage={quiltImage} />
          </div>

          <LightFieldCrossEyesViewer frames={frames} />

          <h3>Quilt image ({COLS * ROWS} frames)</h3>
          <QuiltImage focus={focus} frames={frames} onRendered={setQuiltImage} />
        </>
      )}
    </>
  );
};
