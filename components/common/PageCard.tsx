/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import Link from 'next/link';
import { FC, ReactNode, ReactFragment } from 'react';

export interface PageCardProps {
  title: ReactNode;
  content: ReactNode | ReactFragment;
  link: string;
  thumbnail?: string;
  thumbnailClassName?: string;
  blurThumbnail?: boolean;
  alert?: ReactNode;
  alertClassName?: string;
}

export const PageCard: FC<PageCardProps> = ({
  title,
  content,
  link,
  thumbnail,
  thumbnailClassName,
  blurThumbnail,
  alert,
  alertClassName,
}) => {
  return (
    <Link href={link}>
      <div
        className={cls(
          'not-porse card card-compact bg-base-100 shadow-lg overflow-hidden cursor-pointer',
          'transition-all hover:scale-105 hover:shadow-2xl',
          '[&>.card-cover]:transition-all [&>.card-cover]:hover:scale-110 [&>.card-cover]:hover:blur-none'
        )}
      >
        {/* thumbnail placeholder */}
        {!thumbnail && <div className="max-w-full aspect-[3/2] bg-slate-300" />}

        {/* if thumbnail is given as string, show it as image */}
        {thumbnail && (
          <img
            src={thumbnail}
            alt="cover"
            className={cls(
              'card-cover m-0 max-w-full aspect-[3/2] object-cover',
              thumbnailClassName,
              { 'blur-sm': blurThumbnail }
            )}
          />
        )}

        {/* title & content */}
        <div className="card-body flex flex-col bg-white z-10">
          <h2 className="card-title m-0">{title}</h2>
          <div className="text-sm">{content}</div>
        </div>

        {alert && <div className={cls('text-xs alert rounded-none', alertClassName)}>{alert}</div>}
      </div>
    </Link>
  );
};
