import cls from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, HTMLAttributes } from 'react';

import { PRODUCT_NAME_SHORT } from '@/utils/constant';

import { LoginToBlocksButton } from '../blocks/LoginToBlocksButton';
import { QuiltImageCreator } from '../editor/QuiltImageCreator';
import { QuiltImageCreatorSteps } from '../editor/QuiltImageCreatorSteps';
import { SequenceProcessorInfo } from '../processors/types';
import { HomeBtn } from './HomeBtn';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  favicon?: string;
  title?: string;
  subtitle?: string;
  processors?: SequenceProcessorInfo[];
}

export const PageContainer: FC<PageContainerProps> = ({
  favicon,
  title,
  subtitle,
  className,
  processors,
  children,
}) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <>
      <article
        className={cls(
          'prose max-w-full min-h-screen overflow-x-hidden p-5',
          'bg-slate-100 dark:bg-slate-800',
          'flex flex-col', // by default layout vertically
          'md:flex-row', // in bigger screen layout horizontally
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

        <div
          className={cls(
            'flex flex-col items-center md:items-start w-full md:w-56 shrink-0 md:fixed md:top-5',
            {
              '!absolute': isHomePage,
            }
          )}
        >
          {/* navigation buttons */}
          <div
            className={cls(
              'fixed z-50 top-2 left-2 gap-1',
              'flex flex-row md:flex-col', // use veritical layout when in small screen
              { 'md:relative': !isHomePage }
            )}
          >
            {!isHomePage && <HomeBtn />}
            <LoginToBlocksButton />
          </div>

          {/* subtitle */}
          {subtitle && <h1 className="mt-6 md:hidden">{subtitle}</h1>}

          {/* steps */}
          <QuiltImageCreatorSteps processors={processors} />
          <div className="divider md:hidden" />
        </div>

        {/* main app content */}
        <div
          className={cls(
            'flex flex-col items-center md:items-start flex-1 min-w-0 md:ml-60',
            isHomePage && '!items-center !ml-0'
          )}
        >
          {/* subtitle */}
          {subtitle && <h1 className="hidden md:block">{subtitle}</h1>}

          {children || <QuiltImageCreator processors={processors} />}
        </div>
      </article>
    </>
  );
};
