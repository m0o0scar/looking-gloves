import React, { FC } from 'react';

import { IconButton } from '../common/IconButton';
import useBlocksAuth from './useBlocksAuth';

export interface PublishToBlocksButtonProps {
  quiltImage?: HTMLCanvasElement;
}

export const PublishToBlocksButton: FC<
  PublishToBlocksButtonProps
> = ({}: PublishToBlocksButtonProps) => {
  const { loggedIn, login } = useBlocksAuth();

  const onClick = () => {
    if (!loggedIn) login();
  };

  return (
    <IconButton
      tooltip="Publish to Looking Glass Blocks"
      buttonClassName="btn-success"
      iconType="block"
      // disabled={pending || !quiltImage}
      // loading={pending}
      onClick={onClick}
    />
  );
};
