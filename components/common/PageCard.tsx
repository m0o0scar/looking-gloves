import cls from 'classnames';
import Link from 'next/link';
import { FC, ReactNode, ReactFragment } from 'react';

export interface PageCardProps {
  thumbnail: ReactNode;
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
  linkLabel = 'Go',
}) => {
  return (
    <div className="card w-96 max-w-full bg-base-100 shadow-xl overflow-hidden">
      {thumbnail}
      <div className="card-body flex flex-col">
        <h2 className="card-title m-0">{title}</h2>
        <div>{content}</div>
        <div className={cls('text-xs alert', alertClassName)}>{alert}</div>
        <div className="grow" />
        <div className="card-actions justify-end">
          <Link href={link}>
            <button className="btn btn-primary">{linkLabel}</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
