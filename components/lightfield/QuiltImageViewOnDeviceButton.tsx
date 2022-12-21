import { showQuiltImage } from '@utils/holoplay';
import { debounce } from 'lodash';
import { FC, useState, useEffect } from 'react';

export interface QuiltImageViewOnDeviceButtonProps {
  quiltImage?: HTMLCanvasElement;
}

export const QuiltImageViewOnDeviceButton: FC<QuiltImageViewOnDeviceButtonProps> = ({
  quiltImage,
}) => {
  const [pending, setPending] = useState(false);

  const _onClick = debounce(async () => {
    await showQuiltImage(quiltImage);
    setPending(false);
  }, 300);

  const onClick = () => {
    setPending(true);
    _onClick();
  };

  return (
    <button className="btn btn-info" disabled={pending || !quiltImage} onClick={onClick}>
      {pending ? `Sending to Looking Glass ...` : `View on Looking Glass`}
    </button>
  );
};
