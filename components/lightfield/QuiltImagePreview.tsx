import { FC, useState, useEffect } from 'react';

import { QuiltImage } from './QuiltImage';
import { QuiltImageSaveButton } from './QuiltImageSaveButton';
import { QuiltImageViewOnDeviceButton } from './QuiltImageViewOnDeviceButton';

export interface QuiltImagePreviewProps {
  sequence?: HTMLCanvasElement[];
  focus?: number;
  onRestart?: () => void;
}

export const QuiltImagePreview: FC<QuiltImagePreviewProps> = ({
  sequence,
  focus = 0,
  onRestart,
}) => {
  const [quiltImage, setQuiltImage] = useState<HTMLCanvasElement | undefined>();

  return (
    <>
      <h2>Done ✌️😎</h2>
      <div className="flex gap-4">
        {/* view on looking glass device */}
        <QuiltImageViewOnDeviceButton
          quiltImage={quiltImage}
          numberOfFrames={sequence?.length}
          autoShow
        />

        {/* download quilt image */}
        <QuiltImageSaveButton quiltImage={quiltImage} numberOfFrames={sequence?.length} />

        {/* make another quilt */}
        <div className="tooltip" data-tip="Make another one">
          <button className="btn btn-square" onClick={onRestart}>
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
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </div>

      <QuiltImage focus={focus} frames={sequence} onRendered={setQuiltImage} />
    </>
  );
};
