import { PRODUCT_NAME_SHORT } from '@utils/constant';
import cls from 'classnames';
import Head from 'next/head';
import { FC, HTMLAttributes } from 'react';

import { HomeBtn } from './HomeBtn';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  favicon?: string;
  title?: string;
  subtitle?: string;
  hideHomeBtn?: boolean;
}

export const PageContainer: FC<PageContainerProps> = ({
  favicon,
  title,
  subtitle,
  hideHomeBtn,
  className,
  children,
  ...props
}) => {
  return (
    <article
      className={cls(
        'prose max-w-full flex flex-col items-center p-5 gap-2 bg-slate-100 min-h-screen overflow-x-hidden',
        className
      )}
    >
      <Head>
        {favicon && (
          <link
            rel="icon"
            href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${favicon}</text></svg>`}
          ></link>
        )}
        {title && (
          <title>
            {PRODUCT_NAME_SHORT} - {title}
          </title>
        )}
      </Head>

      {subtitle && <h1>{subtitle}</h1>}

      {!hideHomeBtn && <HomeBtn />}

      {children}
    </article>
  );
};
