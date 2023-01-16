import { FC, useState, useEffect } from 'react';

import { IconButton } from '@/components/common/IconButton';
import { useSource } from '@/components/editor/useSource';

import { QuiltImage } from './QuiltImage';
import { QuiltImageFlipOrderButton } from './QuiltImageFlipOrderButton';
import { QuiltImageSaveButton } from './QuiltImageSaveButton';
import { QuiltImageViewOnDeviceButton } from './QuiltImageViewOnDeviceButton';

export interface QuiltImagePreviewProps {
  onRestart?: () => void;
}

export const QuiltImagePreview: FC<QuiltImagePreviewProps> = ({ onRestart }) => {
  const [quiltImage, setQuiltImage] = useState<HTMLCanvasElement | undefined>();

  const { sourceInfo } = useSource();

  useEffect(() => {
    if (sourceInfo) {
      const { title, author, url, sourceType } = sourceInfo;
      const titleText = `${title} by @${author}`;
      const messageText = [
        `${title} - Created by @${author} with ${sourceType}`,
        url,
        '',
        'Converted to Looking Glass hologram with Looking Gloves 🧤',
        'https://lookinggloves.vercel.app/luma',
      ].join('\n');
      console.log(titleText);
      console.log(messageText);
    }
  }, []);

  return (
    <>
      <h2>Done ✌️😎</h2>

      <div className="flex gap-4">
        <QuiltImageFlipOrderButton />

        {/* view on looking glass device */}
        <QuiltImageViewOnDeviceButton quiltImage={quiltImage} autoShow />

        {/* download quilt image */}
        <QuiltImageSaveButton quiltImage={quiltImage} />

        {/* TODO upload to Looking Glass Blocks directly with their API */}
        {/* use sourceInfo to fill in the title and description */}

        {/* make another quilt */}
        <IconButton tooltip="Make another one" iconType="new" onClick={onRestart} />
      </div>

      <QuiltImage onRendered={setQuiltImage} />
    </>
  );
};
