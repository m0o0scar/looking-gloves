import { COLS, ROWS } from '@utils/constant';
import { triggerDownload } from '@utils/download';
import { debounce } from 'lodash';
import { FC, useState, useEffect } from 'react';

export interface QuiltImageSaveButtonProps {
  quiltImage?: HTMLCanvasElement;
}

export const QuiltImageSaveButton: FC<QuiltImageSaveButtonProps> = ({ quiltImage }) => {
  const [pending, setPending] = useState(false);

  const _saveQuiltImage = debounce(() => {
    if (!quiltImage) return;

    // Quilt image file name conventions:
    // https://docs.lookingglassfactory.com/keyconcepts/quilts#file-naming-conventions
    const frameWidth = quiltImage.width / COLS;
    const frameHeight = quiltImage.height / ROWS;
    const aspectRatio = frameWidth / frameHeight;
    const name = Date.now();
    const filename = `${name}_qs${COLS}x${ROWS}a${aspectRatio.toFixed(2)}.jpg`;

    const url = quiltImage.toDataURL('image/jpeg', 0.9);
    triggerDownload(url, filename);
    setPending(false);
  }, 300);

  const saveQuiltImage = () => {
    setPending(true);
    _saveQuiltImage();
  };

  return (
    <button className="btn btn-success" disabled={pending || !quiltImage} onClick={saveQuiltImage}>
      {pending ? 'Saving ...' : 'Save Quilt'}
    </button>
  );
};
