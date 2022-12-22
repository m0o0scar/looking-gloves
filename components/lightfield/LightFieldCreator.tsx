import { FC, ReactNode, useEffect, useState } from 'react';

import { scrollToBottom } from '../../utils/dom';
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
    setFocus(Math.abs(value));
    setStatus('preview');
    if (value < 0) setFrames([...frames!].reverse());
  };

  useEffect(() => {
    if (status === 'adjustFocus') {
      scrollToBottom();
    }
  }, [status]);

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
            <div className="tooltip" data-tip="Adjust focus">
              <button
                className="btn btn-square btn-warning"
                onClick={() => setStatus('adjustFocus')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </button>
            </div>

            {/* view on looking glass device */}
            <QuiltImageViewOnDeviceButton quiltImage={quiltImage} autoShow />

            {/* download quilt image */}
            <QuiltImageSaveButton quiltImage={quiltImage} />
          </div>

          {/* <LightFieldCrossEyesViewer frames={frames} /> */}

          <QuiltImage focus={focus} frames={frames} onRendered={setQuiltImage} />
        </>
      )}
    </>
  );
};
