import cls from 'classnames';
import Link from 'next/link';
import { FC, ReactNode, ReactFragment } from 'react';

export interface PageCardProps {
  thumbnail?: ReactNode;
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
      <div
        className={cls(
          'card w-96 max-w-full bg-base-100 shadow-lg overflow-hidden cursor-pointer',
          'transition-all hover:scale-105 hover:shadow-2xl'
        )}
      >
        {thumbnail || <div className="max-w-full aspect-[3/2] bg-slate-300" />}
        <div className="card-body flex flex-col">
          <h2 className="card-title m-0">{title}</h2>
          <div>{content}</div>
          {alert && (
            <div className={cls('text-xs alert', alertClassName)}>{alert}</div>
          )}
        </div>
      </div>
    </Link>
  );
};
