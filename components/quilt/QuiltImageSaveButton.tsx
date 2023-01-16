import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { FC, useState } from 'react';

import { IconButton } from '@/components/common/IconButton';
import { useSequence } from '@/components/editor/useSequence';
import { canvasToJpeg } from '@/utils/canvas';
import { COLS } from '@/utils/constant';
import { triggerDownload } from '@/utils/download';

export interface QuiltImageSaveButtonProps {
  quiltImage?: HTMLCanvasElement;
}

export const QuiltImageSaveButton: FC<QuiltImageSaveButtonProps> = ({ quiltImage }) => {
  const [pending, setPending] = useState(false);

  const { frames } = useSequence();
  const numberOfFrames = frames?.length || 0;

  const _saveQuiltImage = debounce(() => {
    if (!quiltImage || !numberOfFrames) return;

    // Quilt image file name conventions:
    // https://docs.lookingglassfactory.com/keyconcepts/quilts#file-naming-conventions
    const rows = Math.ceil(numberOfFrames / COLS);
    const frameWidth = quiltImage.width / COLS;
    const frameHeight = quiltImage.height / rows;
    const aspectRatio = frameWidth / frameHeight;
    const name = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const filename = `${name}_qs${COLS}x${rows}a${aspectRatio.toFixed(2)}.jpg`;

    const url = canvasToJpeg(quiltImage);
    triggerDownload(url, filename);
    setPending(false);
  }, 300);

  const saveQuiltImage = () => {
    setPending(true);
    _saveQuiltImage();
  };

  return (
    <IconButton
      tooltip="Download quilt image"
      buttonClassName="btn-success"
      iconType="download"
      disabled={pending || !quiltImage}
      loading={pending}
      onClick={saveQuiltImage}
    />
  );
};
