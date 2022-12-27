/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { FC } from 'react';

import { IconButton } from './IconButton';

export const HomeBtn: FC = () => {
  return (
    <Link href="/">
      <IconButton iconType="cross" buttonClassName="btn-sm btn-ghost fixed top-2 right-2" />
    </Link>
  );
};
