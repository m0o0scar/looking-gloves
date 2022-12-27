import { canvasToJpeg } from '@utils/canvas';
import { COLS } from '@utils/constant';
import { triggerDownload } from '@utils/download';
import cls from 'classnames';
import { debounce } from 'lodash';
import { FC, useState } from 'react';

export interface QuiltImageSaveButtonProps {
  quiltImage?: HTMLCanvasElement;
  numberOfFrames?: number;
}

export const QuiltImageSaveButton: FC<QuiltImageSaveButtonProps> = ({
  quiltImage,
  numberOfFrames = 0,
}) => {
  const [pending, setPending] = useState(false);

  const _saveQuiltImage = debounce(() => {
    if (!quiltImage || !numberOfFrames) return;

    // Quilt image file name conventions:
    // https://docs.lookingglassfactory.com/keyconcepts/quilts#file-naming-conventions
    const rows = Math.ceil(numberOfFrames / COLS);
    const frameWidth = quiltImage.width / COLS;
    const frameHeight = quiltImage.height / rows;
    const aspectRatio = frameWidth / frameHeight;
    const name = Date.now();
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
    <div className="tooltip" data-tip="Download quilt image">
      <button
        className={cls('btn btn-square btn-success', { loading: pending })}
        disabled={pending || !quiltImage}
        onClick={saveQuiltImage}
      >
        {!pending && (
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
