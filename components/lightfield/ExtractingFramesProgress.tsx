import { FC, useState, useEffect } from 'react';

export interface ExtractingFramesProgressProps {
  progress?: number;
}

export const ExtractingFramesProgress: FC<ExtractingFramesProgressProps> = ({
  progress = 0,
}) => {
  if (progress === 0 || progress >= 1) return null;

  // Indeterminate progress
  if (progress < 0) {
    return (
      <>
        <div>Extracting frames ...</div>
        <progress className="progress w-72"></progress>
      </>
    );
  }

  return (
    <>
      <div>Extracting frames {Math.round(progress * 100)}% ...</div>
      <progress className="progress w-72" value={progress} max="1"></progress>
    </>
  );
};