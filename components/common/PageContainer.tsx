import { PRODUCT_NAME } from '@utils/constant';
import cls from 'classnames';
import Head from 'next/head';
import { FC, HTMLAttributes } from 'react';

import { HomeBtn } from './HomeBtn';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  hideHomeBtn?: boolean;
}

export const PageContainer: FC<PageContainerProps> = ({
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
        'prose max-w-full flex flex-col items-center p-5 gap-4 bg-slate-200 min-h-screen',
        className
      )}
    >
      {title && (
        <Head>
          <title>
            {PRODUCT_NAME} - {title}
          </title>
        </Head>
      )}

      {subtitle && <h1>{subtitle}</h1>}

      {!hideHomeBtn && <HomeBtn />}

      {children}
    </article>
  );
};
