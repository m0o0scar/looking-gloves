import { createAuthClient } from '@lookingglass/blocks.js';

let blocksAuthClient: ReturnType<typeof createAuthClient>;

export const getBlocksAuthClient = () => {
  if (!blocksAuthClient) {
    blocksAuthClient = createAuthClient({
      clientId: process.env.NEXT_PUBLIC_BLOCKS_CLIENT_ID!,
    });
  }
  return blocksAuthClient;
};
