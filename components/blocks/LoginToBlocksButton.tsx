/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import React, { FC } from 'react';

import useBlocksAPI from './useBlocksAPI';

export const LoginToBlocksButton: FC = () => {
  const { loggedIn, login, me } = useBlocksAPI();

  let label = '';
  if (loggedIn === undefined) label = '...';
  else if (loggedIn === false) label = 'Login';
  else if (me?.displayName) label = me.displayName;
  else label = '...';

  const onClick = () => {
    if (loggedIn === false) {
      login();
    }
  };

  return (
    <button className={cls('btn btn-sm no-animation not-prose')} onClick={onClick}>
      <img src="/assets/lookingglass-blocks.png" alt="Looking Glass Blocks" className="h-5 mr-1" />
      {label}
    </button>
  );
};
