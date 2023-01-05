import { isNullish } from '@utils/utils';
import { FC } from 'react';

export interface ProgressBarProps {
  progress?: number;
  message?: string;
}

const defaultMessage = 'Extracting frames ...';

export const ProgressBar: FC<ProgressBarProps> = ({ progress = 0, message }) => {
  if (progress === 0 || progress >= 1) return null;

  const content = isNullish(message) ? defaultMessage : message;
  const label = progress < 0 ? `${content}` : `[${Math.round(progress * 100)}%] ${content}`;
  const value = progress < 0 ? undefined : progress;

  return (
    <div className="form-control grow w-full sm:w-96">
      <progress className="progress w-full" value={value} max="1"></progress>
      <label className="label">
        <span className="label-text-alt">{label}</span>
      </label>
    </div>
  );
};
