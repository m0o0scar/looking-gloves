import { showQuiltImage } from '@utils/holoplay';
import cls from 'classnames';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';

export interface QuiltImageViewOnDeviceButtonProps {
  quiltImage?: HTMLCanvasElement;
  numberOfFrames?: number;
  autoShow?: boolean;
}

export const QuiltImageViewOnDeviceButton: FC<QuiltImageViewOnDeviceButtonProps> = ({
  quiltImage,
  numberOfFrames,
  autoShow,
}) => {
  const [pending, setPending] = useState(false);

  const autoShowQuiltOnDevice = async () => {
    setPending(true);
    await showQuiltImage(quiltImage, numberOfFrames, { silent: true });
    setPending(false);
  };

  const _onClick = debounce(async () => {
    await showQuiltImage(quiltImage, numberOfFrames);
    setPending(false);
  }, 300);

  const onClick = () => {
    setPending(true);
    _onClick();
  };

  useEffect(() => {
    if (quiltImage && autoShow) {
      autoShowQuiltOnDevice();
    }
  }, [quiltImage, autoShow]);

  return (
    <div className="tooltip" data-tip="View on Looking Glass">
      <button
        className={cls('btn btn-square btn-info', { loading: pending })}
        disabled={pending || !quiltImage}
        onClick={onClick}
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
              d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
