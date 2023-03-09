import { useRouter } from 'next/router';
import React, { FC, useEffect } from 'react';

import useBlocksAPI, { isBlocksLoginRequired } from './useBlocksAPI';

export const LoginMask: FC = () => {
  const router = useRouter();
  const isLoginRequired = isBlocksLoginRequired(router.pathname);

  const { loggedIn, login } = useBlocksAPI();

  useEffect(() => {
    // If we're not in home page and user hasn't login yet, go to login
    if (isLoginRequired && loggedIn === false) {
      login();
    }
  }, [isLoginRequired, loggedIn]);

  // only show this mask in feature pages that require login to Blocks,
  // show mask before login is success
  if (isLoginRequired && loggedIn !== true)
    return (
      <div className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-[rgba(0,0,0,0.8)] flex flex-col items-center justify-center">
        <div className="px-6 py-4 rounded-lg bg-[rgba(0,0,0,0.5)]">
          <div className="text-white">Logging in ...</div>
          <progress className="progress progress-info w-56"></progress>
        </div>
      </div>
    );

  return null;
};
