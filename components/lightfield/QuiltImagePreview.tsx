import { FC, useState, useEffect } from 'react';

import { IconButton } from '@components/common/IconButton';

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
        <IconButton tooltip="Make another one" iconType="reload" onClick={onRestart} />
      </div>

      <QuiltImage focus={focus} frames={sequence} onRendered={setQuiltImage} />
    </>
  );
};
