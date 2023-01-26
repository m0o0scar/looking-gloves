/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import React, { FC } from 'react';

import useBlocksAuth from './useBlocksAuth';

export interface LoginToBlocksButtonProps {}

export const LoginToBlocksButton: FC<LoginToBlocksButtonProps> = ({}: LoginToBlocksButtonProps) => {
  const { loggedIn, login } = useBlocksAuth();
  const pending = loggedIn === undefined;
  const label = loggedIn === false ? 'Login' : 'Blocks';

  const onClick = () => {
    if (loggedIn === false) {
      login();
    }
  };

  return (
    <button className={cls('btn btn-sm not-prose', { loading: pending })} onClick={onClick}>
      {!pending && (
        <img
          src="/assets/lookingglass-blocks.png"
          alt="Looking Glass Blocks"
          className="h-5 mr-1"
        />
      )}
      {label}
    </button>
  );
};
