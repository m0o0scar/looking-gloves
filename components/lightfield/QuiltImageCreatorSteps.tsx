import cls from 'classnames';
import { FC } from 'react';

import { SequenceProcessorInfo } from './types';

export interface QuiltImageCreatorStepsProps {
  processors?: SequenceProcessorInfo[];
  currentStep?: number;
}

export const QuiltImageCreatorSteps: FC<QuiltImageCreatorStepsProps> = ({
  processors,
  currentStep = 0,
}) => {
  if (!processors?.length) return null;

  return (
    <div className="w-screen flex justify-center">
      <ul className="steps">
        {processors.map((processor, i) => (
          <li key={i} className={cls('step', { 'step-primary': currentStep >= i })}>
            {processor.title}
          </li>
        ))}
        <li className={cls('step', { 'step-primary': currentStep >= processors.length })}>Done</li>
      </ul>
    </div>
  );
};
