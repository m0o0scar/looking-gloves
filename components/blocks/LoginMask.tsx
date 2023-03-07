import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';

import useBlocksAPI from './useBlocksAPI';

export const LoginMask: FC = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  const { loggedIn, login } = useBlocksAPI();

  const [redirectPathname, setRedirectPathname] = useState('');

  // keep redirect pathname in state
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setRedirectPathname((search.get('redirect') as string) || '');
  }, []);

  useEffect(() => {
    // If we're not in home page and user hasn't login yet, go to login
    if (!isHomePage && loggedIn === false) {
      login();
    }
    // If we're in home page and user already login, check whether we need to redirect to feature page.
    // This redirection usually happen when user login from feature page,
    // because blocks' API doesn't support redirect back to the feature page itself (otherwise callback url won't match),
    // thus when user login from feature page, I added the pathname to callback url.
    else if (isHomePage && loggedIn === true) {
      if (redirectPathname) router.push(redirectPathname);
    }
  }, [isHomePage, loggedIn]);

  console.log(isHomePage, redirectPathname);

  if (isHomePage && redirectPathname)
    return (
      <div className="fixed left-0 right-0 top-0 bottom-0 z-50 bg-[rgba(0,0,0,0.8)] flex flex-col items-center justify-center">
        <div className="px-4 py-3 rounded-lg bg-[rgba(0,0,0,0.5)]">
          <div className="text-white">Hang on ...</div>
          <progress className="progress progress-info w-56"></progress>
        </div>
      </div>
    );

  return null;
};
