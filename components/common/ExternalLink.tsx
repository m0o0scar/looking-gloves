import cls from 'classnames';
import React, { forwardRef, ForwardedRef, HTMLAttributes, AnchorHTMLAttributes } from 'react';

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const ExternalLink = forwardRef(function ExternalLink(
  props: ExternalLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const { className, style, children, ...rest } = props;
  return (
    <a
      ref={ref}
      className={cls('no-underline bg-blue-100 rounded px-1', className)}
      style={style}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      {...rest}
    >
      {children}
    </a>
  );
});
