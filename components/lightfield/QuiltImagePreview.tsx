import { FC, useState, useEffect } from 'react';

import { IconButton } from '@components/common/IconButton';

import { QuiltImage } from './QuiltImage';
import { QuiltImageSaveButton } from './QuiltImageSaveButton';
import { QuiltImageViewOnDeviceButton } from './QuiltImageViewOnDeviceButton';
import { SourceInfo } from './types';

export interface QuiltImagePreviewProps {
  sequence?: HTMLCanvasElement[];
  focus?: number;
  sourceInfo?: SourceInfo;
  onRestart?: () => void;
}

export const QuiltImagePreview: FC<QuiltImagePreviewProps> = ({
  sequence,
  focus = 0,
  sourceInfo,
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

        {/* TODO upload to Looking Glass Blocks directly with their API */}
        {/* use sourceInfo to fill in the title and description */}

        {/* make another quilt */}
        <IconButton tooltip="Make another one" iconType="reload" onClick={onRestart} />
      </div>

      <QuiltImage focus={focus} frames={sequence} onRendered={setQuiltImage} />
    </>
  );
};
