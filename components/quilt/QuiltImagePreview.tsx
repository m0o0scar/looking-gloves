import { FC, useState, useEffect } from 'react';

import { IconButton } from '@/components/common/IconButton';
import { useSource } from '@/components/editor/useSource';

import { PublishToBlocksButton } from '../blocks/PublishToBlocksButton';
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
    <div className="flex flex-col gap-2 items-center md:items-start">
      <h2>Your hologram is ready 😎</h2>
      <p>You can now view it on your looking glass device, or publish it to Blocks.</p>
      <div className="flex flex-col-reverse md:flex-row items-center md:items-start gap-4">
        <QuiltImage onRendered={setQuiltImage} />

        <div className="flex flex-row md:flex-col gap-4">
          <QuiltImageFlipOrderButton />

          {/* view on looking glass device */}
          <QuiltImageViewOnDeviceButton quiltImage={quiltImage} autoShow />

          {/* download quilt image */}
          <QuiltImageSaveButton quiltImage={quiltImage} />

          {/* publish to looking glass blocks */}
          <PublishToBlocksButton quiltImage={quiltImage} />

          {/* make another quilt */}
          <IconButton tooltip="Make another one" iconType="new" onClick={onRestart} />
        </div>
      </div>
    </div>
  );
};
