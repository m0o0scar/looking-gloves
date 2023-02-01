import cls from 'classnames';
import React, { FC } from 'react';

export interface CropperProps {
  targetRatio: number;
  source?: HTMLCanvasElement;
  sourceRatio?: number;
  className?: string;
}

export const Cropper: FC<CropperProps> = ({
  targetRatio,
  source,
  sourceRatio: sourceRatioProp,
  className,
}: CropperProps) => {
  const sourceRatio = source?.width! / source?.height! || sourceRatioProp;
  const rectRatio = targetRatio / sourceRatio! || 1;

  let rectWidth: number, rectHeight: number;
  if (rectRatio < 1) {
    rectWidth = rectRatio;
    rectHeight = 1;
  } else {
    rectWidth = 1;
    rectHeight = 1 / rectRatio;
  }

  const rectX = Math.round(((1 - rectWidth) / 2) * 100);
  const rectY = Math.round(((1 - rectHeight) / 2) * 100);

  return (
    <div
      className={cls('bg-white dark:bg-slate-800 opacity-70', className)}
      style={{
        clipPath: [
          `polygon(0% 0%`,
          `0% 100%`,
          `${rectX}% 100%`,
          `${rectX}% ${rectY}%`,
          `${100 - rectX}% ${rectY}%`,
          `${100 - rectX}% ${100 - rectY}%`,
          `${rectX}% ${100 - rectY}%`,
          `${rectX}% 100%`,
          `100% 100%`,
          `100% 0%)`,
        ].join(', '),
      }}
    />
  );
};
