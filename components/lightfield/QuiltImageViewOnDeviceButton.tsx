import { holoplayClient } from '@utils/holoplay';
import cls from 'classnames';
import { debounce } from 'lodash';
import { FC, useEffect, useState } from 'react';

import { IconButton } from '@components/common/IconButton';
import { useSequence } from '@components/hooks/useSequence';

export interface QuiltImageViewOnDeviceButtonProps {
  quiltImage?: HTMLCanvasElement;
  autoShow?: boolean;
}

export const QuiltImageViewOnDeviceButton: FC<QuiltImageViewOnDeviceButtonProps> = ({
  quiltImage,
  autoShow,
}) => {
  const [pending, setPending] = useState(false);

  const { frames } = useSequence();
  const numberOfFrames = frames?.length || 0;

  const autoShowQuiltOnDevice = async () => {
    setPending(true);
    await holoplayClient.showQuiltImage(quiltImage!, numberOfFrames, { silent: true });
    setPending(false);
  };

  const _onClick = debounce(async () => {
    await holoplayClient.showQuiltImage(quiltImage!, numberOfFrames);
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
    <IconButton
      tooltip="View on Looking Glass (Make sure Looking Glass Studio is closed)"
      iconType="cube"
      buttonClassName="btn-info"
      loading={pending}
      disabled={pending || !quiltImage}
      onClick={onClick}
    />
  );
};
