/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';

import { useOnce } from '@/utils/useOnce';

import useBlocksAPI from './useBlocksAPI';

export const LoginToBlocksButton: FC = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  const { loggedIn, login, me } = useBlocksAPI();

  // show pending state when user clicks login button,
  // this is because there might be so delay before user is navigated to Blocks website
  const [pending, setPending] = useState(false);

  const showLoginButtonTips = useOnce('blocks.loginButtonTips');

  // decide what label to show based on login status
  let label = '';
  if (loggedIn === undefined) label = '...';
  else if (loggedIn === false) label = 'Login';
  else if (me?.displayName) label = me.displayName;
  else label = '...';

  // login or take user to her Blocks dashboard
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

  const button = (
    <button
      className={cls('btn btn-sm no-animation not-prose hover:animate-none', {
        disabled: pending,
        loading: pending,
        'animate-bounce': !showLoginButtonTips.used,
      })}
      onClick={onClick}
    >
      <img
        src="data:image/png;base64,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"
        alt="Looking Glass Blocks"
        className={cls('h-5 mr-1', { hidden: pending })}
      />
      {label}
    </button>
  );

  if (!loggedIn) {
    return (
      <div
        className={cls('tooltip tooltip-left md:tooltip-right tooltip-info [&::before]:top-6', {
          '!tooltip-left': isHomePage,
        })}
        data-tip="Login and publish your hologram to Blocks 😎"
        onMouseOver={showLoginButtonTips.markAsUsed}
      >
        {button}
      </div>
    );
  } else {
    return button;
  }
};
