import cls from 'classnames';
import { FC, HTMLAttributes } from 'react';

export const PageContainer: FC<HTMLAttributes<HTMLDivElement>> = ({
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
      {children}
    </article>
  );
};
