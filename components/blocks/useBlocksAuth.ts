import { validateSession, loginWithRedirect, BlocksClient, MeQuery } from '@lookingglass/blocks.js';
import { useEffect, useState } from 'react';

import { getBlocksAuthClient } from './blocksAuthClient';

export default function useBlocksAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined);
  const [blocksClient, setBlocksClient] = useState<BlocksClient | undefined>(undefined);
  const [me, setMe] = useState<MeQuery['me'] | undefined>(undefined);

  // perform login
  const login = () => {
    if (!loggedIn) {
      const { protocol, host } = window.location;
      const redirectUri = `${protocol}//${host}`;
      loginWithRedirect(getBlocksAuthClient(), redirectUri);
    }
  };

  // validate session on mount and keep token in state
  useEffect(() => {
    (async () => {
      const token = await validateSession(getBlocksAuthClient());
      console.log(`[Blocks] validated session, token =`, token);

      setToken(token);

      const hasLoggedIn = token !== null && token.length > 0;
      setLoggedIn(hasLoggedIn);

      if (hasLoggedIn) {
        const client = new BlocksClient({ token });
        setBlocksClient(client);

        // get current user info
        const meQuery = await client.me();
        setMe(meQuery.me);
      }
    })();
  }, []);

  return {
    token,
    loggedIn,
    login,
    me,
  };
}
