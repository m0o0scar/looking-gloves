import { BlocksClient, loginWithRedirect, validateSession } from '@lookingglass/blocks.js';
import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

import { getBlocksAuthClient } from './blocksAuthClient';

interface BlocksContext {
  loggedIn: boolean | undefined;
  blocksClient: BlocksClient | undefined;
  me: Awaited<ReturnType<BlocksClient['me']>>;
}

const blocksContextAtom = atom<BlocksContext>({
  key: 'blocks.context',
  default: {
    loggedIn: undefined,
    blocksClient: undefined,
    me: undefined,
  },
});

export default function useBlocksAPI() {
  const [{ loggedIn, blocksClient, me }, setContext] = useRecoilState(blocksContextAtom);

  // perform login
  const login = () => {
    if (!loggedIn) {
      const { protocol, host, pathname } = window.location;
      const redirectUri = `${protocol}//${host}${pathname}`;
      loginWithRedirect(getBlocksAuthClient(), redirectUri);
    }
  };

  // validate session on mount and keep token in state
  useEffect(() => {
    (async () => {
      // only validate session if login state is not known yet
      if (loggedIn === undefined) {
        const token = await validateSession(getBlocksAuthClient());
        const hasLoggedIn = token !== null && token.length > 0;
        setContext((prev) => ({ ...prev, loggedIn: hasLoggedIn }));

        if (hasLoggedIn) {
          const client = new BlocksClient({ token });
          const me = await client.me();
          setContext((prev) => ({ ...prev, blocksClient: client, me }));
        }
      }
    })();
  }, []);

  return {
    blocksClient,
    loggedIn,
    me,

    login,
  };
}
