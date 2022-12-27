import { FC, useState, useEffect } from 'react';

import { QuiltImage } from './QuiltImage';
import { QuiltImageSaveButton } from './QuiltImageSaveButton';
import { QuiltImageViewOnDeviceButton } from './QuiltImageViewOnDeviceButton';

export interface QuiltImagePreviewProps {
  sequence?: HTMLCanvasElement[];
  focus?: number;
}

export const QuiltImagePreview: FC<QuiltImagePreviewProps> = ({ sequence, focus = 0 }) => {
  const [quiltImage, setQuiltImage] = useState<HTMLCanvasElement | undefined>();

  return (
    <>
      <div className="divider"></div>
      <h2 className="flex items-center gap-2">Done ✌️😎</h2>
      <div className="flex gap-4">
        {/* go back to adjust focus */}
        {/* <div className="tooltip" data-tip="Adjust focus">
          <button className="btn btn-square btn-warning" onClick={() => setStatus('adjustFocus')}>
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
        </div> */}

        {/* view on looking glass device */}
        <QuiltImageViewOnDeviceButton
          quiltImage={quiltImage}
          numberOfFrames={sequence?.length}
          autoShow
        />

        {/* download quilt image */}
        <QuiltImageSaveButton quiltImage={quiltImage} numberOfFrames={sequence?.length} />
      </div>

      <QuiltImage focus={focus} frames={sequence} onRendered={setQuiltImage} />
    </>
  );
};
