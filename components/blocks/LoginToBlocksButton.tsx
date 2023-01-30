/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import React, { FC, useState } from 'react';

import useBlocksAPI from './useBlocksAPI';

export const LoginToBlocksButton: FC = () => {
  const { loggedIn, login, me } = useBlocksAPI();
  const [pending, setPending] = useState(false);

  let label = '';
  if (loggedIn === undefined) label = '...';
  else if (loggedIn === false) label = 'Login';
  else if (me?.displayName) label = me.displayName;
  else label = '...';

  const onClick = () => {
    switch (loggedIn) {
      case false:
        setPending(true);
        login();
        break;

      case true:
        window.open('https://blocks.glass/manage', '_blank');
        break;
    }
  };

  return (
    <button
      className={cls('btn btn-sm no-animation not-prose', { disabled: pending, loading: pending })}
      onClick={onClick}
    >
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
