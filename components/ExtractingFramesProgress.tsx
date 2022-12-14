import { FC, useState, useEffect } from 'react';

export interface ExtractingFramesProgressProps {
  progress?: number;
}

export const ExtractingFramesProgress: FC<ExtractingFramesProgressProps> = ({
  progress = 0,
}) => {
  if (progress <= 0 || progress >= 1) return null;

  return (
    <>
      <div>Extracting frames {Math.round(progress * 100)}% ...</div>
      <progress className="progress w-72" value={progress} max="1"></progress>
    </>
  );
};
