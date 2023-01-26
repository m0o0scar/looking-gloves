import { validateSession, loginWithRedirect } from '@lookingglass/blocks.js';
import { useEffect, useState } from 'react';

import { getBlocksAuthClient } from './blocksAuthClient';

export default function useBlocksAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined);

  const login = () => {
    if (!loggedIn) {
      const { protocol, host } = window.location;
      const redirectUri = `${protocol}//${host}`;
      loginWithRedirect(getBlocksAuthClient(), redirectUri);
    }
  };

  useEffect(() => {
    (async () => {
      const token = await validateSession(getBlocksAuthClient());
      // console.log(`[Blocks] validated session, token =`, token);
      setToken(token);
      setLoggedIn(token !== null && token.length > 0);
    })();
  }, []);

  return {
    token,
    loggedIn,
    login,
  };
}
