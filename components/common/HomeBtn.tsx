/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { FC, useState, useEffect } from 'react';

export const HomeBtn: FC = () => {
  return (
    <Link href="/">
      <button className="btn btn-sm btn-ghost btn-square absolute top-2 right-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </Link>
  );
};
