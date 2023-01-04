/* eslint-disable @next/next/no-img-element */
import cls from 'classnames';
import Link from 'next/link';
import { FC, ReactNode, ReactFragment } from 'react';

export interface PageCardProps {
  thumbnail?: string;
  title: ReactNode;
  content: ReactNode | ReactFragment;
  alert?: ReactNode;
  alertClassName?: string;
  link: string;
  linkLabel?: string;
}

export const PageCard: FC<PageCardProps> = ({
  thumbnail,
  title,
  content,
  alert,
  alertClassName,
  link,
}) => {
  return (
    <Link href={link}>
      <div className="not-prose card bg-base-100 shadow-lg image-full transition-all hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden">
        {thumbnail && (
          <figure>
            <img src={thumbnail} alt="cover" />
          </figure>
        )}

        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p className="text-sm [&>a]:underline">{content}</p>
          {alert && (
            <div className={cls('text-xs text-black alert bg-opacity-80 mt-2', alertClassName)}>
              {alert}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
